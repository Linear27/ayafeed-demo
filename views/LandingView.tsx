
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PreferredRegion, PublicEventListItem, PublicLiveListItem, TimelineItem } from '../types';
import { fetchEvents, fetchLives } from '../services/api';
import { BentoHeader, ScrapbookTimeline, IndexSidebar, MobileQuickJumpBar } from '../components/LandingSections';
import { EventCardSkeleton } from '../components/Skeleton';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, RefreshCcw, ArrowRight } from 'lucide-react';
import {
  DEFAULT_BUSINESS_TIME_ZONE,
  diffCalendarDays,
  extractDateKey,
  getBusinessDateKey,
  getRecentWindowCount,
} from '../services/date';
import { rankHeroItems } from '../services/landingHero';

const LandingView: React.FC<{ 
  region: PreferredRegion;
}> = ({ region }) => {
  const todayDateKey = useMemo(() => getBusinessDateKey(DEFAULT_BUSINESS_TIME_ZONE), []);
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

    events.forEach(e => {
      const dateStr = extractDateKey(e.startAt);
      if (!dateStr) return;

      const dayDelta = diffCalendarDays(todayDateKey, dateStr);
      if (dayDelta >= 0) {
        let status: TimelineItem['status'] = 'UPCOMING';
        if (dayDelta === 0) status = 'ONGOING';
        
        items.push({
          id: e.id,
          type: 'event',
          date: dateStr,
          title: e.title,
          location: e.location?.name || null,
          image: e.poster?.urls.original || null,
          slug: e.slug,
          isToday: dayDelta === 0,
          isThisWeek: dayDelta < 7,
          marketRegion: e.marketRegion,
          summary: e.summary,
          boothCount: e.boothCount,
          organizer: e.organizer,
          website: (e as any).website || (e as any).websiteUrl || null,
          featured: e.featured === true,
          featuredOrder: typeof e.featuredOrder === 'number' ? e.featuredOrder : null,
          status,
          originalData: e
        });
      }
    });

    lives.forEach(l => {
      const dateStr = extractDateKey(l.startAt);
      if (!dateStr) return;

      const dayDelta = diffCalendarDays(todayDateKey, dateStr);
      if (dayDelta >= 0) {
        let status: TimelineItem['status'] = 'UPCOMING';
        if (dayDelta === 0) status = 'ONGOING';

        items.push({
          id: l.id,
          type: 'live',
          date: dateStr,
          title: l.title,
          location: l.location?.name || l.venue || null,
          image: l.poster?.urls.original || null,
          slug: l.slug,
          isToday: dayDelta === 0,
          isThisWeek: dayDelta < 7,
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
    if (region && region !== 'GLOBAL') {
      const regional = items.filter(i => i.marketRegion === region);
      const others = items.filter(i => i.marketRegion !== region);
      return [...regional, ...others];
    }

    return items;
  }, [events, lives, todayDateKey, region]);

  const updateCount = useMemo(() => {
    const upcomingDateKeys = [
      ...events.map((event) => extractDateKey(event.startAt)),
      ...lives.map((live) => extractDateKey(live.startAt)),
    ];
    return getRecentWindowCount(upcomingDateKeys, todayDateKey, 7);
  }, [events, lives, todayDateKey]);

  // 统计数据 (Social Proof)
  const stats = useMemo(() => ({
    totalEvents: events.length + lives.length,
    todayCount: timelineItems.filter(i => i.isToday).length,
    thisWeekCount: timelineItems.filter(i => i.isThisWeek).length,
    updateCount
  }), [events, lives, timelineItems, updateCount]);

  const featuredItems = useMemo(() => {
    return rankHeroItems(timelineItems).slice(0, 5);
  }, [timelineItems]);

  return (
    <motion.div 
      className="w-full pb-20"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
       <div className="max-w-300 mx-auto">
        <h1 className="sr-only">AyaFeed 落地页 - 幻想乡活动情报总览</h1>
        {isLoading ? (
          <div className="px-4 pt-8" aria-live="polite">
            <div className="h-130 border-4 border-[var(--paper-border)] shadow-[8px_8px_0px_0px_var(--paper-border)] bg-[var(--paper-surface)]/60 animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-16 border-t-2 border-[var(--paper-border)]">
              <div className="lg:col-span-8 flex flex-col">
                <div className="flex items-center gap-3 mb-8 border-b-2 border-[var(--paper-border)] pb-2">
                  <div className="w-7 h-7 bg-[var(--paper-border)]/10 border border-[var(--paper-border)]/5 animate-pulse" />
                  <div className="h-9 w-44 bg-[var(--paper-border)]/10 border border-[var(--paper-border)]/5 animate-pulse" />
                </div>
                <EventCardSkeleton count={4} />
              </div>

              <div className="lg:col-span-4 pl-0 lg:pl-10 flex flex-col lg:border-l border-[var(--paper-border)]/20 border-dashed">
                <div className="mb-8 bg-[var(--paper-border)] text-[var(--paper-surface)] p-3 transform -rotate-1">
                  <div className="h-6 w-28 bg-[var(--paper-surface)]/20 rounded animate-pulse" />
                </div>
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="aspect-video border-2 border-[var(--paper-border)] shadow-[4px_4px_0px_0px_var(--paper-border)] bg-[var(--paper-border)]/5 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="px-4 py-16" role="alert" aria-live="polite">
            <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] newspaper-shadow p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 shrink-0 bg-[var(--paper-accent)]/10 border-2 border-[var(--paper-accent)]/20 flex items-center justify-center text-[var(--paper-accent)]">
                  <AlertTriangle size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-[var(--paper-text-muted)]">
                    TRANSMISSION ERROR
                  </div>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-black font-header text-[var(--paper-text)]">
                    频道暂时失联
                  </h2>
                  <p className="mt-2 text-sm text-[var(--paper-text-muted)] font-serif italic">
                    {error}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={loadData}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-[var(--paper-border)] text-[var(--paper-surface)] border-2 border-[var(--paper-border)] shadow-[4px_4px_0px_0px_var(--paper-border)] hover:bg-[var(--paper-accent)] transition-colors"
                    >
                      <RefreshCcw size={18} /> 重新拉取
                    </button>

                    <Link
                      to="/events"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] shadow-[4px_4px_0px_0px_var(--paper-border)] hover:bg-[var(--paper-border)] hover:text-[var(--paper-surface)] transition-colors"
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
                todayDateKey={todayDateKey}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 pt-14 border-t-2 border-[var(--paper-border)]">
              <div className="lg:col-span-8">
                <MobileQuickJumpBar items={timelineItems} />
                <ScrapbookTimeline items={timelineItems} />
              </div>

              <IndexSidebar 
                items={timelineItems} 
                todayDateKey={todayDateKey}
                stats={stats}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LandingView;
