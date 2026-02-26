
import { Live } from '../../types';
import { utaMatsuri } from './uta_matsuri';
import { lostwordLive } from './lostword';
import { KKZSK_2026_LIVES } from './kkzsk_2026';

const KKZSK_SOURCE_URL = 'https://vanishinghermit.com/kkzsk/';

const FALLBACK_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
];

const BROKEN_UNSPLASH_TOKENS = [
  '1459749411177-0473ef716175',
  '1501386761578-e9503f879cb8',
  '1514525253440-b393452e8d26',
  '1533174072545-e8d4aa97edf9',
];

const pickFallbackImage = (seed: number) =>
  FALLBACK_IMAGE_POOL[Math.abs(seed) % FALLBACK_IMAGE_POOL.length];

const normalizeImage = (url: string | undefined, seed: number) => {
  if (!url) return pickFallbackImage(seed);
  const isBroken = BROKEN_UNSPLASH_TOKENS.some((token) => url.includes(token));
  return isBroken ? pickFallbackImage(seed) : url;
};

const normalizeLive = (live: Live, index: number): Live => ({
  ...live,
  image: normalizeImage(live.image, index),
  artists: Array.isArray(live.artists)
    ? live.artists.map((artist, artistIndex) => ({
        ...artist,
        image: normalizeImage(artist.image, index + artistIndex + 10),
      }))
    : live.artists,
  goods: Array.isArray(live.goods)
    ? live.goods.map((good, goodIndex) => ({
        ...good,
        image: normalizeImage(good.image, index + goodIndex + 30),
      }))
    : live.goods,
  website: live.website && live.website !== '#' ? live.website : KKZSK_SOURCE_URL,
  venueCoordinates: live.venueCoordinates || [139.7671, 35.6812],
  docs: (() => {
    const fallbackUrl = live.website && live.website !== '#' ? live.website : KKZSK_SOURCE_URL;
    const rawDocs = (live.docs || {}) as { attendee?: any[]; circle?: any[] };
    const normalizeEntries = (entries: any[] | undefined, title: string) => {
      if (!Array.isArray(entries) || entries.length === 0) {
        return [{ title, url: fallbackUrl, type: 'Link' as const }];
      }
      return entries.map((entry, idx) => ({
        title: entry?.title || `${title} ${idx + 1}`,
        url: entry?.url && entry.url !== '#' ? entry.url : fallbackUrl,
        type: entry?.type === 'PDF' ? 'PDF' : 'Link',
      }));
    };
    return {
      attendee: normalizeEntries(rawDocs.attendee, '活动信息与入场指引'),
      circle: normalizeEntries(rawDocs.circle, '演出参与说明'),
    };
  })(),
});

const REGIONAL_LIVE_MOCKS: Live[] = [
  {
    id: 'l_taipei_live',
    title: 'Gensokyo Night in Taipei 2025',
    date: '2025-02-16',
    time: '19:00',
    venue: 'Legacy Taipei',
    country: 'TW',
    worldRegion: 'OVERSEA',
    image: 'https://images.unsplash.com/photo-1501386761578-e9503f879cb8?q=80&w=2070&auto=format&fit=crop',
    price: '1,800 TWD',
    description: '海外分社台北特报：紧接 FF44 举办的同人音乐 Live。',
    artists: [
      { name: 'Stack', role: 'Vocal', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500&auto=format&fit=crop' }
    ]
  },
  {
    id: 'l_shanghai_vmo',
    title: 'Shanghai Touhou Only Live - CP30 Special',
    date: '2025-04-12',
    time: '19:30',
    venue: '上海万代南梦宫文化中心',
    country: 'CN',
    worldRegion: 'CN',
    image: 'https://images.unsplash.com/photo-1459749411177-0473ef716175?q=80&w=2070&auto=format&fit=crop',
    price: '280 CNY',
    description: '中国大陆频道快讯：CP30 同期的专场演出。',
    artists: [
      { name: 'Kore', role: 'Arranger', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop' }
    ]
  }
];

const BASE_LIVES: Live[] = [
  { ...utaMatsuri, worldRegion: 'JP' },
  { ...lostwordLive, worldRegion: 'JP' },
  ...REGIONAL_LIVE_MOCKS,
  ...KKZSK_2026_LIVES,
];

export const LIVES: Live[] = BASE_LIVES.map((live, index) => normalizeLive(live, index));
