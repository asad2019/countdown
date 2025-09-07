import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Calendar from './components/Calendar';

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
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-800">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center space-y-10 max-w-4xl mx-auto w-full"
        >
          {/* Professional Header */}
          <div className="space-y-4">
             <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent"
            >
              Countdown to Launch
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-200 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-800 font-semibold">July 12, 2025 • 4:15 PM PKT</span>
              </div>
              <div className="text-slate-500 font-medium">→</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-semibold">September 25, 2025 • 4:15 PM PKT</span>
              </div>
            </motion.div>
          </div>

          {/* Progress Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Overall Progress */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Overall Progress</h3>
                <span className="text-3xl font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {progress.percentage}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-full shadow-lg"
                />
              </div>
            </div>

            {/* Time Progress Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Elapsed Time */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Time Elapsed</h3>
                  <span className="text-lg font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {Math.floor(progress.elapsed / 86400)} days
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-3 font-medium">
                  {progress.elapsed.toLocaleString()} seconds passed
                </p>
              </div>

              {/* Remaining Time */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Time Remaining</h3>
                  <span className="text-lg font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    {Math.floor(progress.remaining / 86400)} days
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-5 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - progress.percentage}%` }}
                    transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"
                  />
                </div>
                <p className="text-sm text-slate-600 mt-3 font-medium">
                  {progress.remaining.toLocaleString()} seconds left
                </p>
              </div>
            </div>
          </motion.div>

          {/* Professional Points Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            {pointStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className="flex items-center gap-4 bg-white p-6 px-8 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-sm"
              >
                <span className="text-slate-600 font-medium">{stat.label}:</span>
                <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Professional Total Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
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
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mt-2">
                  {stat.value.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Professional Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white rounded-3xl shadow-2xl p-10 md:p-16 border border-slate-700"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-200 mb-2">Live Progress Counter</h2>
              <p className="text-slate-400">Real-time countdown to launch</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-center">
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
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-5xl md:text-7xl font-mono font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-2">
                      {formatNumber(unit.value)}
                    </div>
                    <div className="text-sm text-slate-300 uppercase tracking-widest font-semibold">{unit.label}</div>
                  </motion.div>
                  
                  {index < arr.length - 1 && (
                    <div className="text-4xl md:text-6xl text-slate-500 font-light select-none">:</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Professional Calendar Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="w-full"
          >
            <Calendar startDate={startDate} targetDate={targetDate} />
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}

export default App;