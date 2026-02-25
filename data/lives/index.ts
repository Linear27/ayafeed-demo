
import { Live } from '../../types';
import { utaMatsuri } from './uta_matsuri';
import { lostwordLive } from './lostword';

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

export const LIVES: Live[] = [
  { ...utaMatsuri, worldRegion: 'JP' },
  { ...lostwordLive, worldRegion: 'JP' },
  ...REGIONAL_LIVE_MOCKS
];
