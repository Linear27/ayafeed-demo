import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Live, Theme } from '../../types';

interface LiveDetailHeroProps {
  live: Live;
  theme: Theme;
}

const LiveDetailHero: React.FC<LiveDetailHeroProps> = ({ live, theme: _theme }) => {
  return (
    <>
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden sm:h-[50vh]">
        <img src={live.image || null} alt={live.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper-bg)] via-transparent to-transparent opacity-90" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-[var(--space-xl)] text-center">
          <div className="mb-[var(--space-md)] border-2 border-[var(--paper-surface)] bg-[var(--paper-accent)] px-[var(--space-md)] py-[var(--space-xs)] text-sm font-black tracking-[0.2em] text-[var(--paper-surface)] uppercase">
            特别报导
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="max-w-5xl">
            <h1 className="font-header text-4xl leading-[0.9] font-black text-[var(--paper-text)] drop-shadow-md sm:text-6xl md:text-7xl">
              {live.title}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="relative z-20 bg-[var(--paper-border)] text-[var(--paper-surface)]">
        <div className="mx-auto flex max-w-6xl flex-col divide-y divide-[var(--paper-surface)]/20 md:flex-row md:divide-x md:divide-y-0">
          <div className="flex flex-1 items-center justify-center gap-[var(--space-sm)] p-[var(--space-md)]">
            <Calendar size={20} className="text-[var(--paper-accent)]" />
            <span className="text-lg font-bold tracking-widest">{live.date}</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-[var(--space-lg)] p-[var(--space-md)]">
            <div className="text-center">
              <span className="block text-[10px] font-bold tracking-wider text-[var(--paper-surface)]/70 uppercase">
                开场 (OPEN)
              </span>
              <span className="font-mono text-xl font-bold">{live.openTime || '待定'}</span>
            </div>
            <div className="h-8 w-px bg-[var(--paper-surface)]/20" />
            <div className="text-center">
              <span className="block text-[10px] font-bold tracking-wider text-[var(--paper-surface)]/70 uppercase">
                开演 (START)
              </span>
              <span className="font-mono text-xl font-bold">{live.startTime || '待定'}</span>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center gap-[var(--space-sm)] p-[var(--space-md)]">
            <MapPin size={20} className="text-[var(--paper-accent)]" />
            <span className="text-lg font-bold">{live.venue}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveDetailHero;
