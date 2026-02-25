
import { Live } from '../../types';

export const utaMatsuri: Live = {
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
};
