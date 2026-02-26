
import { Event } from '../../types';
import { kyotoGoudou } from './kyoto_goudou';
import { tokyoHamamatsucho } from './tokyo_hamamatsucho';
import { sapporoKamui } from './sapporo_kamui';
import { osakaTreasure } from './osaka_treasure';
import { ARCHIVED_EVENTS } from './archive';
import { KKZSK_2026_EVENTS } from './kkzsk_2026';

const KKZSK_SOURCE_URL = 'https://vanishinghermit.com/kkzsk/';

const FALLBACK_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
];

const BROKEN_UNSPLASH_TOKENS = [
  '1459749411177-0473ef716175',
  '1501386761578-e9503f879cb8',
  '1514525253440-b393452e8d26',
  '1533174072545-e8d4aa97edf9',
  '1541462608141-ad60397d446f',
  '1542358899-7f3747514309',
  '1576487241809-41815134c1b0',
];

const FALLBACK_COORDS_BY_REGION: Record<string, [number, number]> = {
  JP: [139.7671, 35.6812], // Tokyo Station
  CN: [121.4737, 31.2304], // Shanghai
  OVERSEA: [121.5654, 25.033], // Taipei
};

const pickFallbackImage = (seed: number) =>
  FALLBACK_IMAGE_POOL[Math.abs(seed) % FALLBACK_IMAGE_POOL.length];

const isBrokenImage = (url: string | undefined): boolean => {
  if (!url) return true;
  return BROKEN_UNSPLASH_TOKENS.some((token) => url.includes(token));
};

const normalizeImage = (url: string | undefined, seed: number): string =>
  isBrokenImage(url) ? pickFallbackImage(seed) : url!;

type NormalizedDoc = { title: string; url: string; type: 'PDF' | 'Link' };

const normalizeDocEntries = (
  docs: unknown,
  fallbackTitle: string,
  fallbackUrl: string
): NormalizedDoc[] => {
  if (!Array.isArray(docs) || docs.length === 0) {
    return [{ title: fallbackTitle, url: fallbackUrl, type: 'Link' }];
  }

  return docs.map((item, idx) => {
    const doc = (item || {}) as { title?: string; url?: string; type?: 'PDF' | 'Link' };
    const resolvedUrl = doc.url && doc.url !== '#' ? doc.url : fallbackUrl;
    return {
      title: doc.title || `${fallbackTitle} ${idx + 1}`,
      url: resolvedUrl,
      type: doc.type === 'PDF' ? 'PDF' : 'Link',
    };
  });
};

const inferCountry = (event: Event): string => {
  if (event.country) return event.country.toUpperCase();
  const loc = event.location.toLowerCase();
  if (loc.includes('上海')) return 'CN';
  if (loc.includes('台北') || loc.includes('taipei')) return 'TW';
  if (loc.includes('seoul')) return 'KR';
  return 'JP';
};

const inferWorldRegion = (country: string, raw?: string): string => {
  if (raw === 'JP' || raw === 'CN' || raw === 'OVERSEA') return raw;
  if (country === 'JP') return 'JP';
  if (country === 'CN') return 'CN';
  return 'OVERSEA';
};

const normalizeDocs = (event: Event, fallbackUrl: string) => {
  const rawDocs = (event.docs || {}) as { attendee?: unknown; circle?: unknown };
  return {
    attendee: normalizeDocEntries(rawDocs.attendee, '一般参加者指南', fallbackUrl),
    circle: normalizeDocEntries(rawDocs.circle, '社团参加说明', fallbackUrl),
  };
};

const normalizeNews = (event: Event, fallbackUrl: string) => {
  const rawNews = Array.isArray(event.news) ? event.news : [];
  if (rawNews.length > 0) {
    return rawNews.map((item) => {
      const n = (item || {}) as {
        date?: string;
        title?: string;
        type?: string;
        content?: string;
        url?: string;
      };
      return {
        date: n.date || event.date,
        title: n.title || `${event.title} 官方更新`,
        type: n.type || 'Info',
        content: n.content || '详情请以官方公告为准。',
        url: n.url && n.url !== '#' ? n.url : fallbackUrl,
      };
    });
  }

  return [
    {
      date: event.date,
      title: `${event.title} 情报索引已建立`,
      type: 'Info',
      content: '该条目已纳入 AyaFeed 数据库，最新安排请以官方渠道发布为准。',
      url: fallbackUrl,
    },
  ];
};

const normalizeFloorMaps = (event: Event, seed: number) => {
  const raw = Array.isArray(event.floorMapImages) ? event.floorMapImages : [];
  if (raw.length > 0) {
    return raw.map((item, idx) => {
      const map = (item || {}) as { name?: string; url?: string };
      return {
        name: map.name || `${event.location} 场馆图 ${idx + 1}`,
        url: normalizeImage(map.url, seed + idx),
      };
    });
  }

  return [
    {
      name: `${event.location} 场馆导览图（示意）`,
      url: pickFallbackImage(seed + 10),
    },
  ];
};

const normalizeEventForFeed = (event: Event, index: number): Event => {
  const country = inferCountry(event);
  const worldRegion = inferWorldRegion(country, event.worldRegion);
  const website = event.website && event.website !== '#' ? event.website : KKZSK_SOURCE_URL;
  const coordinates = event.venueCoordinates || FALLBACK_COORDS_BY_REGION[worldRegion] || FALLBACK_COORDS_BY_REGION.JP;

  const normalizedRelatedEvents = Array.isArray(event.relatedEvents)
    ? event.relatedEvents.map((item, idx) => {
        const rel = (item || {}) as { image?: string };
        return { ...item, image: normalizeImage(rel.image, index + idx + 20) };
      })
    : event.relatedEvents;

  return {
    ...event,
    image: normalizeImage(event.image, index),
    website,
    country,
    worldRegion,
    venueCoordinates: coordinates,
    news: normalizeNews(event, website),
    docs: normalizeDocs(event, website),
    floorMapImages: normalizeFloorMaps(event, index),
    transportation: event.transportation || '请以官方路线公告为准，建议提前 30 分钟到场。',
    relatedEvents: normalizedRelatedEvents,
  };
};

const REGIONAL_MOCK_DATA: Event[] = [
  {
    id: 'e_bangkok_touhou',
    title: 'Touhou Project Only Event in Bangkok 2025',
    date: '2025-03-15',
    location: 'Bangkok Art and Culture Centre (BACC)',
    country: 'TH',
    worldRegion: 'OVERSEA',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'portrait',
    description: '海外分社曼谷特报：泰国地区规模最大的东方Only展会。',
    genre: ['東方Project', 'OVERSEA', 'Only Event'],
    organizer: 'Touhou Thailand Community',
    boothCount: 80,
    entryFee: '200 THB',
    website: '#',
    venueCoordinates: [100.5300, 13.7460]
  },
  {
    id: 'e_taipei_doujin',
    title: 'Fancy Frontier 44 (FF44)',
    date: '2025-02-15',
    location: '台北花博公園爭艷館',
    country: 'TW',
    worldRegion: 'OVERSEA',
    image: 'https://images.unsplash.com/photo-1541462608141-ad60397d446f?q=80&w=1000&auto=format&fit=crop',
    posterOrientation: 'landscape',
    description: '海外分社台北快讯：最具代表性的同人即卖会。',
    genre: ['All Genre', 'Taiwan', 'Cosplay'],
    organizer: 'Fancy Frontier',
    boothCount: 1500,
    entryFee: '200 TWD',
    website: 'https://www.f-2.com.tw/',
    venueCoordinates: [121.5230, 25.0700]
  },
  {
    id: 'e_shanghai_cp',
    title: 'COMICUP 30 (CP30)',
    date: '2025-04-12',
    location: '上海国家会展中心',
    country: 'CN',
    worldRegion: 'CN',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'landscape',
    description: '中国大陆频道特报：CP30 回归！全国规模最大的同人创作展。',
    genre: ['All Genre', 'Mainland China', 'Large Scale'],
    organizer: 'COMICUP 组委会',
    boothCount: 5000,
    entryFee: '70 CNY',
    website: 'https://www.allcpp.cn/',
    venueCoordinates: [121.3000, 31.1800]
  },
  {
    id: 'e_seoul_comic_world',
    title: 'Seoul Comic World 178',
    date: '2025-05-10',
    location: 'SETEC, Seoul',
    country: 'KR',
    worldRegion: 'OVERSEA',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'portrait',
    description: '海外分社首尔快讯：韩国历史悠久的综合性同人活动。',
    genre: ['All Genre', 'South Korea', 'Anime'],
    organizer: 'Comic World KR',
    boothCount: 1200,
    entryFee: '7,000 KRW',
    website: 'http://www.comicw.co.kr/',
    venueCoordinates: [127.0620, 37.4970]
  }
];

const BASE_EVENTS: Event[] = [
  kyotoGoudou,
  tokyoHamamatsucho,
  sapporoKamui,
  osakaTreasure,
  ...REGIONAL_MOCK_DATA,
  ...KKZSK_2026_EVENTS,
  ...ARCHIVED_EVENTS
];

export const EVENTS: Event[] = BASE_EVENTS.map((event, index) => normalizeEventForFeed(event, index));
