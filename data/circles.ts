import { Circle } from '../types';

// Helper for dynamic generation
const generateCircles = (count: number): Circle[] => {
  const mainTypes: any[] = ['Music', 'Manga/Illust', 'Novel', 'Game', 'Goods', 'Other'];
  const genres = ['幻想郷', '秘封', '红魔馆', '地灵殿', '永夜抄', '风神录', '妖妖梦'];
  const targetEvents = ['e_godousaiji', 'e_kyoto_goudou', 'e_kamui'];
  
  return Array.from({ length: count }).map((_, i) => {
    const id = `c_dynamic_${i + 1}`;
    const type = mainTypes[i % mainTypes.length];
    const eventId = targetEvents[i % targetEvents.length];
    
    // Logic for Event specific details
    let eventName = 'Other Event';
    let date = '2025-01-01';
    let block = 'A';
    if (eventId === 'e_godousaiji') {
      eventName = '東方合同祭事 拾伍';
      date = '2025-09-14';
      block = ['灵', '魔', '红', '冥', '风', '月'][i % 6];
    } else if (eventId === 'e_kyoto_goudou') {
      eventName = '京都合同同人祭 2025';
      date = '2025-11-08';
      block = ['文', '求', '科', '秘'][i % 4];
    } else {
      eventName = '大東方神居祭2';
      date = '2025-02-23';
      block = '北';
    }

    const spaceNum = (i % 50) + 1;
    const spaceSide = i % 2 === 0 ? 'a' : 'b';
    const spaceCode = `${block}-${spaceNum}${spaceSide}`;

    return {
      id,
      name: `${['幻想', '幽明', '月下', '翠星', '白玉'][i % 5]}${['书屋', '工房', '乐团', '画室', '社'][i % 5]} No.${i + 1}`,
      penName: `Creator_${i + 100}`,
      description: `这是社团 ${id} 的简介。我们长期致力于 ${type} 创作。本次在 ${eventName} 的 ${spaceCode} 展位为大家带来最新的同人作品，欢迎光临！`,
      genre: ['東方Project', genres[i % genres.length], type],
      image: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345)}?q=80&w=400&auto=format&fit=crop`,
      banner: `https://images.unsplash.com/photo-${1510000000000 + (i * 12345)}?q=80&w=1000&auto=format&fit=crop`,
      socials: { twitter: `https://twitter.com/circle_${i}` },
      tags: [type, '同人', genres[i % genres.length]],
      gallery: [
         `https://images.unsplash.com/photo-${1520000000000 + (i * 12345)}?q=80&w=400&auto=format&fit=crop`,
         `https://images.unsplash.com/photo-${1530000000000 + (i * 12345)}?q=80&w=400&auto=format&fit=crop`
      ],
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
          status: 'Upcoming',
          products: [
            { 
              id: `p_${id}_new`, 
              title: `${type} 新刊/新作 Vol.${(i % 5) + 1}`, 
              price: `¥${(i % 3 + 1) * 500}`, 
              type: 'New',
              description: '本次活动的首发作品，包含限定特典。',
              image: `https://images.unsplash.com/photo-${1540000000000 + (i * 12345)}?q=80&w=500&auto=format&fit=crop`
            }
          ]
        }
      ]
    };
  });
};

export const CIRCLES: Circle[] = [
  // --- HIGH QUALITY HAND-CRAFTED CIRCLES (10) ---
  {
    id: 'c_ezo_vision',
    name: '虾夷幻想视界 (Ezo Vision)',
    penName: '北海冬马',
    description: '北海道本土东方创作社团。专注于将北海道自然风光与东方Project角色相结合，本次将带来以札幌冬季异变为主题的全新全彩画册《雪影神居》。',
    genre: ['東方Project', 'Scenery', 'Illust'],
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop',
    socials: { twitter: 'https://twitter.com/ezovision_sapporo' },
    classification: { mainType: 'Manga/Illust', subType: 'Scenery', scale: 'Team', focus: 'Event' },
    events: [
      {
        eventId: 'e_kamui',
        eventName: '大東方神居祭2',
        date: '2025-02-23',
        spaceCode: '北-01ab',
        status: 'Upcoming',
        products: [{ id: 'p_yukikage', title: '雪影神居 - 2025冬', price: '¥1,500', type: 'New', description: '札幌冬季主题全彩插画集，B5/32P。', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_project_d',
    name: 'Project-D 公式本部',
    penName: 'D-Admin',
    description: '東方合同祭事主办方直营摊位。销售历届活动纪念册、官方周边及目录。',
    genre: ['東方Project', 'Official', 'Goods'],
    image: 'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2070&auto=format&fit=crop',
    socials: { twitter: 'https://twitter.com/project_d' },
    classification: { mainType: 'Goods', scale: 'Corporate', focus: 'Event' },
    events: [
      {
        eventId: 'e_godousaiji',
        eventName: '東方合同祭事 拾伍',
        date: '2025-09-14',
        spaceCode: '本部-01',
        status: 'Upcoming',
        products: [{ id: 'p_anniv_book', title: '15周年纪念插画集', price: '¥3,000', type: 'New', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_moon_palace',
    name: '月下宮殿',
    penName: '月姬',
    description: '专注于「月の宴」主题的二次创作。致力于描绘永远亭与辉夜、妹红之间的复杂羁绊。',
    genre: ['東方Project', 'Illust', 'Novel'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1444464666168-49d633b867ad?q=80&w=2070&auto=format&fit=crop',
    socials: { twitter: 'https://twitter.com/moon_palace' },
    classification: { mainType: 'Manga/Illust', scale: 'Individual', focus: 'Event' },
    events: [
      {
        eventId: 'e_godousaiji',
        eventName: '東方合同祭事 拾伍',
        date: '2025-09-14',
        spaceCode: '月-01a',
        status: 'Upcoming',
        products: [{ id: 'p_moon_reunion', title: '月の再会', price: '¥1,500', type: 'New', image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_azure_horizon',
    name: 'Azure Horizon',
    penName: 'Sora',
    description: '专注于幻想乡风景画的社团。本次带来以「风神录」为背景的全新画册。',
    genre: ['東方Project', 'Illust', 'Scenery'],
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    socials: { twitter: 'https://twitter.com/azure_sora', pixiv: 'https://pixiv.net/users/azure' },
    classification: { mainType: 'Manga/Illust', subType: 'Scenery', scale: 'Individual', focus: 'Event' },
    events: [
      {
        eventId: 'e_godousaiji',
        eventName: '東方合同祭事 拾伍',
        date: '2025-09-14',
        spaceCode: '风-12b',
        status: 'Upcoming',
        products: [{ id: 'p_mountain_god', title: '山神之诗', price: '¥1,200', type: 'New', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_digital_maiden',
    name: 'Digital Maiden',
    penName: 'M-Code',
    description: '东方同人游戏开发社团。正在开发一款以河城荷取为主角的工坊经营模拟游戏。',
    genre: ['東方Project', 'Game', 'Tech'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    socials: { website: 'https://mcode-games.example' },
    classification: { mainType: 'Game', subType: 'Simulation', scale: 'Team', focus: 'Event' },
    events: [
      {
        eventId: 'e_godousaiji',
        eventName: '東方合同祭事 拾伍',
        date: '2025-09-14',
        spaceCode: '本部-05',
        status: 'Upcoming',
        products: [{ id: 'p_nitori_workshop', title: '荷取的超级工房 Demo', price: '¥0', type: 'New', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_silver_soundscape',
    name: 'Silver Soundscape',
    penName: 'Arata',
    description: '提供高质量的东方Vocal编曲。曲风涵盖Pop到Metal。',
    genre: ['東方Project', 'Music', 'Vocal'],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop',
    socials: { youtube: 'https://youtube.com/silver_sound' },
    classification: { mainType: 'Music', subType: 'Vocal/Rock', scale: 'Team', focus: 'Event' },
    events: [
      {
        eventId: 'e_kyoto_goudou',
        eventName: '京都合同同人祭 2025',
        date: '2025-11-08',
        spaceCode: '文々-C02',
        status: 'Upcoming',
        products: [{ id: 'p_silver_album', title: 'Reflections in Silver', price: '¥1,500', type: 'New', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_ghostly_whispers',
    name: '幽冥の囁き',
    penName: 'Saigyou',
    description: '主打幽幽子与妖梦的温馨日常漫画。画风柔软细腻。',
    genre: ['東方Project', 'Manga', 'Slice of Life'],
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?q=80&w=1000&auto=format&fit=crop',
    socials: { twitter: 'https://twitter.com/ghostly_saigyou' },
    classification: { mainType: 'Manga/Illust', subType: 'Healing', scale: 'Individual', focus: 'Event' },
    events: [
      {
        eventId: 'e_godousaiji',
        eventName: '東方合同祭事 拾伍',
        date: '2025-09-14',
        spaceCode: '冥-04b',
        status: 'Upcoming',
        products: [{ id: 'p_ghost_spring', title: '幽冥的春祭', price: '¥600', type: 'Existing', image: 'https://images.unsplash.com/photo-1543157148-f815da396c1c?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_kappa_labs',
    name: 'Kappa Labs',
    penName: 'Nitori-Dev',
    description: '不仅做软件，也做硬件周边的社团。本次展位提供定制按键帽和电路风格立牌。',
    genre: ['東方Project', 'Goods', 'Tech'],
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    socials: { twitter: 'https://twitter.com/kappa_labs' },
    classification: { mainType: 'Goods', subType: 'Hardware', scale: 'Team', focus: 'Event' },
    events: [
      {
        eventId: 'e_kyoto_goudou',
        eventName: '京都合同同人祭 2025',
        date: '2025-11-08',
        spaceCode: '文々-A01',
        status: 'Upcoming',
        products: [{ id: 'p_kappa_key', title: '光学伪装按键帽', price: '¥800', type: 'New', image: 'https://images.unsplash.com/photo-1595044426077-d36d7242d6d8?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_scarlet_library',
    name: '红魔馆书库',
    penName: 'Pachouli',
    description: '严肃向幻想乡史学研究。通过考据与合理想象补完幻想乡的魔法生态。',
    genre: ['東方Project', 'Novel', 'Academic'],
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop',
    socials: {},
    classification: { mainType: 'Novel', subType: 'Serious/Mystery', scale: 'Individual', focus: 'Online' },
    events: [
      {
        eventId: 'e_godousaiji',
        eventName: '東方合同祭事 拾伍',
        date: '2025-09-14',
        spaceCode: '红-03a',
        status: 'Upcoming',
        products: [{ id: 'p_magic_guide', title: '现代魔法概论', price: '¥1,500', type: 'Set', image: 'https://images.unsplash.com/photo-1532012197367-bb83f5ff91bc?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },
  {
    id: 'c_tengu_reporter',
    name: '天狗通讯社',
    penName: 'Aya-Editor',
    description: '专注于新闻纪实摄影与周边开发的社团。包含大量高质量的Cosplay摄影集。',
    genre: ['東方Project', 'Photography', 'Goods'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1452723312111-3a7d0db0e024?q=80&w=1000&auto=format&fit=crop',
    socials: {},
    classification: { mainType: 'Other', subType: 'Photography', scale: 'Team', focus: 'Event' },
    events: [
      {
        eventId: 'e_kyoto_goudou',
        eventName: '京都合同同人祭 2025',
        date: '2025-11-08',
        spaceCode: '文々-S01',
        status: 'Upcoming',
        products: [{ id: 'p_tengu_photo', title: '幻想乡最速报: 2024', price: '¥2,000', type: 'New', image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?q=80&w=500&auto=format&fit=crop' }]
      }
    ]
  },

  // --- DYNAMICALLY GENERATED (200+) ---
  ...generateCircles(210)
];
