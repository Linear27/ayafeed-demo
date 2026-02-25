
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicEventListItem, PublicLiveListItem } from '../types';
import { fetchEvents, fetchLives } from '../services/api';
import { HeroCarousel, ScoopSection, LiveSidebar } from '../components/LandingSections';
import { ChevronDown, Radio, Check } from 'lucide-react';

const WORLD_REGIONS = [
  { id: 'JAPAN', label: '日本国内', desc: '文文新闻本部' },
  { id: 'CN_MAINLAND', label: '中国大陆', desc: '特别特报频道' },
  { id: 'OVERSEAS', label: '海外分社', desc: '联合情报中心' },
];

const LandingView: React.FC<{ 
  region: string;
  onSetRegion: (reg: string) => void;
}> = ({ region, onSetRegion }) => {
  const MOCK_TODAY = '2025-01-01';
  const [isEditionMenuOpen, setIsEditionMenuOpen] = useState(false);
  const [events, setEvents] = useState<PublicEventListItem[]>([]);
  const [lives, setLives] = useState<PublicLiveListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, livesData] = await Promise.all([
          fetchEvents(), 
          fetchLives()
        ]);
        setEvents(eventsData);
        setLives(livesData);
      } catch (error) {
        console.error("Failed to load landing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const displayEvents = useMemo(() => {
    const combined = [...events];
    
    const upcoming = combined
      .filter(e => e.startAt.split('T')[0] >= MOCK_TODAY)
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
    
    // If a specific region is selected, prioritize it
    if (region) {
        const regional = upcoming.filter(e => e.marketRegion === region);
        const others = upcoming.filter(e => e.marketRegion !== region);
        return [...regional, ...others].slice(0, 6);
    }

    return upcoming.slice(0, 6);
  }, [events, region]);

  const featuredEvents = useMemo(() => displayEvents.slice(0, 5), [displayEvents]);

  const upcomingLives = useMemo(() => {
    let filtered = lives.filter(l => l.startAt.split('T')[0] >= MOCK_TODAY);
    
    if (region) {
        const regional = filtered.filter(l => l.location?.marketRegion === region);
        const others = filtered.filter(l => l.location?.marketRegion !== region);
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
           <span className="hidden xs:inline">Vol. 13,042</span>
           
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
        <div className="pt-8">
            <HeroCarousel 
                events={featuredEvents} 
                userRegion={region}
                onSelect={() => {}} // Not used anymore
                onNavigate={() => {}} // Not used anymore
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 pt-16 border-t-2 border-black">
          <ScoopSection 
            events={displayEvents} 
            todayStr={MOCK_TODAY}
          />

          <LiveSidebar 
            lives={upcomingLives} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LandingView;
