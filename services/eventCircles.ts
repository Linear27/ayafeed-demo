import type { PublicCircleListItem } from '../types';

export type CircleFocus = 'NEW' | 'SET' | 'GOODS' | 'REGULAR';

export type CircleFilterMetadata = {
  id: string;
  focus: CircleFocus;
  spaceBucket: string | null;
  featuredProduct: string | null;
};

type CircleCompatEventProduct = {
  title?: string;
  type?: string;
};

type CircleCompatEvent = {
  eventId?: string;
  spaceCode?: string;
  products?: CircleCompatEventProduct[];
};

type CircleCompat = PublicCircleListItem & {
  name?: string;
  spaceCode?: string;
  summary?: string;
  description?: string;
  genres?: string[];
  events?: CircleCompatEvent[];
};

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getEventRecord = (circle: PublicCircleListItem, eventId: string): CircleCompatEvent | null => {
  const compat = circle as CircleCompat;
  if (!Array.isArray(compat.events)) return null;
  return compat.events.find((entry) => entry?.eventId === eventId) ?? null;
};

const pickCircleFocus = (products: CircleCompatEventProduct[]): CircleFocus => {
  const normalized = products.flatMap((product) => [
    normalizeText(product?.type).toLowerCase(),
    normalizeText(product?.title).toLowerCase(),
  ]);

  const includesAny = (keywords: string[]) => normalized.some((text) => keywords.some((keyword) => text.includes(keyword)));

  if (includesAny(['new', '新刊', '新作'])) return 'NEW';
  if (includesAny(['set', '套装', 'bundle'])) return 'SET';
  if (includesAny(['goods', '周边', 'グッズ'])) return 'GOODS';
  return 'REGULAR';
};

export const getEventSpaceBucket = (spaceCode: string | null | undefined): string | null => {
  const raw = normalizeText(spaceCode);
  if (!raw) return null;
  const token = raw.split('-')[0]?.trim() ?? '';
  return token.length > 0 ? token : null;
};

export const buildEventCircleFilterContext = (
  circles: PublicCircleListItem[],
  eventId: string,
): {
  metadataById: Map<string, CircleFilterMetadata>;
  availableLocations: string[];
} => {
  const metadataById = new Map<string, CircleFilterMetadata>();
  const locationSet = new Set<string>();

  circles.forEach((circle) => {
    const compat = circle as CircleCompat;
    const eventRecord = getEventRecord(circle, eventId);
    const spaceCode = normalizeText(eventRecord?.spaceCode || compat.spaceCode);
    const spaceBucket = getEventSpaceBucket(spaceCode);
    if (spaceBucket) locationSet.add(spaceBucket);

    const products = Array.isArray(eventRecord?.products) ? eventRecord.products : [];
    const focus = pickCircleFocus(products);

    metadataById.set(circle.id, {
      id: circle.id,
      focus,
      spaceBucket,
      featuredProduct: normalizeText(products[0]?.title) || null,
    });
  });

  return {
    metadataById,
    availableLocations: Array.from(locationSet).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN')),
  };
};

export const filterEventCircles = (
  circles: PublicCircleListItem[],
  options: {
    eventId: string;
    query: string;
    selectedFocus: string[];
    selectedLocations: string[];
    metadataById: Map<string, CircleFilterMetadata>;
  },
): PublicCircleListItem[] => {
  const query = options.query.trim().toLowerCase();

  return circles.filter((circle) => {
    const compat = circle as CircleCompat;
    const meta = options.metadataById.get(circle.id);
    const eventRecord = getEventRecord(circle, options.eventId);
    const spaceCode = normalizeText(eventRecord?.spaceCode || compat.spaceCode);
    const spaceBucket = meta?.spaceBucket || getEventSpaceBucket(spaceCode);
    const focus = meta?.focus ?? 'REGULAR';
    const displayName = normalizeText(circle.title || compat.name);
    const penName = normalizeText(circle.penName);
    const summary = normalizeText(compat.summary || compat.description);
    const genreText = (circle.tags?.length ? circle.tags : compat.genres || []).join(' ');

    if (query) {
      const queryHaystack = [displayName, penName, summary, spaceCode, genreText].join(' ').toLowerCase();
      if (!queryHaystack.includes(query)) return false;
    }

    if (options.selectedFocus.length > 0 && !options.selectedFocus.includes(focus)) return false;
    if (options.selectedLocations.length > 0 && (!spaceBucket || !options.selectedLocations.includes(spaceBucket))) return false;
    return true;
  });
};
