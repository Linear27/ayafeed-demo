
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
        <div className="px-4 py-2 flex justify-between items-center border-b-2 border-dashed border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)]/50">
          <h3 className="font-black text-[var(--paper-text)] text-lg flex items-center font-header tracking-tight">
             <span className="text-xs px-1 mr-2 font-mono self-center pt-0.5 bg-[var(--paper-accent)] text-[var(--paper-surface)]">DATE</span>
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
           className="p-4 cursor-pointer group/main flex gap-5 bg-[var(--paper-surface)]" 
           onClick={() => onSelect(mainEvent.slug || mainEvent.id)}
        >
           <div className={`shrink-0 ${isLandscape ? 'w-32 sm:w-48' : 'w-24 sm:w-32'} relative`}>
               <div className={`${isLandscape ? 'aspect-video' : 'aspect-[3/4]'} bg-[var(--paper-bg-secondary)] overflow-hidden relative shadow-sm border border-[var(--paper-border)]/20`}>
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
                      <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 uppercase text-[var(--paper-text-muted)] bg-[var(--paper-bg-secondary)]/30 border border-[var(--paper-border)]/10">
                        {g}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="text-xs font-serif text-[var(--paper-text-muted)] line-clamp-2 leading-relaxed mb-2 italic">
                {mainEvent.summary}
              </div>

              <div className="mt-auto pt-2 border-t border-[var(--paper-border)]/10 flex justify-between items-center">
                 <div className="text-xs font-bold text-[var(--paper-text-muted)]/60 font-mono">
                    ORG: {mainEvent.organizer || 'Unknown'}
                 </div>
                 <div className="text-xs font-bold px-2 py-0.5 bg-[var(--paper-border)] text-[var(--paper-surface)]">
                    {mainEvent.boothCount && mainEvent.boothCount > 0 ? `${mainEvent.boothCount} SP` : 'EVENT'}
                 </div>
              </div>
           </div>
        </div>

        {otherEvents.length > 0 && (
          <div className="p-4 space-y-2 bg-[var(--paper-bg-secondary)]/30 border-t-2 border-[var(--paper-border)]/10">
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
