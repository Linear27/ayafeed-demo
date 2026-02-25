
import { Live } from '../types';

export const LIVES: Live[] = [
  {
    id: 'l_uta_matsuri',
    title: 'Gensokyo Uta Matsuri 2025 -Phantom Harmony-',
    date: '2025-05-24',
    time: 'Day Stage: 13:00 / Night Stage: 18:00',
    openTime: '16:00',
    startTime: '17:00',
    venue: 'Yokohama Arena',
    venueCoordinates: [139.6366, 35.5098],
    image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop',
    price: '¥8,800 ~ ¥15,000',
    description: 'The largest Touhou vocal arrangement festival of the year.',
    website: 'https://example.com/uta-matsuri',
    artists: [
      { name: 'Butaotome', type: 'Circle', role: 'Band', group: 'Guest', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=500&auto=format&fit=crop' },
      { name: 'Akatsuki Records', type: 'Circle', role: 'Rock Unit', group: 'Guest', image: 'https://images.unsplash.com/photo-1459749411177-0473ef716175?q=80&w=500&auto=format&fit=crop' }
    ],
    ticketTiers: [
        { name: 'General Seat', price: '¥8,800', status: 'Available' }
    ],
    docs: {
      attendee: [
        { title: '观众入场规则 (Attendee Guide)', url: '#', type: 'PDF' },
        { title: '应援棒及打Call规范', url: '#', type: 'Link' }
      ]
    }
  },
  {
    id: 'l_lostword',
    title: 'Touhou LostWord Live 2024 -Fantasy Rebirth-',
    date: '2024-11-03',
    time: '17:00',
    venue: 'Kawasaki Culttz',
    venueCoordinates: [139.7082, 35.5298],
    image: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=2070&auto=format&fit=crop',
    price: '¥9,800',
    description: 'Featuring the vocal arrangements from the hit mobile RPG "Touhou LostWord".',
    artists: [
        { name: 'Reimu Hakurei', type: 'Character', role: 'CV', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop' }
    ],
    docs: {
      attendee: [{ title: 'LostWord Live 官方说明书', url: '#', type: 'PDF' }]
    }
  },
  {
    id: 'l_flowering_2025',
    title: 'Flowering Night 2025 -Re:Union-',
    date: '2025-08-10',
    time: '18:00',
    venue: 'Zepp Haneda',
    venueCoordinates: [139.7548, 35.5488],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    price: '¥7,500',
    description: 'A legendary night returns. Experience the most iconic Touhou arrangements live on stage.',
    artists: [
        { name: 'COOL&CREATE', type: 'Circle', role: 'Vocal / Arrangement', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500&auto=format&fit=crop' }
    ]
  },
  {
    id: 'l_reitaisai_after',
    title: 'Hakurei Shrine Reitaisai After Party',
    date: '2025-05-11',
    time: '20:00',
    venue: 'Tokyo Big Sight - Special Hall',
    venueCoordinates: [139.7962, 35.6301],
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    price: '¥3,500',
    description: 'The official celebration after the main event. DJ sets and mini-lives.',
    artists: [
        { name: 'IOSYS', type: 'Circle', role: 'DJ Set', image: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=500&auto=format&fit=crop' }
    ]
  }
];
