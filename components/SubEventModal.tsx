
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, History, Calendar, Info, ArrowRight, Library, FileText, Stamp, MapPin } from 'lucide-react';
import { Event, Theme } from '../types';
import { fetchEvents } from '../services/api';

interface SubEventModalProps {
  subEvent: {
    id?: string;
    title: string;
    url?: string;
    type?: 'Sub' | 'External';
    image?: string;
    description?: string;
  };
  parentEvent: Event;
  onClose: () => void;
}

/**
 * Local helper to generate a simple hash for consistent pseudo-IDs
 */
const getHashCode = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase();
};

const SubEventModal: React.FC<SubEventModalProps> = ({ subEvent, parentEvent, onClose }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  // Find the full event data if ID exists, or try to match by title
  const fullEventData = useMemo(() => {
    if (subEvent.id) return events.find(e => e.id === subEvent.id);
    return events.find(e => e.title === subEvent.title);
  }, [subEvent, events]);

  // Extract series name (e.g., "文々。新闻友の会" from "第百四十一季 文々。新闻友の会")
  const seriesName = useMemo(() => {
    const title = subEvent.title;
    // Common pattern: Remove "第...回" or "第...季" or numbering at start/end
    return title.replace(/第[一二三四五六七八九十百\d]+[回季]/g, '').trim();
  }, [subEvent.title]);

  // Find history: other events that contain the series name
  const historyEvents = useMemo(() => {
    return events.filter(e => 
      e.title.includes(seriesName) && e.id !== subEvent.id && e.id !== parentEvent.id
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [seriesName, subEvent.id, parentEvent.id, events]);

  const displayDescription = fullEventData?.description || subEvent.description || "暂无该企划的详细介绍。";

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-2xl max-h-[85vh] relative flex flex-col overflow-hidden bg-[#FDFBF7] border-4 border-black newspaper-shadow"
      >
        {/* Header */}
        <div className="p-6 border-b-2 flex justify-between items-start bg-slate-100 border-black">
          <div className="min-w-0">
             <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-black text-white">
                  {subEvent.type === 'External' ? 'PETIT ONLY' : 'CONSTITUENT'}
                </span>
                <span className="text-[10px] font-bold font-mono text-red-600">
                  LINEAGE: {seriesName.toUpperCase()}
                </span>
             </div>
             <h3 className="text-2xl sm:text-3xl font-black leading-tight font-header text-slate-900">
               {subEvent.title}
             </h3>
          </div>
          <button onClick={onClose} className="p-1.5 transition-colors hover:bg-black hover:text-white border border-transparent hover:border-black">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 custom-scrollbar">
          {/* Main Info */}
          <section className="flex flex-col md:flex-row gap-6">
            {subEvent.image && (
              <div className="w-full md:w-48 shrink-0 aspect-[3/4] overflow-hidden relative border-2 border-black p-1 bg-white">
                <img src={subEvent.image} className="w-full h-full object-cover" alt={subEvent.title} />
              </div>
            )}
            <div className="flex-1">
              <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center text-red-600">
                <Info size={14} className="mr-2" /> Current Session Scoop
              </h4>
              <div className="leading-relaxed text-sm sm:text-base font-serif text-slate-800">
                {displayDescription}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-xs font-bold text-slate-500">
                  <Calendar size={14} className="mr-2" /> 
                  <span className="uppercase font-mono mr-2">Host Date:</span> {parentEvent.date}
                </div>
                <div className="flex items-center text-xs font-bold text-slate-500">
                  <Library size={14} className="mr-2" /> 
                  <span className="uppercase font-mono mr-2">Main Stage:</span> {parentEvent.title}
                </div>
              </div>
            </div>
          </section>

          {/* History Archive */}
          <section>
            <div className="flex items-center justify-between mb-4 border-b-2 pb-1 border-black">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center text-black font-header">
                <History size={16} className="mr-2" /> Series Archive / 历届存根
              </h4>
              <div className="text-[10px] font-mono text-slate-400 uppercase">SERIES-ID: {getHashCode(seriesName)}</div>
            </div>

            {historyEvents.length > 0 ? (
              <div className="space-y-3">
                {historyEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className="flex items-center gap-4 p-3 transition-all bg-white border border-slate-300 hover:border-black hover:shadow-md"
                  >
                    <div className="w-10 h-10 flex flex-col items-center justify-center shrink-0 border-r border-black">
                      <span className="text-[8px] font-mono font-bold text-slate-400">{evt.date.split('-')[0]}</span>
                      <span className="text-xs font-mono font-black text-red-600">{evt.date.split('-')[1]}/{evt.date.split('-')[2]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-black truncate">{evt.title}</div>
                      <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        <MapPin size={10}/> {evt.location}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-red-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-slate-300 bg-slate-50">
                <FileText size={24} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs font-serif italic text-slate-400">My scouts haven't found any past records for this specific series yet.</p>
              </div>
            )}
          </section>

          {/* Action Footer */}
          <div className="pt-4 flex justify-end">
            {subEvent.url && subEvent.url !== '#' && (
              <a 
                href={subEvent.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 font-black text-xs uppercase tracking-widest transition-all bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-1 active:shadow-none"
              >
                访问专题主页 <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Newspaper Decorative Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] rotate-[-15deg]">
          <Stamp size={300} className="text-black" />
        </div>
      </motion.div>
    </div>
  );
};

export default SubEventModal;
