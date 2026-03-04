
import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  count?: number;
}

const SkeletonPulse: React.FC<{ className: string }> = ({ className }) => (
  <motion.div
    animate={{ opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    className={`${className} bg-[var(--paper-border)]/10 border border-[var(--paper-border)]/5`}
  />
);

export const EventCardSkeleton: React.FC<SkeletonProps> = ({ count = 2 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow-sm">
          <div className="flex justify-between mb-4">
             <SkeletonPulse className="w-24 h-5" />
             <SkeletonPulse className="w-20 h-5" />
          </div>
          <div className="flex gap-4">
             <SkeletonPulse className="w-24 h-32 shrink-0" />
             <div className="flex-1 space-y-3">
                <SkeletonPulse className="w-full h-7" />
                <SkeletonPulse className="w-3/4 h-4" />
                <div className="flex gap-2 mt-4">
                   <SkeletonPulse className="w-10 h-4" />
                   <SkeletonPulse className="w-10 h-4" />
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const LiveCardSkeleton: React.FC<SkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row h-auto md:h-48 bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow-sm">
          <SkeletonPulse className="h-12 md:w-28 md:h-full shrink-0" />
          <div className="flex-1 p-5 space-y-4">
            <SkeletonPulse className="w-20 h-4" />
            <SkeletonPulse className="w-full h-8" />
            <SkeletonPulse className="w-1/2 h-4" />
          </div>
          <SkeletonPulse className="h-32 md:w-40 md:h-full shrink-0" />
        </div>
      ))}
    </div>
  );
};

export const CircleCardSkeleton: React.FC<SkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-auto pb-4 overflow-hidden bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow-sm">
          <SkeletonPulse className="h-24 w-full" />
          <div className="px-4 relative -mt-8">
             <SkeletonPulse className="w-16 h-16 mb-3 border-4 border-[var(--paper-surface)]" />
             <SkeletonPulse className="w-2/3 h-5 mb-2" />
             <SkeletonPulse className="w-1/3 h-3 mb-4" />
             <div className="flex gap-2">
                <SkeletonPulse className="w-10 h-4" />
                <SkeletonPulse className="w-10 h-4" />
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};
