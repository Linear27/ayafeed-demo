
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, PenTool } from 'lucide-react';
import { fetchCircles } from '../services/api';
import { PublicCircleListItem } from '../types';
import { CircleCardSkeleton } from '../components/Skeleton';
import { adaptCircleListItem } from '../services/adapters';

const ITEMS_PER_BATCH = 24;

const CircleListView: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const [circles, setCircles] = useState<PublicCircleListItem[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [brokenBannerIds, setBrokenBannerIds] = useState<Set<string>>(new Set());
  const [brokenAvatarIds, setBrokenAvatarIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  
  useEffect(() => {
    const loadCircles = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCircles();
        setCircles(data);
      } catch (error) {
        console.error("Failed to fetch circles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCircles();
  }, []);

  const adaptedCircles = useMemo(() => circles.map(adaptCircleListItem), [circles]);

  useEffect(() => {
    setBrokenBannerIds(new Set());
    setBrokenAvatarIds(new Set());
  }, [circles]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
  }, [filter, circles]);

  const filteredCircles = useMemo(() => {
    const q = filter.toLowerCase().trim();
    return adaptedCircles.filter(c => 
      (c.name?.toLowerCase().includes(q) ?? false) || 
      (c.penName?.toLowerCase().includes(q) ?? false)
    );
  }, [adaptedCircles, filter]);

  const visibleCircles = useMemo(() => {
    return filteredCircles.slice(0, visibleCount);
  }, [filteredCircles, visibleCount]);

  const hasMore = visibleCount < filteredCircles.length;

  return (
    <motion.div 
      className="max-w-[1200px] mx-auto px-4 py-8 pb-20 min-h-[100dvh]"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
    >
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b-4 border-[var(--paper-border)] pb-6">
          <div>
            <h1 className="text-3xl font-black font-header text-[var(--paper-text)]">社团名录</h1>
          </div>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-text-muted)]/50" size={18} />
             <input 
                id="circle-search"
                name="circle-search"
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                placeholder="搜索社团名称..." 
                className="w-full border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-10 py-3 text-sm font-bold text-[var(--paper-text)] placeholder-[var(--paper-text-muted)]/50 shadow-[var(--paper-shadow-md)] focus:outline-none focus:ring-2 focus:ring-[var(--paper-accent)]/20" 
              />
          </div>
       </div>

       {isLoading ? (
         <CircleCardSkeleton />
       ) : (
         <>
           {filteredCircles.length > 0 ? (
             <div className="space-y-8">
               <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {visibleCircles.map((circle) => {
                  const showBanner = Boolean(circle.banner) && !brokenBannerIds.has(circle.id);
                  const showAvatar = Boolean(circle.image) && !brokenAvatarIds.has(circle.id);

                  return (
                    <motion.div 
                      key={circle.id}
                      onClick={() => onSelect(circle.id)}
                      className="cursor-pointer overflow-hidden transition-all group bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow hover:newspaper-shadow-hover relative"
                    >
                      <div className="h-24 bg-[var(--paper-bg-secondary)] overflow-hidden">
                        {showBanner ? (
                          <img
                            src={circle.banner}
                            alt={`${circle.name} banner`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setBrokenBannerIds((prev) => {
                                if (prev.has(circle.id)) return prev;
                                const next = new Set(prev);
                                next.add(circle.id);
                                return next;
                              })
                            }
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--paper-border)]/5" />
                        )}
                      </div>
                      <div className="px-4 pb-4 -mt-10 relative">
                        {showAvatar ? (
                          <img
                            src={circle.image}
                            alt={circle.name}
                            loading="lazy"
                            className="w-20 h-20 bg-[var(--paper-surface)] border-4 border-[var(--paper-surface)] shadow-sm"
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setBrokenAvatarIds((prev) => {
                                if (prev.has(circle.id)) return prev;
                                const next = new Set(prev);
                                next.add(circle.id);
                                return next;
                              })
                            }
                          />
                        ) : (
                          <div className="w-20 h-20 bg-[var(--paper-bg-secondary)] border-4 border-[var(--paper-surface)] shadow-sm" />
                        )}
                        <h3 className="font-bold truncate mt-2 font-header text-[var(--paper-text)]">{circle.name}</h3>
                        <div className="mb-[var(--space-sm)] text-xs text-[var(--paper-text-muted)]"><PenTool size={12} className="mr-1 inline"/> {circle.penName}</div>
                      </div>
                    </motion.div>
                  );
                })}
               </div>

               {hasMore ? (
                 <div className="text-center">
                   <button
                     onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_BATCH)}
                     className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-8 py-2 text-xs font-black uppercase tracking-widest text-[var(--paper-text)] shadow-[var(--paper-shadow-md)] transition-colors hover:bg-[var(--paper-hover)] active:bg-[var(--paper-active)]"
                   >
                     加载更多社团
                   </button>
                 </div>
               ) : null}
             </div>
           ) : (
             <div className="py-20 text-center border-2 border-dashed border-[var(--paper-border)]/20 rounded-xl bg-[var(--paper-surface)]/50">
               <div className="text-[var(--paper-text-muted)]/40 mb-4 flex justify-center"><Search size={48} /></div>
               <h3 className="text-xl font-black text-[var(--paper-text)] mb-2">未找到相关社团</h3>
               <p className="text-[var(--paper-text-muted)] mb-6">尝试更换搜索词</p>
               <button 
                 onClick={() => setFilter('')}
                 className="px-6 py-2 bg-[var(--paper-border)] text-[var(--paper-surface)] text-xs font-black uppercase tracking-widest hover:bg-[var(--paper-accent)] transition-colors"
               >
                 清除搜索
               </button>
             </div>
           )}
         </>
       )}
    </motion.div>
  );
};

export default CircleListView;
