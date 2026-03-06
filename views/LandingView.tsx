import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, RefreshCcw } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  LandingCommandBar,
  LandingFocusGrid,
  LandingHero,
  LandingMonthlyHighlights,
  LandingRoleEntry,
  LandingTimelinePreview,
  LandingUpdates,
} from '../components/landing';
import { fetchEvents, fetchLives } from '../services/api';
import {
  DEFAULT_BUSINESS_TIME_ZONE,
  diffCalendarDays,
  extractDateKey,
  getBusinessDateKey,
  getRecentWindowCount,
} from '../services/date';
import { buildLandingHomepageModel } from '../services/landingHomepage';
import { PreferredRegion, PublicEventListItem, PublicLiveListItem, TimelineItem } from '../types';

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
      const [eventsData, livesData] = await Promise.all([fetchEvents(), fetchLives()]);
      setEvents(eventsData);
      setLives(livesData);
    } catch (err) {
      console.error('Failed to load landing data:', err);
      setError('首页数据暂时无法同步，请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    events.forEach((event) => {
      const dateStr = extractDateKey(event.startAt);
      if (!dateStr) return;

      const dayDelta = diffCalendarDays(todayDateKey, dateStr);
      if (dayDelta < 0) return;

      items.push({
        id: event.id,
        type: 'event',
        date: dateStr,
        title: event.title,
        location: event.location?.name ?? null,
        image: event.poster?.urls.original ?? null,
        slug: event.slug,
        isToday: dayDelta === 0,
        isThisWeek: dayDelta < 7,
        marketRegion: event.marketRegion,
        summary: event.summary,
        boothCount: event.boothCount,
        organizer: event.organizer,
        website: (event as any).website ?? (event as any).websiteUrl ?? null,
        featured: event.featured === true,
        featuredOrder: typeof event.featuredOrder === 'number' ? event.featuredOrder : null,
        status: dayDelta === 0 ? 'ONGOING' : 'UPCOMING',
        originalData: event,
      });
    });

    lives.forEach((live) => {
      const dateStr = extractDateKey(live.startAt);
      if (!dateStr) return;

      const dayDelta = diffCalendarDays(todayDateKey, dateStr);
      if (dayDelta < 0) return;

      items.push({
        id: live.id,
        type: 'live',
        date: dateStr,
        title: live.title,
        location: live.location?.name ?? live.venue ?? null,
        image: live.poster?.urls.original ?? null,
        slug: live.slug,
        isToday: dayDelta === 0,
        isThisWeek: dayDelta < 7,
        marketRegion: live.marketRegion,
        summary: live.description,
        website: (live as any).website ?? null,
        status: dayDelta === 0 ? 'ONGOING' : 'UPCOMING',
        originalData: live,
      });
    });

    items.sort((left, right) => left.date.localeCompare(right.date));

    if (region !== 'GLOBAL') {
      const preferredItems = items.filter((item) => item.marketRegion === region);
      const remainingItems = items.filter((item) => item.marketRegion !== region);
      return [...preferredItems, ...remainingItems];
    }

    return items;
  }, [events, lives, region, todayDateKey]);

  const updateCount = useMemo(() => {
    const upcomingDateKeys = [
      ...events.map((event) => extractDateKey(event.startAt)),
      ...lives.map((live) => extractDateKey(live.startAt)),
    ];
    return getRecentWindowCount(upcomingDateKeys, todayDateKey, 7);
  }, [events, lives, todayDateKey]);

  const stats = useMemo(
    () => ({
      totalEvents: events.length + lives.length,
      todayCount: timelineItems.filter((item) => item.isToday).length,
      thisWeekCount: timelineItems.filter((item) => item.isThisWeek).length,
      updateCount,
    }),
    [events.length, lives.length, timelineItems, updateCount],
  );

  const homepageModel = useMemo(
    () => buildLandingHomepageModel(timelineItems, todayDateKey),
    [timelineItems, todayDateKey],
  );

  return (
    <motion.div className="w-full overflow-x-hidden pb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
        <h1 className="sr-only">AyaFeed 落地页 - 幻想乡活动情报总览</h1>

        {isLoading ? (
          <div className="space-y-6" aria-busy="true" aria-live="polite">
            <div className="h-80 animate-pulse border-2 border-[var(--paper-border)]/15 bg-[var(--paper-surface)]"></div>
            <div className="h-20 animate-pulse border-2 border-[var(--paper-border)]/15 bg-[var(--paper-surface)]"></div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 animate-pulse border-2 border-[var(--paper-border)]/15 bg-[var(--paper-surface)]"></div>
              <div className="h-64 animate-pulse border-2 border-[var(--paper-border)]/15 bg-[var(--paper-surface)]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-6 paper-shadow-md" role="alert" aria-live="polite">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[var(--paper-accent)]/20 bg-[var(--paper-accent)]/10 text-[var(--paper-accent)]">
                <AlertTriangle size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[var(--paper-text-muted)]">Transmission Error</div>
                <h2 className="mt-2 text-2xl font-black text-[var(--paper-text)] sm:text-3xl">首页频道暂时失联</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--paper-muted)]">{error}</p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={loadData}
                    className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-4 py-2 text-sm font-black text-[var(--paper-surface)] transition-colors hover:bg-[var(--paper-accent)]"
                  >
                    <RefreshCcw size={18} />
                    重新拉取
                  </button>
                  <Link
                    to="/events"
                    className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-4 py-2 text-sm font-bold text-[var(--paper-text)] transition-colors hover:bg-[var(--paper-hover)]"
                  >
                    打开展会名录
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <LandingHero hero={homepageModel.hero} updates={homepageModel.updates} region={region} />
            <LandingCommandBar region={region} />
            <LandingFocusGrid focusItems={homepageModel.focusItems} stats={stats} quickRail={homepageModel.quickRail} />
            <LandingMonthlyHighlights items={homepageModel.monthlyHighlights} />
            <LandingUpdates items={homepageModel.updates} />
            <LandingTimelinePreview items={homepageModel.timelinePreview} />
            <LandingRoleEntry />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LandingView;
