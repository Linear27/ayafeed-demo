
import { PublicEventDetailResponse, PublicLiveListItem, PublicCircleListItem } from '../types';

export interface AdaptedEventNewsItem {
  date: string | null;
  title: string;
  type: string | null;
  content: string | null;
  url: string | null;
}

export interface AdaptedEventSubeventItem {
  id: string;
  eventSeriesKey: string;
  title: string | null;
  orderIndex: number;
}

export interface AdaptedEventDocumentItem {
  entityType: string;
  label: string;
  order: number;
  url: string | null;
  type: 'PDF' | 'Link' | null;
  category: 'Attendee' | 'Circle' | string | null;
}

export interface AdaptedEventDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  summary: string;
  startAt: string;
  endAt: string;
  date: string;
  location: string;
  address: string;
  lat: number | null;
  lng: number | null;
  transportation: string;
  poster: string | null;
  posterOrientation: 'portrait' | 'landscape' | null;
  organizer: string;
  boothCount: number;
  website: string;
  news: AdaptedEventNewsItem[];
  notices: string[];
  genres: string[];
  floorMapImages: string[];
  subevents: AdaptedEventSubeventItem[];
  docs: AdaptedEventDocumentItem[];
}

export interface AdaptedLiveListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  startAt: string;
  venue: string;
  image: string;
  marketRegion: string;
}

export interface AdaptedCircleListItem {
  id: string;
  slug: string;
  name: string;
  penName: string;
  image: string;
  banner: string;
  tags: string[];
  mainType: string;
  isCertified: boolean;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const asStringOrNull = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

const asNumberOrNull = (value: unknown): number | null => {
  const num = typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(num) ? num : null;
};

export const adaptEventDetail = (data: PublicEventDetailResponse): AdaptedEventDetail => {
  const { event, translations, meta, location, poster } = data;
  const translation = translations.find(t => t.locale === 'zh') || translations[0] || {
    title: event.id,
    summary: '',
    content: '',
    transportation: ''
  };
  const rawNews = Array.isArray(meta?.news) ? meta.news : [];
  const news: AdaptedEventNewsItem[] = rawNews
    .map((item) => {
      const safe = isRecord(item) ? item : {};
      return {
        date: asStringOrNull(safe.date),
        title: asStringOrNull(safe.title) || '',
        type: asStringOrNull(safe.type),
        content: asStringOrNull(safe.content),
        url: asStringOrNull(safe.url),
      };
    })
    .filter((item) => item.title.length > 0);

  return {
    id: event.id,
    slug: event.slug,
    title: translation.title || event.id,
    description: translation.content || translation.summary || '',
    summary: translation.summary || '',
    startAt: event.startAt.split('T')[0],
    endAt: event.endAt.split('T')[0],
    date: event.startAt.split('T')[0],
    location: location?.name || '未知地点',
    address: location?.address || '',
    lat: asNumberOrNull(location?.lat),
    lng: asNumberOrNull(location?.lng),
    transportation: translation.transportation || '',
    poster: poster?.urls.original || null,
    posterOrientation: event.posterOrientation,
    organizer: meta?.organizer || '未知主办',
    boothCount: meta?.boothCount || 0,
    website: meta?.website || '',
    news,
    notices: meta?.notices || [],
    genres: meta?.genre || [],
    floorMapImages: data.floorMapImages?.map(img => img.urls.original) || [],
    subevents: data.subevents.map((item) => ({
      id: item.id,
      eventSeriesKey: item.eventSeriesKey,
      title: item.title,
      orderIndex: item.orderIndex,
    })),
    docs: data.availableDocuments.map((doc) => ({
      entityType: doc.entityType,
      label: doc.label,
      order: doc.order,
      url: doc.url || null,
      type: doc.type || null,
      category: doc.category || null,
    })),
  };
};

export const adaptLiveListItem = (item: PublicLiveListItem): AdaptedLiveListItem => {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description || '',
    date: item.startAt.split('T')[0],
    startAt: item.startAt,
    venue: item.venue || item.location?.name || '未知场馆',
    image: item.poster?.urls.md || item.poster?.urls.original || '',
    marketRegion: item.marketRegion || 'JAPAN'
  };
};

export const adaptCircleListItem = (item: PublicCircleListItem): AdaptedCircleListItem => {
  return {
    id: item.id,
    slug: item.slug,
    name: item.title,
    penName: item.penName || '',
    image: item.avatar?.urls.sm || item.avatar?.urls.original || '',
    banner: item.avatar?.urls.original || '',
    tags: item.tags || [],
    mainType: item.classification?.mainType || 'Other',
    isCertified: item.isCertified
  };
};
