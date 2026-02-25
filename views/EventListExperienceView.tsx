
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Grid, List, MapPin, Filter, Search, ChevronRight, Sparkles, Clock, Globe } from 'lucide-react';
import { Theme, Event, ViewState } from '../types';
import { fetchEvents } from '../services/api';

interface EventListExperienceViewProps {
  onSelect: (id: string) => void;
  theme: Theme;
  onNavigate: (v: ViewState) => void;
}

const EventListExperienceView: React.FC<EventListExperienceViewProps> = ({ onSelect, theme, onNavigate }) => {
  const isNewspaper = theme === 'newspaper';
  const [events, setEvents] = useState<Event[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'timeline'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const locationName = (e.location as any)?.name || e.location || '';
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           locationName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'ALL' || e.worldRegion === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [events, searchQuery, selectedRegion]);

  // Bento Grid Layout Component
  const BentoGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
      {filteredEvents.slice(0, 8).map((event, idx) => {
        const isLarge = idx === 0 || idx === 5;
        const isWide = idx === 2 || idx === 7;
        
        return (
          <motion.div
            key={event.id}
            layoutId={event.id}
            onClick={() => onSelect(event.id)}
            className={`relative group cursor-pointer overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] ${
              isLarge ? 'md:col-span-2 md:row-span-2' : isWide ? 'md:col-span-2' : ''
            }`}
          >
            <img src={event.image || null} alt={event.title} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                  {event.worldRegion || 'JP'}
                </span>
                <span className="text-white/60 text-[10px] font-mono">{event.date}</span>
              </div>
              <h3 className={`text-white font-black leading-tight ${isLarge ? 'text-2xl' : 'text-sm'} font-header truncate`}>
                {event.title}
              </h3>
              {isLarge && (
                <p className="text-white/70 text-xs mt-2 line-clamp-2 font-serif italic">
                  {event.description}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // Horizontal Timeline Component
  const HorizontalTimeline = () => {
    const sortedEvents = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date));
    
    return (
      <div className="relative py-12">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-black/10 -translate-y-1/2" />
        <div className="flex gap-8 overflow-x-auto pb-8 hide-scrollbar px-4">
          {sortedEvents.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-64 group cursor-pointer" onClick={() => onSelect(event.id)}>
              <div className="text-[10px] font-black font-mono mb-4 text-center text-slate-500 group-hover:text-red-600 transition-colors">
                {event.date}
              </div>
              <div className="relative pt-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black border-2 border-white group-hover:bg-red-600 group-hover:scale-150 transition-all" />
                <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] transition-all">
                  <div className="aspect-video mb-3 overflow-hidden">
                    <img src={event.image || null} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-header font-black text-sm truncate mb-1">{event.title}</h4>
                  <div className="flex items-center gap-1 text-[9px] text-slate-500">
                    <MapPin size={10} /> {(event.location as any)?.name || event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Experimental Header */}
        <header className="mb-12 border-b-4 border-black pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <Sparkles size={20} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Experimental Layout v1.0</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-header tracking-tighter leading-none">
                展会名录<span className="text-red-600">。</span>探索版
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-2 border-black ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                <Grid size={14} /> Bento Grid
              </button>
              <button 
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-2 border-black ${viewMode === 'timeline' ? 'bg-black text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                <Clock size={14} /> Timeline
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all border-2 border-black ${viewMode === 'calendar' ? 'bg-black text-white' : 'bg-white hover:bg-slate-50'}`}
              >
                <Calendar size={14} /> Calendar
              </button>
            </div>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索展会、地点、关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20"
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'JP', 'CN', 'OVERSEA'].map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-6 py-4 font-black text-xs uppercase tracking-widest border-2 border-black transition-all ${selectedRegion === reg ? 'bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-slate-50'}`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'grid' && <BentoGrid />}
            {viewMode === 'timeline' && <HorizontalTimeline />}
            {viewMode === 'calendar' && (
              <div className="bg-white border-4 border-black p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <Calendar size={64} className="mx-auto mb-6 text-slate-200" />
                <h2 className="text-3xl font-black font-header mb-4">全屏日历视图正在施工中</h2>
                <p className="text-slate-500 font-serif italic max-w-md mx-auto">
                  文文新闻的技术天狗正在努力调试全屏日历布局，敬请期待下一期特报。
                </p>
                <button 
                  onClick={() => setViewMode('grid')}
                  className="mt-8 px-8 py-3 bg-black text-white font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  返回网格视图
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => onNavigate('EVENT_LIST')}
            className="flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-black uppercase tracking-[0.2em] text-xs"
          >
            返回标准名录 <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventListExperienceView;
