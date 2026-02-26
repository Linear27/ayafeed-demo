
import { Circle, Event } from '../../types';

const STABLE_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
];

const AVATAR_POOL = STABLE_IMAGE_POOL;
const BANNER_POOL = STABLE_IMAGE_POOL;
const PRODUCT_POOL = STABLE_IMAGE_POOL;

type EventSeed = Pick<Event, 'id' | 'title' | 'date'>;

const DEFAULT_EVENT_SEEDS: EventSeed[] = [
  { id: 'e_godousaiji', title: '東方合同祭事 拾伍', date: '2025-09-14' },
  { id: 'e_kyoto_goudou', title: '京都合同同人祭 2025', date: '2025-11-08' },
  { id: 'e_kamui', title: '大東方神居祭2', date: '2025-02-23' },
];

const getBoothBlock = (seed: EventSeed, index: number): string => {
  const chars = ['文', '月', '星', '霊', '紅', '風', '地', '夢', '秘', '北', '海', '都'];
  let hash = 0;
  const text = `${seed.id}:${seed.title}`;
  for (let i = 0; i < text.length; i++) hash = (hash + text.charCodeAt(i)) % 9973;
  return chars[(hash + index) % chars.length];
};

const getStatusFromDate = (date: string): 'Upcoming' | 'Ended' => {
  const today = new Date().toISOString().slice(0, 10);
  return date >= today ? 'Upcoming' : 'Ended';
};

export const generateCircles = (count: number, eventSeeds: EventSeed[] = DEFAULT_EVENT_SEEDS): Circle[] => {
  const mainTypes = ['Music', 'Manga/Illust', 'Novel', 'Game', 'Goods', 'Other'] as const;
  const genres = ['幻想郷', '秘封', '红魔馆', '地灵殿', '永夜抄', '风神录', '妖妖梦'];
  const seeds = eventSeeds.length > 0 ? eventSeeds : DEFAULT_EVENT_SEEDS;
  
  return Array.from({ length: count }).map((_, i) => {
    const id = `c_dynamic_${i + 1}`;
    const type = mainTypes[i % mainTypes.length];
    const seed = seeds[i % seeds.length];
    const eventId = seed.id;
    const eventName = seed.title;
    const date = seed.date;
    const block = getBoothBlock(seed, i);

    const spaceNum = (i % 50) + 1;
    const spaceSide = i % 2 === 0 ? 'a' : 'b';
    const spaceCode = `${block}-${spaceNum}${spaceSide}`;

    return {
      id,
      name: `${['幻想', '幽明', '月下', '翠星', '白玉'][i % 5]}${['书屋', '工房', '乐团', '画室', '社'][i % 5]} No.${i + 1}`,
      penName: `Creator_${i + 100}`,
      description: `这是社团 ${id} 的简介。我们长期致力于 ${type} 创作。本次在 ${eventName} 的 ${spaceCode} 展位为大家带来最新的同人作品！`,
      genre: ['東方Project', genres[i % genres.length], type],
      image: AVATAR_POOL[i % AVATAR_POOL.length],
      banner: BANNER_POOL[i % BANNER_POOL.length],
      socials: { twitter: `https://twitter.com/circle_${i}` },
      tags: [type, '同人', genres[i % genres.length]],
      classification: { 
        mainType: type, 
        scale: (i % 10 === 0) ? 'Team' : 'Individual', 
        focus: 'Event' 
      },
      events: [
        {
          eventId,
          eventName,
          date,
          spaceCode,
          status: getStatusFromDate(date),
          products: [
            { 
              id: `p_${id}_new`, 
              title: `${type} 新刊/新作 Vol.${(i % 5) + 1}`, 
              price: `¥${(i % 3 + 1) * 500}`, 
              type: 'New',
              description: '本次活动的首发作品，包含限定特典。',
              image: PRODUCT_POOL[i % PRODUCT_POOL.length]
            }
          ]
        }
      ]
    };
  });
};
