
import { Event } from '../../types';

export const kyotoGoudou: Event = {
  id: 'e_kyoto_goudou',
  title: '京都合同同人祭 2025 (Kyoto Doujin Festival)',
  date: '2025-11-08',
  location: '京都市勧业馆みやこめっせ',
  image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop',
  posterOrientation: 'landscape',
  illustrator: 'あやめ (Ayame)',
  description: '在古都京都举办的大型同人合同展示会。本次活动汇集了「文々。新闻友の会」、「科学世纪のカフェテラス」以及「求代目の红茶会」三大主题Only展会。',
  genre: ['東方Project', '合同祭', 'Only Event', 'Music', 'Novel'],
  organizer: '京都合同祭実行委員会',
  boothCount: 1100,
  entryFee: '1,200円 (全展区通用)',
  website: 'https://bunbunmaru-np.com/',
  venueCoordinates: [135.7831, 35.0134],
  transportation: '地下铁东西线「东山站」下车 步行约8分',
  relatedEvents: [
    { id: 'e_bunbun', title: '第百四十一季 文々。新聞友の会', description: '射命丸文中心 Only', type: 'Sub', image: 'https://images.unsplash.com/photo-1576487241809-41815134c1b0?q=80&w=600&auto=format&fit=crop' },
    { id: 'e_cafe_terrace', title: '科学世紀のカフェテラス(第15回)', description: '秘封倶楽部 Only', type: 'Sub', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop' },
    { id: 'e_tea_party', title: '求代目の紅茶会(第15回)', description: '稗田阿求 Only', type: 'Sub', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?q=80&w=600&auto=format&fit=crop' }
  ]
};
