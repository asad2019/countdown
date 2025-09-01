import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    decimalMonths: 0,
    decimalWeeks: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [progress, setProgress] = useState({
    elapsed: 0,
    remaining: 0,
    percentage: 0,
  });

  const startDate = new Date('2025-07-12T16:15:00+05:00'); // July 12, 2025 4:15 PM PKT
  const targetDate = new Date('2025-09-25T16:15:00+05:00'); // September 25, 2025 4:15 PM PKT

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const totalSeconds = Math.floor(difference / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        const decimalMonths = (totalDays / 30).toFixed(1);
        const decimalWeeks = (totalDays / 7).toFixed(1);

        setTimeLeft({
          decimalMonths,
          decimalWeeks,
          totalDays,
          totalHours,
          totalMinutes,
          totalSeconds,
          hours,
          minutes,
          seconds,
        });

        // Calculate progress
        const totalDuration = targetDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        const remaining = targetDate.getTime() - now.getTime();
        const percentage = ((elapsed / totalDuration) * 100).toFixed(4);

        setProgress({
          elapsed: Math.floor(elapsed / 1000),
          remaining: Math.floor(remaining / 1000),
          percentage: parseFloat(percentage),
        });
      } else {
        setTimeLeft({
          decimalMonths: 0,
          decimalWeeks: 0,
          totalDays: 0,
          totalHours: 0,
          totalMinutes: 0,
          totalSeconds: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        setProgress({
          elapsed: 0,
          remaining: 0,
          percentage: 100.0000,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };
  
  const pointStats = [
    { label: 'Months to go', value: timeLeft.decimalMonths },
    { label: 'Weeks remaining', value: timeLeft.decimalWeeks },
  ];

  const totalStats = [
    { label: 'Total Days', value: timeLeft.totalDays },
    { label: 'Total Hours', value: timeLeft.totalHours },
    { label: 'Total Minutes', value: timeLeft.totalMinutes },
    { label: 'Total Seconds', value: timeLeft.totalSeconds },
  ];

  return (
    <>
      <Helmet>
        <title>Professional Countdown Timer</title>
        <meta name="description" content="A simple and professional countdown timer to September 25, 2025 at 4:15 PM PST." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-slate-800">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center space-y-10 max-w-4xl mx-auto w-full"
        >
          {/* Header */}
          <div className="space-y-3">
             <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-slate-900"
            >
              Countdown to Launch
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-500"
            >
              July 12, 2025 • 4:15 PM PKT → September 25, 2025 • 4:15 PM PKT
            </motion.p>
          </div>

          {/* Progress Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Overall Progress */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-slate-900">Overall Progress</h3>
                <span className="text-2xl font-mono font-bold text-slate-800">
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
              </div>
            </div>

            {/* Time Progress Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Elapsed Time */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Time Elapsed</h3>
                  <span className="text-sm text-slate-500">
                    {Math.floor(progress.elapsed / 86400)} days
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1, delay: 1.0 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {progress.elapsed.toLocaleString()} seconds passed
                </p>
              </div>

              {/* Remaining Time */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">Time Remaining</h3>
                  <span className="text-sm text-slate-500">
                    {Math.floor(progress.remaining / 86400)} days
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - progress.percentage}%` }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  {progress.remaining.toLocaleString()} seconds left
                </p>
              </div>
            </div>
          </motion.div>

          {/* Points Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            {pointStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className="flex items-center gap-3 bg-slate-100 p-3 px-5 rounded-full border border-slate-200"
              >
                <span className="text-slate-500">{stat.label}:</span>
                <span className="font-semibold text-lg text-slate-800">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Total Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 1.0,
                },
              },
            }}
          >
            {totalStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
              >
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-3xl font-semibold text-slate-900 mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Style Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="bg-slate-800 text-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            <h2 className="text-xl font-semibold text-slate-300 mb-6">Live Progress Counter</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-center">
              {[
                { label: 'Days', value: timeLeft.totalDays % 100 },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((unit, index, arr) => (
                <React.Fragment key={unit.label}>
                  <motion.div
                    key={unit.label + unit.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center w-20"
                  >
                    <div className="text-4xl md:text-6xl font-mono font-bold text-white">
                      {formatNumber(unit.value)}
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">{unit.label}</div>
                  </motion.div>
                  
                  {index < arr.length - 1 && (
                    <div className="text-3xl md:text-5xl text-slate-600 font-light select-none">:</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}

export default App;