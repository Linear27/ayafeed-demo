
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { fetchLives } from '../services/api';
import { PublicLiveListItem } from '../types';
import { LiveCardSkeleton } from '../components/Skeleton';
import { adaptLiveListItem } from '../services/adapters';

const WORLD_REGIONS = [
  { id: 'JAPAN', label: '日本国内' },
  { id: 'CN_MAINLAND', label: '中国大陆' },
  { id: 'OVERSEAS', label: '海外/其他' },
  { id: 'GLOBAL', label: '全球特报' },
];

const REGION_MAP: Record<string, string> = {
  'JP': 'JAPAN',
  'CN': 'CN_MAINLAND',
  'OVERSEA': 'OVERSEAS',
  'JAPAN': 'JAPAN',
  'CN_MAINLAND': 'CN_MAINLAND',
  'OVERSEAS': 'OVERSEAS'
};

interface LiveListViewProps {
  onSelect: (id: string) => void; 
  activeRegion: string;
  onSetRegion: (reg: string) => void;
}

const LiveListView: React.FC<LiveListViewProps> = ({ onSelect, activeRegion, onSetRegion }) => {
  const [lives, setLives] = useState<PublicLiveListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLives = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLives();
        setLives(data);
      } catch (error) {
        console.error("Failed to fetch lives:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLives();
  }, []);

  const adaptedLives = useMemo(() => lives.map(adaptLiveListItem), [lives]);

  const filteredLives = useMemo(() => {
    return adaptedLives.filter(live => {
        const rawRegion = live.marketRegion || 'JAPAN';
        const mappedRegion = REGION_MAP[rawRegion] || 'OVERSEAS';
        
        if (activeRegion !== 'GLOBAL' && mappedRegion !== activeRegion) return false;
        const q = searchTerm.toLowerCase().trim();
        return !q || 
               (live.title?.toLowerCase().includes(q) ?? false) || 
               (live.venue?.toLowerCase().includes(q) ?? false);
    }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [adaptedLives, searchTerm, activeRegion]);

  const getDisplayTitle = () => {
    const region = WORLD_REGIONS.find(r => r.id === activeRegion);
    return region ? `${region.label}演出名录` : '演出名录';
  };

  return (
    <motion.div className="w-full min-h-[100dvh] pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-100/50 rounded-xl w-fit">
          {WORLD_REGIONS.map(reg => (
            <button key={reg.id} onClick={() => onSetRegion(reg.id)}
              aria-label={`切换到${reg.label}`}
              className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                activeRegion === reg.id ? 'bg-black text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b-4 border-black">
           <div>
             <div className="bg-red-600 text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest mb-2 inline-block">LIVE REVIEWS</div>
             <h2 className="text-3xl font-black font-header text-black">
                {getDisplayTitle()}
             </h2>
           </div>
        </div>

        <div className="mb-10 sticky top-[68px] z-30 py-2 transition-all bg-[#FDFBF7]/95">
           <div className="flex gap-3">
              <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-black" size={18} />
                  <input 
                    id="live-search"
                    name="live-search"
                    type="text" 
                    placeholder="搜索演出名称、场馆..."
                    className="w-full pl-12 pr-12 py-3.5 text-sm font-bold focus:outline-none transition-all bg-white border-2 border-black focus:ring-4 focus:ring-red-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </div>
           </div>
        </div>

        {isLoading ? <LiveCardSkeleton count={6} /> : (
          <>
            {filteredLives.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {filteredLives.map((live) => (
                  <motion.div key={live.id} onClick={() => onSelect(live.id)} 
                    className="group flex flex-col md:flex-row cursor-pointer transition-all duration-300 overflow-hidden bg-white border-2 border-black newspaper-shadow hover:newspaper-shadow-hover"
                  >
                      <div className="md:w-24 flex md:flex-col items-center justify-center p-5 text-center shrink-0 bg-black text-white border-r-2 border-black border-dashed">
                          <div className="text-xs font-black uppercase mb-1">{live.date.split('-')[1]}月</div>
                          <div className="text-3xl font-black leading-none">{live.date.split('-')[2]}</div>
                      </div>
                      <div className="flex-1 p-6 min-w-0">
                          <h3 className="text-xl font-black mb-2 truncate font-header text-slate-900 group-hover:text-red-700">{live.title}</h3>
                          <div className="text-xs text-slate-500 flex items-center"><MapPin size={12} className="mr-1.5" /><span className="truncate">{live.venue}</span></div>
                      </div>
                      <div className="md:w-32 h-32 md:h-auto overflow-hidden">
                          <img src={live.image || 'https://picsum.photos/seed/live/300/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-xl">
                <div className="text-slate-400 mb-4 flex justify-center"><Search size={48} /></div>
                <h3 className="text-xl font-black text-slate-900 mb-2">未找到相关演出</h3>
                <p className="text-slate-500 mb-6">尝试更换搜索词或切换区域</p>
                <button 
                  onClick={() => { setSearchTerm(''); onSetRegion('GLOBAL'); }}
                  className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  重置筛选
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default LiveListView;
