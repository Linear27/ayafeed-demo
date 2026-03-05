import { TimelineItem } from '../types';

export type RegionDistributionRow = {
  key: string;
  label: string;
  count: number;
};

const REGION_LABELS: Record<string, string> = {
  JAPAN: '日本 (JAPAN)',
  CN_MAINLAND: '大陆 (CN_MAINLAND)',
  OVERSEAS: '海外 (OVERSEAS)',
  UNKNOWN: '未知 (UNKNOWN)',
};

const REGION_ORDER = ['JAPAN', 'CN_MAINLAND', 'OVERSEAS', 'UNKNOWN'];

const toRegionLabel = (key: string): string => REGION_LABELS[key] ?? `其他 (${key})`;

const toRegionOrder = (key: string): number => {
  const orderIndex = REGION_ORDER.indexOf(key);
  return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
};

export const buildRegionDistribution = (
  items: Array<Pick<TimelineItem, 'marketRegion'>>,
): RegionDistributionRow[] => {
  const countMap = new Map<string, number>();

  items.forEach((item) => {
    const key = item.marketRegion ?? 'UNKNOWN';
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  });

  return Array.from(countMap.entries())
    .sort((a, b) => {
      const orderDiff = toRegionOrder(a[0]) - toRegionOrder(b[0]);
      return orderDiff !== 0 ? orderDiff : a[0].localeCompare(b[0]);
    })
    .map(([key, count]) => ({
      key,
      label: toRegionLabel(key),
      count,
    }));
};
