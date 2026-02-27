
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicEventListItem, PublicLiveListItem } from '../types';
import { fetchEvents, fetchLives } from '../services/api';
import { HeroCarousel, ScoopSection, LiveSidebar } from '../components/LandingSections';
import { EventCardSkeleton } from '../components/Skeleton';
import { Link } from '@tanstack/react-router';
import { ChevronDown, Radio, Check, AlertTriangle, RefreshCcw, ArrowRight } from 'lucide-react';

const WORLD_REGIONS = [
  { id: 'JAPAN', label: '日本国内', desc: '文文新闻本部' },
  { id: 'CN_MAINLAND', label: '中国大陆', desc: '特别特报频道' },
  { id: 'OVERSEAS', label: '海外分社', desc: '联合情报中心' },
];

const LandingView: React.FC<{ 
  region: string;
  onSetRegion: (reg: string) => void;
}> = ({ region, onSetRegion }) => {
  const MOCK_TODAY = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [isEditionMenuOpen, setIsEditionMenuOpen] = useState(false);
  const [events, setEvents] = useState<PublicEventListItem[]>([]);
  const [lives, setLives] = useState<PublicLiveListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [eventsData, livesData] = await Promise.all([
        fetchEvents(), 
        fetchLives()
      ]);
      setEvents(eventsData);
      setLives(livesData);
    } catch (err) {
      console.error("Failed to load landing data:", err);
      setError('加载失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayEvents = useMemo(() => {
    const combined = [...events];
    
    const upcoming = combined
      .filter(e => e.startAt.split('T')[0] >= MOCK_TODAY)
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
    
    // If a specific region is selected, prioritize it
    if (region) {
        const regional = upcoming.filter(e => e.marketRegion === region);
        const others = upcoming.filter(e => e.marketRegion !== region);
        return [...regional, ...others];
    }

    return upcoming;
  }, [events, region]);

  const featuredEvents = useMemo(() => displayEvents.slice(0, 4), [displayEvents]);

  const scoopEvents = useMemo(() => {
    const featuredIds = new Set(featuredEvents.map(e => e.id));
    return displayEvents.filter(e => !featuredIds.has(e.id)).slice(0, 6);
  }, [displayEvents, featuredEvents]);

  const upcomingLives = useMemo(() => {
    let filtered = lives.filter(l => l.startAt.split('T')[0] >= MOCK_TODAY);
    
    if (region) {
        const regional = filtered.filter(l => l.marketRegion === region);
        const others = filtered.filter(l => l.marketRegion !== region);
        filtered = [...regional, ...others];
    }
    
    return filtered
      .sort((a, b) => a.startAt.localeCompare(b.startAt))
      .slice(0, 3);
  }, [lives, region]);

  const regionLabels: Record<string, string> = {
    'JAPAN': '日本国内版',
    'CN_MAINLAND': '中国大陆版',
    'OVERSEAS': '海外分社版',
    'GLOBAL': '全球特报版'
  };

  return (
    <motion.div 
      className="w-full pb-20 overflow-x-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Utility Dateline - Integrated Region Switcher */}
      <div className="w-full border-b py-2 flex justify-between px-4 text-[10px] font-mono uppercase tracking-widest relative z-[60] border-slate-900 bg-slate-100 text-slate-600">
           <span className="hidden sm:inline">Vol. 13,042</span>
           
           <div className="relative">
             <button 
                onClick={() => setIsEditionMenuOpen(!isEditionMenuOpen)}
                className="flex items-center gap-1.5 font-black transition-all group px-2 py-0.5 -my-0.5 text-red-700 hover:bg-slate-200"
             >
                <Radio size={10} className={isEditionMenuOpen ? 'animate-none' : 'animate-pulse'} />
                <span className="border-b border-dotted border-current">
                    {regionLabels[region] || 'SPECIAL'} EDITION
                </span>
                <ChevronDown size={10} className={`transition-transform duration-300 ${isEditionMenuOpen ? 'rotate-180' : ''}`} />
             </button>

             <AnimatePresence>
                {isEditionMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-transparent"
                            onClick={() => setIsEditionMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 shadow-2xl border-2 z-[70] bg-[#FDFBF7] border-black"
                        >
                            {WORLD_REGIONS.map((reg) => (
                                <button
                                    key={reg.id}
                                    onClick={() => {
                                        onSetRegion(reg.id);
                                        setIsEditionMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors border-b last:border-b-0 ${
                                        region === reg.id 
                                            ? 'bg-red-600 text-white border-black'
                                            : 'bg-white text-slate-900 hover:bg-slate-50 border-slate-200'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase tracking-wider">{reg.label}</span>
                                        <span className="text-[8px] opacity-60 font-serif italic">{reg.desc}</span>
                                    </div>
                                    {region === reg.id && <Check size={12} />}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
             </AnimatePresence>
           </div>

           <span className="hidden sm:inline">GENSOKYO STANDARD TIME</span>
           <span>Wind: 45m/s</span>
      </div>

       <div className="max-w-[1200px] mx-auto">
        {isLoading ? (
          <div className="px-4 pt-8">
            <div className="h-[520px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white/60 animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-16 border-t-2 border-black">
              <div className="lg:col-span-8 flex flex-col">
                <div className="flex items-center gap-3 mb-8 border-b-2 border-black pb-2">
                  <div className="w-7 h-7 bg-slate-200 border border-slate-300 animate-pulse" />
                  <div className="h-9 w-44 bg-slate-200 border border-slate-300 animate-pulse" />
                </div>
                <EventCardSkeleton count={4} />
              </div>

              <div className="lg:col-span-4 pl-0 lg:pl-10 flex flex-col lg:border-l border-slate-300 border-dashed">
                <div className="mb-8 bg-black text-white p-3 transform -rotate-1">
                  <div className="h-6 w-28 bg-white/20 rounded animate-pulse" />
                </div>
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="aspect-[16/9] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-slate-200/70 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="px-4 py-16">
            <div className="border-2 border-black bg-white newspaper-shadow p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 shrink-0 bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-700">
                  <AlertTriangle size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    TRANSMISSION ERROR
                  </div>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-black font-header text-slate-900">
                    频道暂时失联
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 font-serif italic">
                    {error}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={loadData}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-colors"
                    >
                      <RefreshCcw size={18} /> 重新拉取
                    </button>

                    <Link
                      to="/events"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
                    >
                      打开展会名录 <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="pt-8">
              <HeroCarousel 
                events={featuredEvents} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 pt-10 border-t-2 border-black">
              <ScoopSection 
                events={scoopEvents} 
                todayStr={MOCK_TODAY}
              />

              <LiveSidebar 
                lives={upcomingLives} 
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LandingView;
