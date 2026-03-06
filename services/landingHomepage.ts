import type { TimelineItem } from '../types';
import { diffCalendarDays } from './date';
import { rankHeroItems } from './landingHero';

export type LandingHomepageModel = {
  hero: { main: TimelineItem | null; secondary: TimelineItem[] };
  focusItems: TimelineItem[];
  monthlyHighlights: TimelineItem[];
  updates: TimelineItem[];
  timelinePreview: TimelineItem[];
  quickRail: {
    nextMajor: TimelineItem | null;
    daysLeft: number | null;
  };
};

export const buildLandingHomepageModel = (
  items: TimelineItem[],
  todayDateKey: string,
): LandingHomepageModel => {
  const ranked = rankHeroItems(items);
  const heroMain = ranked[0] ?? null;
  const heroSecondary = ranked.slice(1, 3);
  const focusItems = ranked.filter((item) => item.isToday || item.isThisWeek).slice(0, 2);
  const monthlyHighlights = ranked.filter((item) => item.id !== heroMain?.id).slice(0, 4);
  const updates = ranked.slice(0, 4);
  const timelinePreview = items.slice(0, 6);
  const nextMajor = ranked.find((item) => item.id !== heroMain?.id && !item.isToday) ?? null;

  return {
    hero: { main: heroMain, secondary: heroSecondary },
    focusItems,
    monthlyHighlights,
    updates,
    timelinePreview,
    quickRail: {
      nextMajor,
      daysLeft: nextMajor ? Math.max(0, diffCalendarDays(todayDateKey, nextMajor.date)) : null,
    },
  };
};
