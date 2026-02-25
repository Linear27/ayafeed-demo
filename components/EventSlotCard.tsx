
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
      className="mb-6 transition-all duration-200 group relative bg-white border-2 border-slate-900 newspaper-shadow hover:newspaper-shadow-hover"
    >
        <div className="px-4 py-2 flex justify-between items-center border-b-2 border-dashed border-slate-300 bg-[#FDFBF7]">
          <h3 className="font-black text-slate-900 text-lg flex items-center font-header tracking-tight">
             <span className="text-xs px-1 mr-2 font-mono self-center pt-0.5 bg-red-600 text-white">DATE</span>
             {dateStr}
          </h3>
          <div className="flex items-center font-mono overflow-hidden">
             <MapPin size={14} className="mr-1.5 shrink-0 text-red-600" /> 
             <div className="truncate flex items-center">
                <span className="text-xs font-bold truncate text-slate-900">{locationStr}</span>
             </div>
          </div>
        </div>

        <div 
           className="p-4 cursor-pointer group/main flex gap-5 bg-[#FDFBF7]" 
           onClick={() => onSelect(mainEvent.slug || mainEvent.id)}
        >
           <div className={`shrink-0 ${isLandscape ? 'w-32 sm:w-48' : 'w-24 sm:w-32'} relative`}>
               <div className={`${isLandscape ? 'aspect-video' : 'aspect-[3/4]'} bg-slate-200 overflow-hidden relative shadow-sm border border-slate-900`}>
                  {mainEvent.poster?.urls.original ? (
                      <img src={mainEvent.poster.urls.original} alt={mainEvent.title} className="w-full h-full object-cover transition-all duration-500" />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-100">
                          <span className="text-[10px] font-bold text-slate-400">NO IMAGE</span>
                      </div>
                  )}
               </div>
           </div>

           <div className="flex-1 min-w-0 flex flex-col">
              <div className="mb-2">
                 <h4 className="font-black text-xl sm:text-2xl text-slate-900 leading-[1.1] font-header transition-colors mb-2 group-hover/main:text-red-700">
                   {mainEvent.title}
                 </h4>
                 <div className="flex flex-wrap gap-1">
                    {mainEvent.genres?.slice(0, 4).map((g, i) => (
                      <span key={i} className="text-[10px] font-bold px-1.5 py-0.5 uppercase text-slate-700 bg-white border border-slate-300">
                        {g}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="text-xs font-serif text-slate-600 line-clamp-2 leading-relaxed mb-2">
                {mainEvent.summary}
              </div>

              <div className="mt-auto pt-2 border-t border-slate-200 flex justify-between items-center">
                 <div className="text-xs font-bold text-slate-500 font-mono">
                    ORG: {mainEvent.organizer || 'Unknown'}
                 </div>
                 <div className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-white">
                    {mainEvent.boothCount && mainEvent.boothCount > 0 ? `${mainEvent.boothCount} SP` : 'EVENT'}
                 </div>
              </div>
           </div>
        </div>

        {otherEvents.length > 0 && (
          <div className="p-4 space-y-2 bg-slate-50 border-t-2 border-slate-900">
             <div className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center text-slate-500">
                Concurrent Events
             </div>
             <div className="space-y-1">
               {otherEvents.map((subEvent) => (
                  <div 
                    key={subEvent.id}
                    onClick={() => onSelect(subEvent.slug || subEvent.id)}
                    className="flex items-center justify-between p-2 cursor-pointer group/other bg-white border border-slate-200 hover:border-red-500"
                  >
                     <div className="font-bold text-sm font-header truncate group-hover/other:text-red-700">{subEvent.title}</div>
                     <ChevronRight size={14} className="opacity-50" />
                  </div>
               ))}
             </div>
          </div>
        )}
    </motion.div>
  );
};

export default EventSlotCard;
