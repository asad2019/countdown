import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Calendar = ({ startDate, targetDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dayProgress, setDayProgress] = useState(0);

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

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(targetDate);
    
    // Start from the beginning of the month containing start date
    const calendarStart = new Date(start.getFullYear(), start.getMonth(), 1);
    
    // End at the end of the month containing target date
    const calendarEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0);
    
    const currentDate = new Date(calendarStart);
    
    while (currentDate <= calendarEnd) {
      const isStartDate = currentDate.toDateString() === start.toDateString();
      const isTargetDate = currentDate.toDateString() === end.toDateString();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < today;
      const isFuture = currentDate > today;
      const isInRange = currentDate >= start && currentDate <= end;
      
      days.push({
        date: new Date(currentDate),
        isStartDate,
        isTargetDate,
        isToday,
        isPast,
        isFuture,
        isInRange,
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
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Calendar Progress</h2>
        <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Start: {formatDate(startDate)} at {formatTime(startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Target: {formatDate(targetDate)} at {formatTime(targetDate)}</span>
          </div>
        </div>
      </div>

      {/* Current Time Display */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Current Time</h3>
            <p className="text-slate-600">{formatDate(currentTime)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-slate-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-slate-500">
              Day Progress: {dayProgress.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.date.getMonth() === startDate.getMonth() || 
                                day.date.getMonth() === targetDate.getMonth();
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${day.isStartDate ? 'bg-green-100 border-green-500 text-green-900' : ''}
                ${day.isTargetDate ? 'bg-red-100 border-red-500 text-red-900' : ''}
                ${day.isToday ? 'bg-blue-100 border-blue-500 text-blue-900' : ''}
                ${day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-slate-100 border-slate-300 text-slate-600' : ''}
                ${day.isFuture && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-white border-slate-200 text-slate-400' : ''}
                ${day.isInRange && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : ''}
              `}
            >
              <span className="text-sm font-semibold">
                {day.date.getDate()}
              </span>
              
              {/* Progress Bar for Today */}
              {day.isToday && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dayProgress}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              )}
              
              {/* Progress Bar for Past Days */}
              {day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday && (
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="w-full bg-slate-300 rounded-full h-1">
                    <div className="h-full bg-slate-500 rounded-full w-full" />
                  </div>
                </div>
              )}
              
              {/* Special Indicators */}
              {day.isStartDate && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
              
              {day.isTargetDate && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
          <span>Start Date</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
          <span>Target Date</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border-2 border-yellow-200 rounded"></div>
          <span>In Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 border-2 border-slate-300 rounded"></div>
          <span>Past</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;