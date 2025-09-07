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
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
      {/* Compact Header */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-slate-900">Calendar Progress</h2>
          <div className="text-sm text-slate-500">
            {formatTime(currentTime)} • {dayProgress.toFixed(1)}%
          </div>
        </div>
        <div className="flex gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Start: Jul 12</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Target: Sep 25</span>
          </div>
        </div>
      </div>

      {/* Compact Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Scrollable Calendar Container */}
      <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.date.getMonth() === startDate.getMonth() || 
                                  day.date.getMonth() === targetDate.getMonth();
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.005 }}
                className={`
                  relative h-8 flex items-center justify-center rounded-md border transition-all duration-200 text-xs font-medium
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${day.isStartDate ? 'bg-green-100 border-green-400 text-green-800 shadow-sm' : ''}
                  ${day.isTargetDate ? 'bg-red-100 border-red-400 text-red-800 shadow-sm' : ''}
                  ${day.isToday ? 'bg-blue-100 border-blue-400 text-blue-800 shadow-sm' : ''}
                  ${day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-slate-100 border-slate-300 text-slate-600' : ''}
                  ${day.isFuture && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-white border-slate-200 text-slate-400' : ''}
                  ${day.isInRange && !day.isStartDate && !day.isTargetDate && !day.isToday ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''}
                `}
              >
                <span className="text-xs">
                  {day.date.getDate()}
                </span>
                
                {/* Progress Bar for Today */}
                {day.isToday && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="w-full bg-slate-200 rounded-b-md h-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dayProgress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-blue-500 rounded-b-md"
                      />
                    </div>
                  </div>
                )}
                
                {/* Progress Bar for Past Days */}
                {day.isPast && !day.isStartDate && !day.isTargetDate && !day.isToday && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="w-full bg-slate-300 rounded-b-md h-1">
                      <div className="h-full bg-slate-500 rounded-b-md w-full" />
                    </div>
                  </div>
                )}
                
                {/* Special Indicators */}
                {day.isStartDate && (
                  <div className="absolute top-0 right-0">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  </div>
                )}
                
                {day.isTargetDate && (
                  <div className="absolute top-0 right-0">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Compact Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
          <span>Start</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-400 rounded"></div>
          <span>Target</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-50 border border-yellow-300 rounded"></div>
          <span>Range</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;