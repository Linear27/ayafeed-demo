
import { PublicEventDetailResponse, PublicLiveListItem, PublicCircleListItem } from '../types';

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
  transportation: string;
  poster: string | null;
  posterOrientation: 'portrait' | 'landscape' | null;
  organizer: string;
  boothCount: number;
  website: string;
  news: any[];
  notices: string[];
  genres: string[];
  floorMapImages: string[];
  subevents: any[];
  docs: any[];
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
  tags: string[];
  mainType: string;
  isCertified: boolean;
}

export const adaptEventDetail = (data: PublicEventDetailResponse): AdaptedEventDetail => {
  const { event, translations, meta, location, poster } = data;
  const translation = translations.find(t => t.locale === 'zh') || translations[0] || {
    title: event.id,
    summary: '',
    content: '',
    transportation: ''
  };

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
    transportation: translation.transportation || '',
    poster: poster?.urls.original || null,
    posterOrientation: event.posterOrientation,
    organizer: meta?.organizer || '未知主办',
    boothCount: meta?.boothCount || 0,
    website: '', 
    news: meta?.news || [],
    notices: meta?.notices || [],
    genres: meta?.genre || [],
    floorMapImages: data.floorMapImages?.map(img => img.urls.original) || [],
    subevents: data.subevents || [],
    docs: data.availableDocuments || []
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
    tags: item.tags || [],
    mainType: item.classification?.mainType || 'Other',
    isCertified: item.isCertified
  };
};
