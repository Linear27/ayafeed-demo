
import { Event } from '../../types';

export const sapporoKamui: Event = {
  id: 'e_kamui',
  title: '大東方神居祭2',
  date: '2025-02-23',
  location: '札幌コンベンションセンター (Sapporo Convention Center)',
  image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop',
  posterOrientation: 'portrait',
  illustrator: '荻pote (ogipote)',
  description: '北海道地区最大规模的东方Project主题同人即卖会。继首届活动大获好评后，第二届“神居祭”将规模扩大至札幌会议中心的大型展厅。本次活动不仅包含传统的同人志交易，还特别增设了“北方幻视演舞”音乐区、企业摊位区以及由北海道当地画师组成的“北国特色角”。',
  genre: ['東方Project', '同人即売会', 'Hokkaido', 'Cosplay'],
  organizer: '神居祭実行委員会',
  boothCount: 450,
  entryFee: '1,000円 (预售) / 1,200円 (当日)',
  website: 'https://hapirevo.net/kamui/',
  venueCoordinates: [141.3854, 43.0567],
  transportation: '札幌地下鉄東西線「東札幌駅」から徒歩約8分。札幌駅からタクシーで约20分。',
  relatedEvents: [
    { title: '北方幻視演舞 2025', description: '音乐/DJ 特设舞台', type: 'Sub', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop' },
    { title: '神居COS摄影专区', description: '特设室内外摄影区', type: 'Sub' }
  ],
  schedule: [
    { time: '10:00', description: '社团入场 (Circle Entry)' },
    { time: '11:00', description: 'Cosplayer 提前入场' },
    { time: '11:30', description: '即卖会正式开场 (General Admission)' },
    { time: '13:00', description: '「北方幻视演舞」Live舞台第一场开始' },
    { time: '15:30', description: '即卖会结束 / 场内广播' }
  ],
  news: [
    { date: '2025-01-15', title: '大東方神居祭2 场地布局图预览公开', type: 'Update', content: '由于社团申请数量超出预期，我们重新调整了摊位布局，增加了10%的通道宽度以确保安全。' },
    { date: '2025-01-05', title: 'Cosplay 登录及规则说明发布', type: 'Info', content: '本次活动支持大件道具入场，但请务必查阅新的道具安全检查标准。' }
  ],
  floorMapImages: [
    { name: '札幌会议中心 全场图 (预定)', url: 'https://images.unsplash.com/photo-1541462608141-ad60397d446f?q=80&w=1000&auto=format&fit=crop' }
  ],
  docs: {
    attendee: [{ title: '一般参加者心得 (PDF)', url: '#', type: 'PDF' }],
    circle: [{ title: '社团搬运指南 (PDF)', url: '#', type: 'PDF' }, { title: '托运货物标签模板', url: '#', type: 'Link' }]
  },
  features: [
    { title: '北国同人角', description: '展示来自北海道本土 50 余个社团的特色创作。', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400&auto=format&fit=crop' }
  ]
};
