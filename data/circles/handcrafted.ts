
import { Circle } from '../../types';

export const HANDCRAFTED_CIRCLES: Circle[] = [
  {
    id: 'c_ezo_vision',
    name: '虾夷幻想视界 (Ezo Vision)',
    penName: '北海冬马',
    description: '北海道本土东方创作社团。专注于将北海道自然风光与东方Project角色相结合。',
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
        products: [{ id: 'p_yukikage', title: '雪影神居 - 2025冬', price: '¥1,500', type: 'New', description: '札幌冬季主题全彩插画集。', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=500&auto=format&fit=crop' }]
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
  }
];
