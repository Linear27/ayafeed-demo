
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, Calendar, Clock, 
  Globe, Radio, Library, ExternalLink,
  ChevronRight, Search, Filter, Building2,
  Users, Info, Tag, CheckCircle2, Zap, Sparkles
} from 'lucide-react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Theme, TimelineItem } from '../types';
import { fetchEvents, fetchLives } from '../services/api';
import { BentoHeader, ScrapbookTimeline, Tape } from '../components/LandingSections';

const MOCK_TODAY = "2026-03-01";

const ExperimentalLandingView: React.FC<{ theme: Theme }> = ({ theme }) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [lives, setLives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState<string>('');

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

  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];
    const now = new Date(MOCK_TODAY);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    events.forEach(e => {
      const dateStr = e.startAt.split('T')[0];
      const date = new Date(dateStr);
      if (dateStr >= MOCK_TODAY) {
        let status: TimelineItem['status'] = 'UPCOMING';
        if (dateStr === MOCK_TODAY) status = 'ONGOING';
        
        items.push({
          id: e.id,
          type: 'event',
          date: dateStr,
          title: e.title,
          location: e.location?.name || null,
          image: e.poster?.urls.original || null,
          slug: e.slug,
          isToday: dateStr === MOCK_TODAY,
          isThisWeek: date <= endOfWeek,
          marketRegion: e.marketRegion,
          summary: e.summary,
          boothCount: e.boothCount,
          organizer: e.organizer,
          website: (e as any).website || (e as any).websiteUrl || null,
          status,
          originalData: e
        });
      }
    });

    lives.forEach(l => {
      const dateStr = l.startAt.split('T')[0];
      const date = new Date(dateStr);
      if (dateStr >= MOCK_TODAY) {
        let status: TimelineItem['status'] = 'UPCOMING';
        if (dateStr === MOCK_TODAY) status = 'ONGOING';

        items.push({
          id: l.id,
          type: 'live',
          date: dateStr,
          title: l.title,
          location: l.location?.name || l.venue || null,
          image: l.poster?.urls.original || null,
          slug: l.slug,
          isToday: dateStr === MOCK_TODAY,
          isThisWeek: date <= endOfWeek,
          marketRegion: l.marketRegion,
          summary: l.description,
          website: (l as any).website || null,
          status,
          originalData: l
        });
      }
    });

    items.sort((a, b) => a.date.localeCompare(b.date));

    if (region) {
      const regional = items.filter(i => i.marketRegion === region);
      const others = items.filter(i => i.marketRegion !== region);
      return [...regional, ...others];
    }

    return items;
  }, [events, lives, region]);

  const stats = useMemo(() => ({
    totalEvents: events.length + lives.length,
    todayCount: timelineItems.filter(i => i.isToday).length,
    thisWeekCount: timelineItems.filter(i => i.isThisWeek).length,
    updateCount: 5
  }), [events, lives, timelineItems]);

  const featuredItems = useMemo(() => {
    const todayItems = timelineItems.filter(i => i.isToday);
    if (todayItems.length > 0) return todayItems;
    return timelineItems.slice(0, 5);
  }, [timelineItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-serif italic">
        <div className="flex flex-col items-center gap-4">
          <Radio className="animate-pulse text-red-600" size={48} />
          <p className="text-xl font-black uppercase tracking-widest">Loading Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#141414] font-serif selection:bg-red-600 selection:text-white">
      <div className="bg-black text-white py-2 px-4 flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
              <Zap size={12} className="text-yellow-400" />
              EXPERIMENTAL LAYOUT 3.2 / DISCOVERY-FIRST MODE / TIME-SLICING ENABLED
            </div>
          ))}
        </div>
        <Link to="/showcase" className="text-[10px] font-black uppercase tracking-widest border border-white/30 px-2 py-0.5 hover:bg-white hover:text-black transition-colors shrink-0 z-10 bg-black">
          EXIT LAB
        </Link>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-red-600" size={24} />
            <h2 className="text-2xl font-black font-header uppercase tracking-widest">Discovery Hub / 发现中心</h2>
          </div>
          <BentoHeader 
            items={featuredItems} 
            region={region}
            stats={stats}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <ScrapbookTimeline items={timelineItems} />
          </div>

          <aside className="lg:col-span-4 space-y-12">
            <div className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black font-header uppercase mb-6 border-b-2 border-black pb-2">Region Filter</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: '', label: 'Global / 全球' },
                  { id: 'JAPAN', label: 'Japan / 日本国内' },
                  { id: 'CN_MAINLAND', label: 'China / 中国大陆' },
                  { id: 'OVERSEAS', label: 'Overseas / 海外地区' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`w-full text-left px-4 py-3 font-black text-xs uppercase tracking-widest transition-all flex justify-between items-center ${
                      region === r.id ? 'bg-black text-white' : 'hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                    {region === r.id && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-4 border-black p-8 bg-red-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                <Building2 size={200} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black font-header uppercase mb-4 leading-tight">Are you an Organizer?</h3>
                <p className="text-sm font-serif italic mb-8 opacity-90 leading-relaxed">
                  加入幻想乡最大的情报网络。提交您的活动信息，让成千上万的参与者发现您的精彩。
                </p>
                <button className="w-full py-4 bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                  Submit Event <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="border-4 border-black p-8 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black font-header uppercase mb-4">Daily Digest</h3>
              <p className="text-xs font-bold mb-6 opacity-80 uppercase tracking-widest">订阅文文新闻每日快讯</p>
              <div className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full p-3 border-2 border-black font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button className="w-full py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ExperimentalLandingView;
