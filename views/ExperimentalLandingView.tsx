
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, MapPin, Calendar, Clock, 
  Globe, Radio, Sparkles, ChevronRight, 
  Search, Filter, LayoutGrid, List,
  TrendingUp, Newspaper, Bell, Info, Music,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Theme, Event, Live } from '../types';
import { fetchEvents, fetchLives } from '../services/api';

const ExperimentalLandingView: React.FC<{ theme: Theme }> = ({ theme }) => {
  const isNewspaper = theme === 'newspaper';
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [lives, setLives] = useState<Live[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRegion, setActiveRegion] = useState('GLOBAL');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, livesData] = await Promise.all([fetchEvents(), fetchLives()]);
        setEvents(eventsData);
        setLives(livesData);
      } catch (error) {
        console.error("Failed to load experimental landing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeRegion === 'GLOBAL') return events;
    return events.filter(e => e.worldRegion === activeRegion);
  }, [events, activeRegion]);

  const featuredEvent = filteredEvents[0];
  const displayEvents = filteredEvents.slice(1, 4);
  const upcomingLives = lives.slice(0, 3);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className={`min-h-screen pb-20 ${isNewspaper ? 'bg-[#E4E3E0] text-[#141414] font-serif' : 'bg-slate-50 text-slate-900 font-sans'}`}>
      
      {/* Ticker */}
      <div className={`w-full py-2 border-b-2 flex items-center overflow-hidden whitespace-nowrap ${isNewspaper ? 'bg-black text-white border-black' : 'bg-indigo-600 text-white border-indigo-700'}`}>
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-12"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Radio size={12} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {events[i % events.length]?.title || 'LATEST NEWS'}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-2 border-current pb-6">
          <div>
            <h1 className={`text-6xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.85] ${isNewspaper ? 'font-header' : ''}`}>
              AyaFeed<span className={isNewspaper ? 'text-red-600' : 'text-indigo-600'}>.</span>
            </h1>
            <p className="text-sm md:text-base font-bold uppercase tracking-widest mt-4 opacity-60 flex items-center gap-2">
              <Globe size={16} /> Gensokyo Intelligence Network
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-4xl font-black tracking-tighter mb-1">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
            <div className="text-xs font-mono uppercase tracking-widest opacity-50">Vol. 13,042 / {activeRegion} Edition</div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Featured Event (Col span 8) */}
          {featuredEvent && (
            <div 
              onClick={() => navigate({ to: '/events/$eventId', params: { eventId: featuredEvent.id } })}
              className={`lg:col-span-8 relative h-[500px] md:h-[700px] group cursor-pointer overflow-hidden flex flex-col justify-end ${
                isNewspaper 
                  ? 'border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white' 
                  : 'rounded-3xl shadow-xl bg-white'
              }`}
            >
              <img src={featuredEvent.image || null} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={featuredEvent.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="relative z-10 p-8 md:p-12 text-white w-full md:w-4/5">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${isNewspaper ? 'bg-red-600' : 'bg-indigo-600'}`}>
                    Top Story
                  </span>
                  <span className="px-3 py-1 text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-md">
                    {featuredEvent.worldRegion || 'JP'}
                  </span>
                </div>
                <h2 className={`text-4xl md:text-6xl font-black leading-[1.1] mb-6 ${isNewspaper ? 'font-header' : ''}`}>
                  {featuredEvent.title}
                </h2>
                <div className="flex flex-wrap items-center gap-6 text-sm font-mono opacity-80">
                  <span className="flex items-center gap-2"><Calendar size={16}/> {featuredEvent.date}</span>
                  <span className="flex items-center gap-2"><MapPin size={16}/> {(featuredEvent.location as any)?.name || featuredEvent.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Right Column (Col span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Live Status Widget */}
            <div 
              onClick={() => navigate({ to: '/lives' })}
              className={`p-8 flex-1 flex flex-col justify-between cursor-pointer group ${
                isNewspaper 
                  ? 'border-2 border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] hover:shadow-[12px_12px_0px_0px_rgba(220,38,38,1)] transition-shadow' 
                  : 'bg-indigo-600 text-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Radio size={16} className="animate-pulse text-red-500" /> Live Stage
                  </h3>
                  <ArrowUpRight size={20} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                {upcomingLives[0] && (
                  <div>
                    <h4 className={`text-3xl font-black leading-tight mb-3 ${isNewspaper ? 'font-header' : ''}`}>{upcomingLives[0].title}</h4>
                    <p className="text-sm opacity-80 font-mono flex items-center gap-2">
                      <MapPin size={14} /> {upcomingLives[0].venue}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest">View Schedule</span>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>

            {/* Region Selector */}
            <div className={`p-8 flex-1 flex flex-col ${
              isNewspaper 
                ? 'border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-white rounded-3xl shadow-sm border border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest opacity-50">Coverage</h3>
                <Globe size={16} className="opacity-30" />
              </div>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {['GLOBAL', 'JP', 'CN', 'OVERSEA'].map(reg => (
                  <button 
                    key={reg}
                    onClick={() => setActiveRegion(reg)}
                    className={`p-4 text-left border-2 transition-all flex flex-col justify-between ${
                      activeRegion === reg 
                        ? (isNewspaper ? 'border-black bg-black text-white' : 'border-indigo-600 bg-indigo-50 text-indigo-700')
                        : (isNewspaper ? 'border-transparent hover:border-black/20 bg-slate-100' : 'border-transparent hover:border-slate-200 bg-slate-50 text-slate-600')
                    }`}
                  >
                    <div className="text-xs font-black uppercase tracking-widest mb-2">{reg}</div>
                    <div className={`text-2xl font-black ${activeRegion === reg ? '' : 'opacity-50'}`}>
                      {events.filter(e => reg === 'GLOBAL' || e.worldRegion === reg).length}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Secondary Grid (News List) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <div 
              key={event.id} 
              onClick={() => navigate({ to: '/events/$eventId', params: { eventId: event.id } })}
              className={`group cursor-pointer flex flex-col ${
                isNewspaper 
                  ? 'border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all' 
                  : 'bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition-all'
              }`}
            >
              <div className={`h-48 overflow-hidden relative ${isNewspaper ? 'border-b-2 border-black' : ''}`}>
                <img src={event.image || null} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={event.title} />
                <div className={`absolute top-4 right-4 px-2 py-1 text-[10px] font-black uppercase tracking-widest ${isNewspaper ? 'bg-white text-black border-2 border-black' : 'bg-black/70 backdrop-blur-md text-white rounded'}`}>
                  {event.worldRegion || 'JP'}
                </div>
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold opacity-50 mb-4 uppercase tracking-widest">
                  <Calendar size={12}/> {event.date}
                </div>
                <h3 className={`text-xl font-black leading-tight mb-4 group-hover:text-red-600 transition-colors ${isNewspaper ? 'font-header' : ''}`}>
                  {event.title}
                </h3>
                <p className={`text-sm opacity-70 line-clamp-2 mb-8 flex-1 ${isNewspaper ? 'font-serif' : ''}`}>
                  {event.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-current/10">
                  <span className="text-xs font-black uppercase tracking-widest opacity-50 truncate pr-4">{event.organizer}</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => navigate({ to: '/events' })}
            className={`py-4 px-8 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
              isNewspaper 
                ? 'bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-none hover:translate-y-1 hover:translate-x-1' 
                : 'bg-slate-900 text-white rounded-full hover:bg-indigo-600 shadow-lg hover:shadow-xl'
            }`}
          >
            Browse Full Archive <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExperimentalLandingView;
