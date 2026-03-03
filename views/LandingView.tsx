
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PublicEventListItem, PublicLiveListItem, MarketRegion, TimelineItem } from '../types';
import { fetchEvents, fetchLives } from '../services/api';
import { BentoHeader, ScrapbookTimeline, IndexSidebar } from '../components/LandingSections';
import { EventCardSkeleton } from '../components/Skeleton';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, RefreshCcw, ArrowRight } from 'lucide-react';

const LandingView: React.FC<{ 
  region: string;
}> = ({ region }) => {
  const MOCK_TODAY = useMemo(() => new Date().toISOString().split('T')[0], []);
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

  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];
    
    const now = new Date(MOCK_TODAY);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + 7);

    events.forEach(e => {
      const dateStr = e.startAt.split('T')[0];
      const date = new Date(dateStr);
      if (dateStr >= MOCK_TODAY) {
        // Simple status logic for demo
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

    // Sort chronologically
    items.sort((a, b) => a.date.localeCompare(b.date));

    // Filter by region if set
    if (region) {
      const regional = items.filter(i => i.marketRegion === region);
      const others = items.filter(i => i.marketRegion !== region);
      return [...regional, ...others];
    }

    return items;
  }, [events, lives, MOCK_TODAY, region]);

  // 统计数据 (Social Proof)
  const stats = useMemo(() => ({
    totalEvents: events.length + lives.length,
    todayCount: timelineItems.filter(i => i.isToday).length,
    thisWeekCount: timelineItems.filter(i => i.isThisWeek).length,
    updateCount: 5 // Mocked recent updates
  }), [events, lives, timelineItems]);

  const featuredItems = useMemo(() => {
    const todayItems = timelineItems.filter(i => i.isToday);
    if (todayItems.length > 0) {
      return todayItems;
    }
    return timelineItems.slice(0, 5);
  }, [timelineItems]);

  return (
    <motion.div 
      className="w-full pb-20 overflow-x-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
       <div className="max-w-300 mx-auto">
        {isLoading ? (
          <div className="px-4 pt-8">
            <div className="h-130 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white/60 animate-pulse" />

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
                    <div key={idx} className="aspect-video border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-slate-200/70 animate-pulse" />
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
            <div className="pt-8 px-4">
              <BentoHeader 
                items={featuredItems} 
                region={region}
                stats={stats}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4 pt-16 border-t-2 border-black">
              <ScrapbookTimeline 
                items={timelineItems} 
              />

              <IndexSidebar 
                items={timelineItems} 
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LandingView;
