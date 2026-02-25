
import React, { useState, useEffect } from 'react';

export const TagBadge: React.FC<{ label: string; type?: 'blue' | 'gray' | 'yellow' | 'purple' }> = ({ label, type = 'gray' }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    gray: "bg-slate-50 text-slate-600 border-slate-100",
    yellow: "bg-amber-50 text-amber-800 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${styles[type]} mr-1.5`}>
      {label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: 'Today' | 'This week' | 'Soon' | 'Past' }> = ({ status }) => {
  let className = "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-none font-mono ";
  let label = "";

  switch (status) {
      case 'Today':
          className += "bg-red-600 text-white border border-red-600";
          label = "TODAY";
          break;
      case 'This week':
          className += "bg-white text-black border border-black";
          label = "THIS WEEK";
          break;
      case 'Soon':
          className += "bg-transparent text-slate-500 border border-dashed border-slate-400";
          label = "UPCOMING";
          break;
      case 'Past':
          className += "text-slate-400 line-through decoration-red-600";
          label = "ARCHIVED";
          break;
      default:
          className += "border border-black text-black";
          label = status;
  }

  return (
    <span className={className}>
      {label}
    </span>
  );
};

export const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4 items-center bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl text-white border border-white/10 shadow-lg">
      <div className="text-right">
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Starts In</div>
      </div>
      <div className="h-8 w-px bg-white/20"></div>
      <div className="flex gap-4 text-center">
        <div>
           <div className="text-2xl font-bold leading-none">{timeLeft.days}</div>
           <div className="text-[10px] uppercase opacity-80">Days</div>
        </div>
        <div>
           <div className="text-2xl font-bold leading-none">{timeLeft.hours}</div>
           <div className="text-[10px] uppercase opacity-80">Hrs</div>
        </div>
      </div>
    </div>
  );
};
