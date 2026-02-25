
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

  const filteredCircles = useMemo(() => {
    const q = filter.toLowerCase().trim();
    return adaptedCircles.filter(c => 
      (c.name?.toLowerCase().includes(q) ?? false) || 
      (c.penName?.toLowerCase().includes(q) ?? false)
    );
  }, [adaptedCircles, filter]);

  return (
    <motion.div 
      className="max-w-[1200px] mx-auto px-4 py-8 pb-20 min-h-[100dvh]"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
    >
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b-4 border-black pb-6">
          <div>
            <h1 className="text-3xl font-black font-header">社团名录</h1>
          </div>
          <div className="relative w-full md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
                id="circle-search"
                name="circle-search"
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                placeholder="搜索社团名称..." 
                className="w-full pl-10 pr-4 py-3 text-sm font-bold border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
              />
          </div>
       </div>

       {isLoading ? (
         <CircleCardSkeleton />
       ) : (
         <>
           {filteredCircles.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCircles.slice(0, ITEMS_PER_BATCH).map((circle) => {
                  const showBanner = Boolean(circle.banner) && !brokenBannerIds.has(circle.id);
                  const showAvatar = Boolean(circle.image) && !brokenAvatarIds.has(circle.id);

                  return (
                    <motion.div 
                      key={circle.id}
                      onClick={() => onSelect(circle.id)}
                      className="cursor-pointer overflow-hidden transition-all group bg-white border-2 border-black newspaper-shadow hover:newspaper-shadow-hover relative"
                    >
                      <div className="h-24 bg-slate-200 overflow-hidden">
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
                          <div className="w-full h-full bg-[linear-gradient(135deg,#0f172a_0%,#334155_45%,#64748b_100%)]" />
                        )}
                      </div>
                      <div className="px-4 pb-4 -mt-10 relative">
                        {showAvatar ? (
                          <img
                            src={circle.image}
                            alt={circle.name}
                            loading="lazy"
                            className="w-20 h-20 bg-white border-4 border-white shadow-sm"
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
                          <div className="w-20 h-20 bg-slate-200 border-4 border-white shadow-sm" />
                        )}
                        <h3 className="font-bold truncate mt-2 font-header">{circle.name}</h3>
                        <div className="text-xs text-slate-500 mb-3"><PenTool size={12} className="inline mr-1"/> {circle.penName}</div>
                      </div>
                    </motion.div>
                  );
                })}
             </div>
           ) : (
             <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-xl">
               <div className="text-slate-400 mb-4 flex justify-center"><Search size={48} /></div>
               <h3 className="text-xl font-black text-slate-900 mb-2">未找到相关社团</h3>
               <p className="text-slate-500 mb-6">尝试更换搜索词</p>
               <button 
                 onClick={() => setFilter('')}
                 className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
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
