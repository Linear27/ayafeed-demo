
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { EventSlot } from '../types';

interface EventSlotCardProps {
  slot: EventSlot;
  onSelect: (id: string) => void;
}

const EventSlotCard: React.FC<EventSlotCardProps> = ({ slot, onSelect }) => {
  const { key: slotKey, dateStr, locationStr, events } = slot;
  
  const mainEvent = events[0];
  const otherEvents = events.slice(1);
  
  const isLandscape = mainEvent.posterOrientation === 'landscape';

  return (
    <motion.div 
      key={slotKey} 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="mb-6 transition-all duration-200 group relative bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow hover:newspaper-shadow-hover"
    >
        <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)]/50 px-[var(--space-md)] py-[var(--space-sm)]">
          <h3 className="font-black text-[var(--paper-text)] text-lg flex items-center font-header tracking-tight">
             <span className="mr-[var(--space-sm)] self-center bg-[var(--paper-accent)] px-[var(--space-xs)] pt-0.5 font-mono text-xs text-[var(--paper-surface)]">DATE</span>
             {dateStr}
          </h3>
          <div className="flex items-center font-mono overflow-hidden">
             <MapPin size={14} className="mr-1.5 shrink-0 text-[var(--paper-accent)]" /> 
             <div className="truncate flex items-center">
                <span className="text-xs font-bold truncate text-[var(--paper-text)]">{locationStr}</span>
             </div>
          </div>
        </div>

        <div 
           className="group/main flex cursor-pointer gap-[var(--space-lg)] bg-[var(--paper-surface)] p-[var(--space-md)]" 
           onClick={() => onSelect(mainEvent.slug || mainEvent.id)}
        >
           <div className={`shrink-0 ${isLandscape ? 'w-32 sm:w-48' : 'w-24 sm:w-32'} relative`}>
               <div className={`${isLandscape ? 'aspect-video' : 'aspect-[3/4]'} relative overflow-hidden border border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)] shadow-[var(--paper-shadow-sm)]`}>
                  {mainEvent.poster?.urls.original ? (
                      <img src={mainEvent.poster.urls.original} alt={mainEvent.title} className="w-full h-full object-cover transition-all duration-500" />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[var(--paper-bg-secondary)]/30">
                          <span className="text-[10px] font-bold text-[var(--paper-text-muted)]/40">NO IMAGE</span>
                      </div>
                  )}
               </div>
           </div>

           <div className="flex-1 min-w-0 flex flex-col">
              <div className="mb-2">
                 <h4 className="font-black text-xl sm:text-2xl text-[var(--paper-text)] leading-[1.1] font-header transition-colors mb-2 group-hover/main:text-[var(--paper-accent)]">
                   {mainEvent.title}
                 </h4>
                 <div className="flex flex-wrap gap-1">
                    {mainEvent.genres?.slice(0, 4).map((g, i) => (
                      <span key={i} className="border border-[var(--paper-border)]/10 bg-[var(--paper-bg-secondary)]/30 px-1.5 py-0.5 text-[10px] font-bold text-[var(--paper-text-muted)] uppercase">
                        {g}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="text-xs font-serif text-[var(--paper-text-muted)] line-clamp-2 leading-relaxed mb-2 italic">
                {mainEvent.summary}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-[var(--paper-border)]/10 pt-[var(--space-sm)]">
                 <div className="text-xs font-bold text-[var(--paper-text-muted)]/60 font-mono">
                    ORG: {mainEvent.organizer || 'Unknown'}
                 </div>
                 <div className="bg-[var(--paper-border)] px-[var(--space-sm)] py-0.5 text-xs font-bold text-[var(--paper-surface)]">
                    {mainEvent.boothCount && mainEvent.boothCount > 0 ? `${mainEvent.boothCount} SP` : 'EVENT'}
                 </div>
              </div>
           </div>
        </div>

        {otherEvents.length > 0 && (
          <div className="space-y-[var(--space-sm)] border-t-2 border-[var(--paper-border)]/10 bg-[var(--paper-bg-secondary)]/30 p-[var(--space-md)]">
             <div className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center text-[var(--paper-text-muted)]/60">
                Concurrent Events
             </div>
             <div className="space-y-1">
               {otherEvents.map((subEvent) => (
                  <div 
                    key={subEvent.id}
                    onClick={() => onSelect(subEvent.slug || subEvent.id)}
                    className="flex items-center justify-between p-2 cursor-pointer group/other bg-[var(--paper-surface)] border border-[var(--paper-border)]/10 hover:border-[var(--paper-accent)]/40"
                  >
                     <div className="font-bold text-sm font-header truncate text-[var(--paper-text)] group-hover/other:text-[var(--paper-accent)]">{subEvent.title}</div>
                     <ChevronRight size={14} className="opacity-30 text-[var(--paper-text)]" />
                  </div>
               ))}
             </div>
          </div>
        )}
    </motion.div>
  );
};

export default EventSlotCard;
