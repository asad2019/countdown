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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 max-w-md mx-auto w-full backdrop-blur-sm">
      {/* Professional Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Timeline</h2>
          <p className="text-sm text-slate-500 mt-1">Track your progress visually</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.div 
            key={`${currentMonth}-${currentYear}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center min-w-[140px]"
          >
            <div className="text-lg font-bold text-slate-800">
              {monthNames[currentMonth]}
            </div>
            <div className="text-sm text-slate-500">
              {currentYear}
            </div>
          </motion.div>
          <motion.button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Professional Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Professional Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 hover:scale-110 cursor-pointer group
                ${!day.isCurrentMonth ? 'opacity-40 text-slate-400' : ''}
                ${day.isStartDate ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-500 text-white shadow-xl ring-2 ring-red-200' : ''}
                ${day.isTargetDate ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-xl ring-2 ring-green-200' : ''}
                ${day.isToday ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-500 text-white shadow-xl ring-2 ring-blue-200' : ''}
                ${day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200' : ''}
                ${day.isFuture && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300' : ''}
                ${day.isInRange && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 text-amber-800 hover:bg-gradient-to-br hover:from-amber-100 hover:to-yellow-100' : ''}
              `}
            >
              <span className="text-sm font-bold">
                {day.date.getDate()}
              </span>
              
              {/* Professional Progress Indicator for Today */}
              {day.isToday && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="w-full bg-white/30 rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dayProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>
              )}
              
              {/* Professional Progress Indicator for Past Days */}
              {day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="w-full bg-slate-300 rounded-full h-1">
                    <div className="h-full bg-slate-500 rounded-full w-full shadow-sm" />
                  </div>
                </div>
              )}
              
              {/* Professional Special Indicators */}
              {day.isStartDate && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                </div>
              )}
              
              {day.isTargetDate && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                </div>
              )}
              
              {/* Current Date Pulse Animation */}
              {day.isToday && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-blue-400"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Professional Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm"></div>
          <span className="text-sm font-medium text-slate-700">Start Point</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm"></div>
          <span className="text-sm font-medium text-slate-700">Target Date</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm"></div>
          <span className="text-sm font-medium text-slate-700">Current Day</span>
        </div>
        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
          <div className="w-4 h-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg shadow-sm"></div>
          <span className="text-sm font-medium text-slate-700">Project Range</span>
        </div>
      </div>

      {/* Professional Current Time Display */}
      <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-bold text-slate-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-slate-600">
              {dayProgress.toFixed(1)}% day progress
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-800">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-xs text-slate-500">
              {currentTime.getFullYear()}
            </div>
          </div>
        </div>
        
        {/* Day Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dayProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;