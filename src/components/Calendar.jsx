import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Calendar = ({ startDate, targetDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dayProgress, setDayProgress] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      // Calculate day progress (day starts at 4:15 PM)
      const dayStart = new Date(now);
      dayStart.setHours(16, 15, 0, 0); // 4:15 PM
      
      // If current time is before 4:15 PM, it's still the previous day
      if (now < dayStart) {
        dayStart.setDate(dayStart.getDate() - 1);
      }
      
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const totalDayDuration = dayEnd.getTime() - dayStart.getTime();
      const elapsedTime = now.getTime() - dayStart.getTime();
      
      const progress = Math.max(0, Math.min(100, (elapsedTime / totalDayDuration) * 100));
      setDayProgress(progress);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(targetDate);
    
    // Get first day of current month and how many days to show before it
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Start from the Sunday of the week containing the first day
    const calendarStart = new Date(firstDayOfMonth);
    calendarStart.setDate(calendarStart.getDate() - firstDayWeekday);
    
    // Show 4 weeks (28 days) starting from calendarStart
    const currentDate = new Date(calendarStart);
    
    for (let i = 0; i < 28; i++) {
      const isStartDate = currentDate.toDateString() === start.toDateString();
      const isTargetDate = currentDate.toDateString() === end.toDateString();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today;
      const isFuture = currentDate > today;
      const isInRange = currentDate >= start && currentDate <= end;
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      
      days.push({
        date: new Date(currentDate),
        isStartDate,
        isTargetDate,
        isToday,
        isPast,
        isFuture,
        isInRange,
        isCurrentMonth,
        dayProgress: isToday ? dayProgress : (isPast ? 100 : 0)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 max-w-sm mx-auto w-full">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">Calendar</h2>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.span 
            key={`${currentMonth}-${currentYear}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-semibold text-slate-700 min-w-[120px] text-center"
          >
            {monthNames[currentMonth]} {currentYear}
          </motion.span>
          <motion.button
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Compact Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Compact Calendar Grid - 4 rows */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-md border transition-all duration-200 hover:scale-105 cursor-pointer
                ${!day.isCurrentMonth ? 'opacity-30 text-slate-400' : ''}
                ${day.isStartDate ? 'bg-red-500 border-red-600 text-white shadow-lg' : ''}
                ${day.isTargetDate ? 'bg-green-500 border-green-600 text-white shadow-lg' : ''}
                ${day.isToday ? 'bg-blue-500 border-blue-600 text-white shadow-lg' : ''}
                ${day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-slate-200 border-slate-300 text-slate-600' : ''}
                ${day.isFuture && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50' : ''}
                ${day.isInRange && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : ''}
              `}
            >
              <span className="text-xs font-semibold">
                {day.date.getDate()}
              </span>
              
              {/* Compact Progress Indicator for Today */}
              {day.isToday && (
                <div className="absolute bottom-0.5 left-0.5 right-0.5">
                  <div className="w-full bg-white/30 rounded-full h-0.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dayProgress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              )}
              
              {/* Compact Progress Indicator for Past Days */}
              {day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday && (
                <div className="absolute bottom-0.5 left-0.5 right-0.5">
                  <div className="w-full bg-slate-400 rounded-full h-0.5">
                    <div className="h-full bg-slate-600 rounded-full w-full" />
                  </div>
                </div>
              )}
              
              {/* Special Indicators */}
              {day.isStartDate && (
                <div className="absolute top-0.5 right-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
              
              {day.isTargetDate && (
                <div className="absolute top-0.5 right-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Compact Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Target</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>Range</span>
        </div>
      </div>

      {/* Current Time Display */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-slate-500">
              {dayProgress.toFixed(1)}% day progress
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600">
              {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;