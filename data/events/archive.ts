
import { Event } from '../../types';

export const ARCHIVED_EVENTS: Event[] = [
  {
    id: 'e_c103',
    title: 'Comic Market 103 (C103)',
    date: '2023-12-30',
    location: '東京ビッグサイト (Tokyo Big Sight)',
    image: 'https://images.unsplash.com/photo-1574950578143-858c6fc58922?q=80&w=2070&auto=format&fit=crop',
    description: 'Winter Comiket 103. The largest doujinshi event in the world.',
    genre: ['All Genre', 'Comiket', 'Doujinshi'],
    organizer: 'Comiket Preparatory Committee',
    boothCount: 20000,
    entryFee: 'Ticket Required',
    website: 'https://www.comiket.co.jp/',
    venueCoordinates: [139.7962, 35.6301],
    transportation: 'Rinkai Line / Yurikamome Line'
  },
  {
    id: 'e_reitaisai_21',
    title: '博麗神社例大祭 21 (Reitaisai 21)',
    date: '2024-05-03',
    location: '東京ビッグサイト (Tokyo Big Sight)',
    image: 'https://images.unsplash.com/photo-1542358899-7f3747514309?q=80&w=2000&auto=format&fit=crop',
    description: 'The premier Touhou Project only event.',
    genre: ['東方Project', 'Only Event'],
    organizer: 'Hakurei Shrine Reitaisai',
    boothCount: 4000,
    entryFee: 'Catalog Purchase',
    website: 'https://reitaisai.com/',
    venueCoordinates: [139.7962, 35.6301]
  }
];
