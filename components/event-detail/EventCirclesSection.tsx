
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Package, ShoppingBag, BookOpen, Layers } from 'lucide-react';
import { PublicCircleListItem, Theme } from '../../types';

interface EventCirclesSectionProps {
  circles: PublicCircleListItem[];
  circleMetadata: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedFocus: string[];
  setSelectedFocus: (f: string[]) => void;
  selectedLocations: string[];
  setSelectedLocations: (l: string[]) => void;
  availableLocations: string[];
  displayedCircles: PublicCircleListItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  onPreviewCircle: (c: PublicCircleListItem) => void;
  eventId: string;
}

const EventCirclesSection: React.FC<EventCirclesSectionProps> = ({
  circles, circleMetadata, searchQuery, setSearchQuery, showFilters, setShowFilters,
  selectedFocus, setSelectedFocus, selectedLocations, setSelectedLocations,
  availableLocations, displayedCircles, hasMore, onLoadMore, onPreviewCircle, eventId
}) => {
  const toggleSelection = (item: string, currentList: string[], setList: (l: string[]) => void) => {
    if (currentList.includes(item)) setList(currentList.filter(i => i !== item));
    else setList([...currentList, item]);
  };

  const getFocusBadge = (focus: string) => {
    switch (focus) {
      case 'NEW': return { label: '新作/新刊', icon: Sparkles, color: 'bg-red-600', textColor: 'text-white' };
      case 'SET': return { label: '活动套装', icon: Package, color: 'bg-indigo-600', textColor: 'text-white' };
      case 'GOODS': return { label: '周边主打', icon: ShoppingBag, color: 'bg-amber-500', textColor: 'text-white' };
      default: return { label: '既刊/展示', icon: BookOpen, color: 'bg-slate-600', textColor: 'text-white' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 border-2 border-black flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="搜索社团名、摊位号、作者..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 font-mono text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 border border-black font-black text-xs sm:text-sm flex items-center justify-center uppercase tracking-widest ${showFilters ? 'bg-black text-white' : 'bg-white hover:bg-slate-50'} active:bg-slate-200`}>
          <SlidersHorizontal size={16} className="mr-2" /> 筛选条件
        </button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50 p-4 border border-slate-300">
            <div className="space-y-4">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">作品焦点</h4>
                <div className="flex gap-2 flex-wrap">
                  {[
                    {id:'NEW', label:'新作/新刊', icon:Sparkles},
                    {id:'SET', label:'套装', icon:Package},
                    {id:'GOODS', label:'周边', icon:ShoppingBag},
                    {id:'REGULAR', label:'展示', icon:BookOpen}
                  ].map(f => (
                    <button key={f.id} onClick={() => toggleSelection(f.id, selectedFocus, setSelectedFocus)} className={`px-2 py-1 text-[10px] border border-black font-black flex items-center gap-1.5 ${selectedFocus.includes(f.id) ? 'bg-red-600 text-white border-red-600' : 'bg-white'}`}>
                      <f.icon size={12}/> {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">展区 / 字母块</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableLocations.map(loc => (
                    <button key={loc} onClick={() => toggleSelection(loc, selectedLocations, setSelectedLocations)} className={`px-2 py-1 text-[10px] border border-black font-black ${selectedLocations.includes(loc) ? 'bg-black text-white' : 'bg-white'}`}>{loc}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {displayedCircles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCircles.map(circle => {
            const meta = circleMetadata.find(m => m.id === circle.id);
            const badge = getFocusBadge(meta?.focus || 'REGULAR');
            const spaceCode = circle.spaceCode;
            
            return (
              <div 
                key={circle.id} 
                onClick={() => onPreviewCircle(circle)} 
                className="group relative flex flex-col h-full cursor-pointer transition-all bg-white border-2 border-black newspaper-shadow hover:newspaper-shadow-hover active:translate-y-0.5"
              >
                <div className={`absolute top-0 right-0 z-10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider transform translate-x-1 -translate-y-1 border border-black ${badge.color} ${badge.textColor}`}>
                   <div className="flex items-center gap-1">
                     <badge.icon size={10} />
                     {badge.label}
                   </div>
                </div>

                <div className="absolute top-8 right-2 font-mono text-[10px] font-black bg-white px-1.5 py-0.5 border border-black shadow-sm z-10">
                    {spaceCode}
                </div>

                <div className="aspect-[16/10] overflow-hidden relative border-b-2 border-black">
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <BookOpen className="opacity-10" size={32} />
                    </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 overflow-hidden border-2 border-black">
                            <img src={circle.poster?.urls.original || null} className="w-full h-full object-cover" alt={circle.name} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-black text-xs sm:text-sm truncate font-header">{circle.name}</h4>
                            <div className="text-[10px] text-slate-500 truncate font-mono uppercase font-black">{circle.penName}</div>
                        </div>
                    </div>
                    <p className="text-[11px] mb-3 sm:mb-4 line-clamp-2 leading-relaxed font-serif text-slate-700 italic">
                        {circle.summary}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1">
                        {circle.genres?.slice(0, 2).map(g => (
                            <span key={g} className="text-[9px] px-1.5 py-0.5 font-black uppercase bg-slate-100 border border-slate-300 text-slate-600">
                                {g}
                            </span>
                        ))}
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200">
           <Layers size={40} className="mx-auto mb-4 opacity-10" />
           <div className="font-serif italic text-slate-400 text-sm px-8">未找到符合当前筛选条件的社团。</div>
        </div>
      )}
      
      {hasMore && (
        <div className="mt-8 text-center pb-8">
          <button onClick={onLoadMore} className="px-8 py-3 bg-white border-2 border-black font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1">
            加载更多
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCirclesSection;
