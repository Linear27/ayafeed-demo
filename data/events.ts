
import { Event } from '../types';

export const EVENTS: Event[] = [
  // --- UPCOMING EVENTS (Featured first for Landing demo) ---
  {
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
  },
  {
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
  },
  {
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
    transportation: '札幌地下鉄東西線「東札幌駅」から徒歩約8分。札幌駅からタクシーで約20分。',
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
  },
  {
    id: 'e_comictreasure_45',
    title: 'Comic Treasure 45',
    date: '2025-08-17',
    location: 'インテックス大阪 (INTEX Osaka)',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'portrait',
    illustrator: '七瀬葵 (Aoi Nanase)',
    description: '关西地区最大级别的全年龄同人即卖会。涵盖从二次创作到原创作品的广泛领域。',
    genre: ['All Genre', '同人即売会', 'Original', 'Manga'],
    organizer: '青ブーブー通信社',
    boothCount: 2500,
    entryFee: '1,000円 (预售)',
    website: 'https://www.aoboo.jp/',
    venueCoordinates: [135.4172, 34.6347],
    transportation: 'Osaka Metro南港港城线「中埠头站」步行约5分'
  },
  {
    id: 'e_nagoya_comiclive',
    title: 'Comic Live in 名古屋 2025',
    date: '2025-06-22',
    location: 'ポートメッセなごや (Port Messe Nagoya)',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'landscape',
    description: '在中部地区举办的老牌同人活动，除了即卖会外，还设有Cosplay摄影区。',
    genre: ['All Genre', 'Cosplay', '中部'],
    organizer: 'Studio YOU',
    boothCount: 800,
    entryFee: '900円',
    website: 'https://www.youyou.co.jp/',
    venueCoordinates: [136.8481, 35.0486],
    transportation: '青波线「金城埠头站」步行约5分'
  },
  {
    id: 'e_tokyo_music_fest_2025',
    title: 'Tokyo Indie Music Fest 2025',
    date: '2025-10-12',
    location: '东京流通中心 (TRC)',
    image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'landscape',
    illustrator: 'M-Audio',
    description: '专注于独立音乐与同人音乐的交流即卖会。除了CD销售外，现场还设有多个试听角。',
    genre: ['Music', 'Only Event', 'Audio', 'Digital'],
    organizer: 'Music Circle Network',
    boothCount: 600,
    entryFee: '1,500円',
    website: 'https://example.com/musicfest2025',
    venueCoordinates: [139.7505, 35.5867],
    transportation: '东京单轨电车「流通中心站」下车即达'
  },
  {
    id: 'e_osaka_game_jam_2025',
    title: 'Osaka Doujin Game Jam 2025',
    date: '2025-12-07',
    location: '梅田スカイビル (Umeda Sky Building)',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'portrait',
    description: '关西地区同人游戏开发者的大聚会。现场展示多款尚未发布的独立游戏 Demo，并设有试玩区。',
    genre: ['Game', 'Indie', 'Tech', 'Software'],
    organizer: 'Kansai Game Creators Guild',
    boothCount: 300,
    entryFee: '1,200円',
    website: 'https://example.com/osakagame2025',
    venueCoordinates: [135.4900, 34.7052],
    transportation: 'JR「大阪站」/ 各线「梅田站」徒步约10分'
  },
  {
    id: 'e_kyushu_pop_culture_2025',
    title: 'Kyushu Pop Culture Carnival 2025',
    date: '2025-07-27',
    location: 'マリンメッセ福岡 (Marine Messe Fukuoka)',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'landscape',
    description: '九州地区最大规模的流行文化盛典，包含同人即卖会、声优脱口秀以及 Cosplay 嘉年华。',
    genre: ['All Genre', 'Kyushu', 'Cosplay', 'Voice Actor'],
    organizer: 'Kyushu Event Lab',
    boothCount: 1500,
    entryFee: '2,000円',
    website: 'https://example.com/kyushupop2025',
    venueCoordinates: [130.4035, 33.6041],
    transportation: '从西铁总站「天神」乘坐巴士约15分'
  },
  {
    id: 'e_shizuoka_touhou_2025',
    title: '第十二回 静冈东方祭 (Shizuoka Touhou Festival)',
    date: '2025-11-23',
    location: 'ツインメッセ静岡 (Twin Messe Shizuoka)',
    image: 'https://images.unsplash.com/photo-1493780490432-d8927896e6ad?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'portrait',
    description: '在静冈举办的中规模东方Only展会。以其轻松的氛围和丰富的当地特产企划而闻名。',
    genre: ['東方Project', 'Only Event', 'Shizuoka'],
    organizer: 'Shizuoka Touhou Project',
    boothCount: 350,
    entryFee: '800円',
    website: 'https://example.com/shizuoka2025',
    venueCoordinates: [138.4063, 34.9669],
    transportation: 'JR「静冈站」北口乘坐巴士约15分'
  },

  // --- PAST EVENTS (ARCHIVED) ---
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
  },
  {
    id: 'e_reitaisai_20',
    title: '博麗神社例大祭 20 (Reitaisai 20)',
    date: '2023-05-07',
    location: '東京ビッグサイト (Tokyo Big Sight)',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
    description: 'The 20th Anniversary of the main Touhou Only event.',
    genre: ['東方Project', 'Only Event'],
    organizer: 'Hakurei Shrine Reitaisai',
    boothCount: 4500,
    entryFee: 'Catalog Required',
    website: 'https://reitaisai.com/',
    venueCoordinates: [139.7962, 35.6301]
  },
  {
    id: 'e_treasure_43',
    title: 'Comic Treasure 43',
    date: '2024-01-14',
    location: 'インテックス大阪 (INTEX Osaka)',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
    description: 'Kansai area largest all-genre doujin event early 2024.',
    genre: ['All Genre', 'Kansai'],
    organizer: 'Aoboo',
    boothCount: 2000,
    entryFee: '1,000円',
    website: 'https://www.aoboo.jp/',
    venueCoordinates: [135.4172, 34.6347]
  },
  {
    id: 'e_m3_2023_fall',
    title: 'M3 2023 Autumn (第52回)',
    date: '2023-10-29',
    location: '東京流通センター (TRC)',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
    description: 'Sound and music focused doujin market.',
    genre: ['Music', 'Audio'],
    organizer: 'M3 Preparatory Committee',
    boothCount: 1200,
    entryFee: '1,500円',
    website: 'https://www.m3net.jp/',
    venueCoordinates: [139.7505, 35.5867]
  },
  {
    id: 'e_gataket_176',
    title: '新潟同人誌即売会 (GataKet) 176',
    date: '2024-03-24',
    location: '新潟市産業振興センター',
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop',
    description: 'Spring Gataket session in Niigata.',
    genre: ['All Genre', 'Regional'],
    organizer: 'Gataket Office',
    boothCount: 450,
    entryFee: '800円',
    website: 'https://gataket.com/',
    venueCoordinates: [139.0234, 37.8821]
  },
  {
    id: 'e_sunshine_2023',
    title: 'Sunshine Creation 2023 Summer',
    date: '2023-06-25',
    location: '池袋サンシャインシティ (Sunshine City)',
    image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2070&auto=format&fit=crop',
    description: 'Mid-sized regular event in Ikebukuro.',
    genre: ['All Genre', 'Tokyo'],
    organizer: 'Creation Preparatory Committee',
    boothCount: 1500,
    entryFee: '900円',
    website: 'https://www.creation.gr.jp/',
    venueCoordinates: [139.7196, 35.7289]
  },
  {
    id: 'e_city_osaka_125',
    title: 'COMIC CITY 大阪 125',
    date: '2024-01-07',
    location: 'インテックス大阪 (INTEX Osaka)',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    description: 'Major Osaka doujin event hosted by Akaboo.',
    genre: ['All Genre', 'Kansai'],
    organizer: 'Akaboo',
    boothCount: 3000,
    entryFee: '1,200円',
    website: 'https://www.akaboo.jp/',
    venueCoordinates: [135.4172, 34.6347]
  },
  {
    id: 'e_kyushu_live_2024',
    title: 'Kyushu Comic Live 2024',
    date: '2024-02-11',
    location: '福岡国際会議場',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
    description: 'Largest Kyushu regional doujin event.',
    genre: ['All Genre', 'Kyushu'],
    organizer: 'Studio YOU',
    boothCount: 600,
    entryFee: '900円',
    website: 'https://www.youyou.co.jp/',
    venueCoordinates: [130.4042, 33.6041]
  },
  {
    id: 'e_sapporo_live_2023',
    title: 'Sapporo Comic Live 2023',
    date: '2023-05-21',
    location: 'つどーむ (Tsudome)',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop',
    description: 'Hokkaido spring doujin gathering.',
    genre: ['All Genre', 'Hokkaido'],
    organizer: 'Studio YOU',
    boothCount: 400,
    entryFee: '800円',
    website: 'https://www.youyou.co.jp/',
    venueCoordinates: [141.3854, 43.1154]
  },
  {
    id: 'e_nagoya_live_2023',
    title: 'Nagoya Comic Live 2023 Autumn',
    date: '2023-11-19',
    location: 'ポートメッセなごや',
    image: 'https://images.unsplash.com/photo-1576487241809-41815134c1b0?q=80&w=600&auto=format&fit=crop',
    description: 'Chubu area regional event.',
    genre: ['All Genre', 'Chubu'],
    organizer: 'Studio YOU',
    boothCount: 500,
    entryFee: '900円',
    website: 'https://www.youyou.co.jp/',
    venueCoordinates: [136.8481, 35.0486]
  },
  {
    id: 'e_kourousai_19',
    title: '東方紅楼夢 第19回 (Kourousai 19)',
    date: '2023-10-15',
    location: 'インテックス大阪 (INTEX Osaka)',
    image: 'https://images.unsplash.com/photo-1531050171651-a3a497934821?q=80&w=2070&auto=format&fit=crop',
    description: 'Western Japan premier Touhou only event.',
    genre: ['東方Project', 'Only Event', 'Kansai'],
    organizer: 'Kyoto Touhou Committee',
    boothCount: 2500,
    entryFee: '1,000円',
    website: 'http://koromu-toho.com/',
    venueCoordinates: [135.4172, 34.6347]
  },

  // --- FUTURE DUMMIES ---
  {
    id: 'e_m3_spring_2025',
    title: 'M3 2025 Spring (第55回)',
    date: '2025-04-27',
    location: '东京流通中心 (TRC)',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop',
    posterOrientation: 'portrait',
    description: '专注于音像制品的即卖会。汇集了来自全国各地的独立音乐人与社团。',
    genre: ['Music', 'Only Event', 'Audio'],
    organizer: 'M3准备会',
    boothCount: 1500,
    entryFee: '1,500円',
    website: 'https://www.m3net.jp/',
    venueCoordinates: [139.7505, 35.5867],
    transportation: '东京单轨电车「流通中心站」步行约1分'
  },
  {
    id: 'e_reitaisai_22',
    title: '博麗神社例大祭 22 (Reitaisai 22)',
    date: '2025-05-11',
    location: '東京ビッグサイト (Tokyo Big Sight)',
    image: 'https://images.unsplash.com/photo-1542358899-7f3747514309?q=80&w=2000&auto=format&fit=crop',
    description: 'The 2025 installment of the premier Touhou Project only event.',
    genre: ['東方Project', 'Only Event'],
    organizer: 'Hakurei Shrine Reitaisai',
    boothCount: 4200,
    entryFee: 'Catalog Required',
    website: 'https://reitaisai.com/',
    venueCoordinates: [139.7962, 35.6301],
    relatedEvents: [
      {
        title: 'Petit Only: 幻想郷グルメ合戦',
        description: 'Touhou Food & Cooking Theme Petit Only',
        type: 'External',
        url: 'https://example.com/petit-only',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop'
      }
    ]
  }
];
