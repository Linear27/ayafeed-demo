
import React, { useState, useEffect } from 'react';

export const TagBadge: React.FC<{ label: string; type?: 'blue' | 'gray' | 'yellow' | 'purple' }> = ({ label, type = 'gray' }) => {
  const styles = {
    blue: "bg-[var(--paper-bg-secondary)] text-blue-800 border-[var(--paper-border)]/20",
    gray: "bg-[var(--paper-bg-secondary)] text-[var(--paper-text-muted)] border-[var(--paper-border)]/20",
    yellow: "bg-[var(--paper-bg-secondary)] text-amber-900 border-[var(--paper-border)]/20",
    purple: "bg-[var(--paper-bg-secondary)] text-purple-900 border-[var(--paper-border)]/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold border ${styles[type]} mr-1.5 uppercase tracking-tighter`}>
      {label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: 'Today' | 'This week' | 'Soon' | 'Past' }> = ({ status }) => {
  let className = "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-none font-mono ";
  let label = "";

  switch (status) {
      case 'Today':
          className += "bg-[var(--paper-accent)] text-[var(--paper-surface)] border border-[var(--paper-accent)]";
          label = "TODAY";
          break;
      case 'This week':
          className += "bg-[var(--paper-surface)] text-[var(--paper-text)] border border-[var(--paper-border)]";
          label = "THIS WEEK";
          break;
      case 'Soon':
          className += "bg-transparent text-[var(--paper-text-muted)] border border-dashed border-[var(--paper-border)]/40";
          label = "UPCOMING";
          break;
      case 'Past':
          className += "text-[var(--paper-text-muted)] opacity-60 line-through decoration-[var(--paper-accent)]";
          label = "ARCHIVED";
          break;
      default:
          className += "border border-[var(--paper-border)] text-[var(--paper-text)]";
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
    <div className="flex gap-4 items-center bg-[var(--paper-border)]/90 backdrop-blur-md px-6 py-3 rounded-none text-[var(--paper-surface)] border border-[var(--paper-border)] shadow-lg transform -rotate-1">
      <div className="text-right">
        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Starts In</div>
      </div>
      <div className="h-8 w-px bg-[var(--paper-surface)]/20"></div>
      <div className="flex gap-4 text-center">
        <div>
           <div className="text-2xl font-black leading-none">{timeLeft.days}</div>
           <div className="text-[10px] uppercase opacity-80 font-bold">Days</div>
        </div>
        <div>
           <div className="text-2xl font-black leading-none">{timeLeft.hours}</div>
           <div className="text-[10px] uppercase opacity-80 font-bold">Hrs</div>
        </div>
      </div>
    </div>
  );
};
