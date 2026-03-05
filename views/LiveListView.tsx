
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { fetchLives, getCachedLives } from '../services/api';
import { PublicLiveListItem } from '../types';
import { LiveCardSkeleton } from '../components/Skeleton';
import { adaptLiveListItem } from '../services/adapters';

const WORLD_REGIONS: Record<string, string> = {
  JAPAN: '日本国内',
  CN_MAINLAND: '中国大陆',
  OVERSEAS: '海外/其他',
  GLOBAL: '全球特报',
};

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
}

const LiveListView: React.FC<LiveListViewProps> = ({ onSelect, activeRegion }) => {
  const [lives, setLives] = useState<PublicLiveListItem[]>(() => getCachedLives() ?? []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(() => getCachedLives() === null);

  useEffect(() => {
    let isMounted = true;
    const cached = getCachedLives();

    if (cached) {
      setLives(cached);
      setIsLoading(false);
    }

    const loadLives = async () => {
      if (!cached) setIsLoading(true);
      try {
        const data = await fetchLives({}, { forceRefresh: Boolean(cached) });
        if (!isMounted) return;
        setLives(data);
      } catch (error) {
        console.error("Failed to fetch lives:", error);
      } finally {
        if (!isMounted) return;
        if (!cached) setIsLoading(false);
      }
    };
    loadLives();

    return () => {
      isMounted = false;
    };
  }, []);

  const adaptedLives = useMemo(() => lives.map(adaptLiveListItem), [lives]);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredLives = useMemo(() => {
    return adaptedLives.filter(live => {
        const rawRegion = live.marketRegion || 'JAPAN';
        const mappedRegion = REGION_MAP[rawRegion] || 'OVERSEAS';
        
        if (activeRegion !== 'GLOBAL' && mappedRegion !== activeRegion) return false;
        const q = searchTerm.toLowerCase().trim();
        return !q || 
               (live.title?.toLowerCase().includes(q) ?? false) || 
               (live.venue?.toLowerCase().includes(q) ?? false);
    }).sort((a, b) => {
      const aPast = (a.date || '') < todayStr;
      const bPast = (b.date || '') < todayStr;
      if (aPast !== bPast) return aPast ? 1 : -1; // Upcoming first
      return aPast
        ? (b.date || '').localeCompare(a.date || '') // Past newest first
        : (a.date || '').localeCompare(b.date || ''); // Upcoming nearest first
    });
  }, [adaptedLives, searchTerm, activeRegion, todayStr]);

  const getDisplayTitle = () => {
    const region = WORLD_REGIONS[activeRegion];
    return region ? `${region}演出名录` : '演出名录';
  };

  return (
    <motion.div className="w-full min-h-[100dvh] pb-20" initial={false} animate={{ opacity: 1 }}>
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b-4 border-[var(--paper-border)]">
           <div>
             <div className="bg-[var(--paper-accent)] text-[var(--paper-surface)] px-2 py-0.5 text-xs font-black uppercase tracking-widest mb-2 inline-block">LIVE REVIEWS</div>
             <h2 className="text-3xl font-black font-header text-[var(--paper-text)]">
                {getDisplayTitle()}
             </h2>
             <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
               当前地区：{WORLD_REGIONS[activeRegion] || '幻想乡全域'}
             </div>
           </div>
        </div>

        <div className="mb-10 sticky top-[68px] z-30 py-2 transition-all bg-[var(--paper-bg)]/95">
           <div className="flex gap-[var(--space-sm)]">
              <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-[var(--paper-text)]" size={18} />
                  <input 
                    id="live-search"
                    name="live-search"
                    type="text" 
                    placeholder="搜索演出名称、场馆..."
                    className="w-full border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-12 py-3.5 text-sm font-bold text-[var(--paper-text)] placeholder-[var(--paper-text-muted)]/50 shadow-[var(--paper-shadow-md)] transition-all focus:outline-none focus:ring-4 focus:ring-[var(--paper-accent)]/10"
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
                    className="group flex flex-col md:flex-row cursor-pointer transition-all duration-300 overflow-hidden bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow hover:newspaper-shadow-hover"
                  >
                      <div className="flex shrink-0 items-center justify-center border-r-2 border-dashed border-[var(--paper-border)] bg-[var(--paper-border)] p-[var(--space-lg)] text-center text-[var(--paper-surface)] md:w-24 md:flex-col">
                          <div className="text-xs font-black uppercase mb-1">{live.date.split('-')[1]}月</div>
                          <div className="text-3xl font-black leading-none">{live.date.split('-')[2]}</div>
                      </div>
                      <div className="flex-1 p-6 min-w-0">
                          <h3 className="text-xl font-black mb-2 truncate font-header text-[var(--paper-text)] group-hover:text-[var(--paper-accent)]">{live.title}</h3>
                          <div className="text-xs text-[var(--paper-text-muted)] flex items-center"><MapPin size={12} className="mr-1.5" /><span className="truncate">{live.venue}</span></div>
                      </div>
                      <div className="md:w-32 h-32 md:h-auto overflow-hidden">
                          <img src={live.image || 'https://picsum.photos/seed/live/300/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-[var(--paper-border)]/20 rounded-xl bg-[var(--paper-surface)]/50">
                <div className="text-[var(--paper-text-muted)]/40 mb-4 flex justify-center"><Search size={48} /></div>
                <h3 className="text-xl font-black text-[var(--paper-text)] mb-2">未找到相关演出</h3>
                <p className="text-[var(--paper-text-muted)] mb-6">尝试更换搜索词（地区可在顶部导航切换）</p>
                <button 
                  onClick={() => { setSearchTerm(''); }}
                  className="px-6 py-2 bg-[var(--paper-border)] text-[var(--paper-surface)] text-xs font-black uppercase tracking-widest hover:bg-[var(--paper-accent)] transition-colors"
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
