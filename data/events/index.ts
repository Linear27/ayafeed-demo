
import { Event } from '../../types';
import { kyotoGoudou } from './kyoto_goudou';
import { tokyoHamamatsucho } from './tokyo_hamamatsucho';
import { sapporoKamui } from './sapporo_kamui';
import { osakaTreasure } from './osaka_treasure';
import { ARCHIVED_EVENTS } from './archive';

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

export const EVENTS: Event[] = [
  kyotoGoudou,
  tokyoHamamatsucho,
  sapporoKamui,
  osakaTreasure,
  ...REGIONAL_MOCK_DATA,
  ...ARCHIVED_EVENTS
];
