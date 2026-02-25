
import { Event } from '../../types';

export const tokyoHamamatsucho: Event = {
  id: 'e_godousaiji',
  title: '東方合同祭事 拾伍',
  date: '2025-09-14',
  location: '東京都立産業貿易センター 浜松町館',
  image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop', 
  posterOrientation: 'portrait',
  illustrator: '藤ちょこ (fuzichoco)',
  description: '由 Project-D 主办的东方Project大型主题合同即卖会。本次活动汇集了「月的宴」、「小春小径」、「風神のあしあと」等7个Only展。',
  genre: ['東方Project', '合同祭', 'Only Event', '同人即売会'],
  organizer: 'Project-D',
  boothCount: 700,
  entryFee: '1,500円',
  website: 'https://project-d.biz/tohosaiji/',
  venueCoordinates: [139.7607, 35.6554],
  transportation: 'JR「滨松町站」北口徒步5分 / 东京单轨电车「滨松町站」徒步5分 / 都营大江户线・浅草线「大门站」徒步7分',
  relatedEvents: [
    { id: 'sub_tsukinoutage', title: '月の宴 弐拾', description: '东方永夜抄 Only', type: 'Sub', image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=600&auto=format&fit=crop' },
    { id: 'sub_koharu', title: '小春小径 拾捌', description: '博丽灵梦中心 Only', type: 'Sub', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop' },
    { id: 'sub_fuujin', title: '風神のあしあと 拾伍', description: '东方风神录 Only', type: 'Sub' },
    { id: 'sub_chireiden', title: '地霊殿の主 拾伍', description: '东方地灵殿 Only', type: 'Sub' }
  ],
  schedule: [
    { time: '09:30', description: '社团入场开始 (Circle Entry)' },
    { time: '11:00', description: '即卖会正式开场 / 展会开始' },
    { time: '15:00', description: '即卖会结束 / 场内收尾' }
  ],
  news: [
    { date: '2024-12-25', title: '東方合同祭事 拾伍 特设网站正式公开', type: 'Info', content: 'Project-D 确认将于2025年9月14日在滨松町馆举办第15届合同祭事。', url: 'https://project-d.biz/tohosaiji/' },
    { date: '2025-01-10', title: '社团参加申请(Circle)正式开启', type: 'Important', content: '预计招募700个展位。' }
  ],
  floorMapImages: [
    { name: '4F 展厅布局图 (预定)', url: 'https://images.unsplash.com/photo-1541462608141-ad60397d446f?q=80&w=1000&auto=format&fit=crop' }
  ],
  docs: {
    attendee: [{ title: '一般参加者指南 (PDF)', url: '#', type: 'PDF' }],
    circle: [{ title: '社团参加条款 (PDF)', url: '#', type: 'PDF' }]
  }
};
