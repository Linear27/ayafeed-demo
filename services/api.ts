
import { 
  PublicEventListItem, 
  PublicEventDetailResponse,
  PublicLiveListItem,
  PublicLiveDetailResponse,
  PublicCircleListItem,
  PublicCircleDetailResponse,
  PublicEventsListResponse,
  PublicLivesListResponse,
  PublicCirclesListResponse,
  Circle
} from '../types';
import {
  DEFAULT_BUSINESS_TIME_ZONE,
  diffCalendarDays,
  extractDateKey,
  getBusinessDateKey,
} from './date';

const BASE_URL = '/v1/public';
const EVENTS_FETCH_PAGE_SIZE = 100;
const LIVES_FETCH_PAGE_SIZE = 100;
const CIRCLES_FETCH_PAGE_SIZE = 100;
const LIST_FETCH_MAX_PAGES = 100;
const CIRCLES_FETCH_MAX_PAGES = 100;

const eventsListCache = new Map<string, PublicEventListItem[]>();
const livesListCache = new Map<string, PublicLiveListItem[]>();

const buildEventsQuery = (params: { marketRegion?: string; page?: number; pageSize?: number }) => {
  const query = new URLSearchParams();
  if (params.marketRegion) query.append('marketRegion', params.marketRegion);
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());
  return query.toString();
};

const buildLivesQuery = (params: { page?: number; pageSize?: number }) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());
  return query.toString();
};

export const getCachedEvents = (params: { marketRegion?: string; page?: number; pageSize?: number } = {}): PublicEventListItem[] | null => {
  return eventsListCache.get(buildEventsQuery(params)) ?? null;
};

export const getCachedLives = (params: { page?: number; pageSize?: number } = {}): PublicLiveListItem[] | null => {
  return livesListCache.get(buildLivesQuery(params)) ?? null;
};

const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries`);
};

const fetchEventsPage = async (params: {
  marketRegion?: string;
  page: number;
  pageSize?: number;
}): Promise<PublicEventsListResponse> => {
  const query = buildEventsQuery(params);
  const url = query ? `${BASE_URL}/events?${query}` : `${BASE_URL}/events`;
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Failed to fetch events: ${response.statusText}`);
  return response.json();
};

export const fetchEvents = async (
  params: { marketRegion?: string; page?: number; pageSize?: number } = {},
  options: { forceRefresh?: boolean } = {}
): Promise<PublicEventListItem[]> => {
  try {
    const query = buildEventsQuery(params);
    const cacheKey = query;

    if (!options.forceRefresh) {
      const cached = eventsListCache.get(cacheKey);
      if (cached) return cached;
    }

    if (params.page) {
      const data = await fetchEventsPage({
        marketRegion: params.marketRegion,
        page: params.page,
        pageSize: params.pageSize,
      });
      eventsListCache.set(cacheKey, data.items);
      return data.items;
    }

    const pageSize = params.pageSize ?? EVENTS_FETCH_PAGE_SIZE;
    let page = 1;
    let total = Number.POSITIVE_INFINITY;
    const allItems: PublicEventListItem[] = [];

    while (allItems.length < total && page <= LIST_FETCH_MAX_PAGES) {
      const data = await fetchEventsPage({
        marketRegion: params.marketRegion,
        page,
        pageSize,
      });
      total = data.pageInfo.total;
      allItems.push(...data.items);
      if (data.items.length === 0) break;
      page += 1;
    }

    const merged = allItems.slice(0, Number.isFinite(total) ? total : allItems.length);
    eventsListCache.set(cacheKey, merged);
    return merged;
  } catch (error) {
    console.error("fetchEvents error:", error);
    throw error;
  }
};

export const fetchEventBySlug = async (slug: string): Promise<PublicEventDetailResponse> => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/events/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch event ${slug}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error(`fetchEventBySlug(${slug}) error:`, error);
    throw error;
  }
};

const fetchLivesPage = async (params: {
  page: number;
  pageSize?: number;
}): Promise<PublicLivesListResponse> => {
  const query = buildLivesQuery(params);
  const url = query ? `${BASE_URL}/lives?${query}` : `${BASE_URL}/lives`;
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Failed to fetch lives: ${response.statusText}`);
  return response.json();
};

export const fetchLives = async (
  params: { page?: number; pageSize?: number } = {},
  options: { forceRefresh?: boolean } = {}
): Promise<PublicLiveListItem[]> => {
  try {
    const query = buildLivesQuery(params);
    const cacheKey = query;

    if (!options.forceRefresh) {
      const cached = livesListCache.get(cacheKey);
      if (cached) return cached;
    }

    if (params.page) {
      const data = await fetchLivesPage({
        page: params.page,
        pageSize: params.pageSize,
      });
      livesListCache.set(cacheKey, data.items);
      return data.items;
    }

    const pageSize = params.pageSize ?? LIVES_FETCH_PAGE_SIZE;
    let page = 1;
    let total = Number.POSITIVE_INFINITY;
    const allItems: PublicLiveListItem[] = [];

    while (allItems.length < total && page <= LIST_FETCH_MAX_PAGES) {
      const data = await fetchLivesPage({
        page,
        pageSize,
      });
      total = data.pageInfo.total;
      allItems.push(...data.items);
      if (data.items.length === 0) break;
      page += 1;
    }

    const merged = allItems.slice(0, Number.isFinite(total) ? total : allItems.length);
    livesListCache.set(cacheKey, merged);
    return merged;
  } catch (error) {
    console.error("fetchLives error:", error);
    throw error;
  }
};

export const fetchLiveBySlug = async (slug: string): Promise<PublicLiveDetailResponse> => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/lives/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch live ${slug}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error(`fetchLiveBySlug(${slug}) error:`, error);
    throw error;
  }
};

const fetchCirclesPage = async (params: {
  page: number;
  pageSize: number;
  eventId?: string;
}): Promise<PublicCirclesListResponse> => {
  const query = new URLSearchParams();
  query.append('page', params.page.toString());
  query.append('pageSize', params.pageSize.toString());
  if (params.eventId) query.append('eventId', params.eventId);

  const response = await fetchWithRetry(`${BASE_URL}/circles?${query.toString()}`);
  if (!response.ok) throw new Error(`Failed to fetch circles: ${response.statusText}`);
  return response.json();
};

export const fetchCircles = async (params: {
  page?: number;
  pageSize?: number;
  eventId?: string;
} = {}): Promise<PublicCircleListItem[]> => {
  try {
    const pageSize = params.pageSize ?? CIRCLES_FETCH_PAGE_SIZE;

    if (params.page) {
      const onePage = await fetchCirclesPage({
        page: params.page,
        pageSize,
        eventId: params.eventId,
      });
      return onePage.items;
    }

    let page = 1;
    let total = Number.POSITIVE_INFINITY;
    const allItems: PublicCircleListItem[] = [];

    while (allItems.length < total && page <= CIRCLES_FETCH_MAX_PAGES) {
      const data = await fetchCirclesPage({
        page,
        pageSize,
        eventId: params.eventId,
      });

      total = data.pageInfo.total;
      allItems.push(...data.items);

      if (data.items.length === 0) break;
      page += 1;
    }

    return allItems.slice(0, Number.isFinite(total) ? total : allItems.length);
  } catch (error) {
    console.error("fetchCircles error:", error);
    throw error;
  }
};

export const fetchCircleBySlug = async (slug: string): Promise<PublicCircleDetailResponse> => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/circles/${slug}`);
    if (!response.ok) throw new Error(`Failed to fetch circle ${slug}: ${response.statusText}`);
    return response.json();
  } catch (error) {
    console.error(`fetchCircleBySlug(${slug}) error:`, error);
    throw error;
  }
};

export const fetchCircleById = async (id: string): Promise<Circle> => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/circles/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch circle ${id}: ${response.statusText}`);
    const data: PublicCircleDetailResponse = await response.json();
    const todayDateKey = getBusinessDateKey(DEFAULT_BUSINESS_TIME_ZONE);
    
    // Map PublicCircleDetailResponse back to Circle for the view
    const c = data.circle;
    return {
      id: c.id,
      name: c.title,
      penName: c.penName,
      description: c.description,
      image: c.avatar?.urls.original || '',
      banner: c.bannerImage?.urls.original,
      socials: {
        twitter: c.platformUrls.twitter,
        pixiv: c.platformUrls.pixiv,
        website: c.platformUrls.website,
        youtube: c.platformUrls.youtube,
      },
      tags: c.tags,
      genre: c.tags || [],
      events: c.participationHistory.map(h => ({
        eventId: h.event.id,
        eventName: h.event.title,
        date: h.event.startAt,
        spaceCode: h.boothCode || '',
        status: (() => {
          const endDateKey = extractDateKey(h.event.endAt);
          if (!endDateKey) return 'Ended';
          return diffCalendarDays(todayDateKey, endDateKey) >= 0 ? 'Upcoming' : 'Ended';
        })(),
        products: [] 
      })),
      gallery: c.gallery.map(g => g.imageUrl)
    };
  } catch (error) {
    console.error(`fetchCircleById(${id}) error:`, error);
    throw error;
  }
};
