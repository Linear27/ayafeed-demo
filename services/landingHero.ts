import { TimelineItem } from '../types';

const isFeaturedEvent = (item: TimelineItem) => item.type === 'event' && item.featured === true;
const hasFeaturedOrder = (item: TimelineItem) =>
  typeof item.featuredOrder === 'number' && Number.isFinite(item.featuredOrder);

/**
 * Hero priority:
 * 1) Featured events
 * 2) Today items
 * 3) Upcoming items
 *
 * Keep stable order inside each bucket to preserve existing timeline ordering.
 */
export const rankHeroItems = (items: TimelineItem[]): TimelineItem[] => {
  const featured: Array<{ item: TimelineItem; index: number }> = [];
  const today: TimelineItem[] = [];
  const upcoming: TimelineItem[] = [];

  items.forEach((item, index) => {
    if (isFeaturedEvent(item)) {
      featured.push({ item, index });
      return;
    }
    if (item.isToday) {
      today.push(item);
      return;
    }
    upcoming.push(item);
  });

  featured.sort((a, b) => {
    const aHasOrder = hasFeaturedOrder(a.item);
    const bHasOrder = hasFeaturedOrder(b.item);
    if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
    if (aHasOrder && bHasOrder) {
      const diff = (a.item.featuredOrder as number) - (b.item.featuredOrder as number);
      if (diff !== 0) return diff;
    }
    return a.index - b.index;
  });

  const orderedFeatured = featured.map((entry) => entry.item);

  return [...orderedFeatured, ...today, ...upcoming];
};
