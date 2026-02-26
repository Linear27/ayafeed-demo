import { Live } from '../../types';

const KKZSK_SOURCE_URL = 'https://vanishinghermit.com/kkzsk/';

export const KKZSK_2026_LIVES: Live[] = [
  {
    id: 'l_touhou_echigo_live_2026',
    title: '東方越後祭・第3幕 Live Stage',
    date: '2026-04-12',
    time: '13:30',
    openTime: '12:30',
    startTime: '13:30',
    endTime: '17:00',
    venue: 'アオーレ長岡',
    country: 'JP',
    worldRegion: 'JP',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    venueCoordinates: [138.8513739, 37.4462164],
    price: '以官方公告为准',
    description: 'kkzsk 条目标注 [ライブ] 的东方活动舞台单元。',
    website: 'https://comicchallenge.web.fc2.com/toe03.html',
    artists: [
      {
        name: '東方越後祭 Stage Session',
        role: 'Live Program',
        type: 'Event',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500&auto=format&fit=crop',
      },
    ],
    docs: {
      attendee: [
        { title: '活动索引（kkzsk）', url: KKZSK_SOURCE_URL, type: 'Link' },
        { title: '东方式后祭 官方页', url: 'https://comicchallenge.web.fc2.com/toe03.html', type: 'Link' },
      ],
    },
    notes: ['舞台时刻与出场安排请以主办最新公告为准。'],
  },
  {
    id: 'l_m3_spring_2026_stage',
    title: 'M3-2026春 同人音楽 Stage Focus',
    date: '2026-04-26',
    time: '11:00',
    openTime: '10:30',
    startTime: '11:00',
    endTime: '16:00',
    venue: '東京流通センター (TRC)',
    country: 'JP',
    worldRegion: 'JP',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop',
    venueCoordinates: [139.7505, 35.5867],
    price: '以官方公告为准',
    description: 'kkzsk 收录的音楽イベント条目，聚合同人音乐舞台重点。',
    website: 'https://www.m3net.jp/',
    artists: [
      {
        name: 'M3 Live Showcase',
        role: 'Music Stage',
        type: 'Event',
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500&auto=format&fit=crop',
      },
    ],
    docs: {
      attendee: [
        { title: 'M3 公式サイト', url: 'https://www.m3net.jp/', type: 'Link' },
        { title: '活动索引（kkzsk）', url: KKZSK_SOURCE_URL, type: 'Link' },
      ],
    },
    notes: ['该条目依据 kkzsk 音乐活动索引生成，具体演出单元请查阅 M3 官方信息。'],
  },
];
