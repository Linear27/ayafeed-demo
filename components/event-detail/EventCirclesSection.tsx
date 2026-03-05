
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Package, ShoppingBag, BookOpen, Layers } from 'lucide-react';
import { PublicCircleListItem } from '../../types';

interface EventCirclesSectionProps {
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
  circleMetadata, searchQuery, setSearchQuery, showFilters, setShowFilters,
  selectedFocus, setSelectedFocus, selectedLocations, setSelectedLocations,
  availableLocations, displayedCircles, hasMore, onLoadMore, onPreviewCircle, eventId
}) => {
  const toggleSelection = (item: string, currentList: string[], setList: (l: string[]) => void) => {
    if (currentList.includes(item)) setList(currentList.filter(i => i !== item));
    else setList([...currentList, item]);
  };

  const getFocusBadge = (focus: string) => {
    switch (focus) {
      case 'NEW':
        return {
          label: '新作/新刊',
          icon: Sparkles,
          color: 'bg-[var(--paper-accent)]',
          textColor: 'text-[var(--paper-surface)]',
        };
      case 'SET':
        return {
          label: '活动套装',
          icon: Package,
          color: 'bg-[var(--paper-border)]',
          textColor: 'text-[var(--paper-surface)]',
        };
      case 'GOODS':
        return {
          label: '周边主打',
          icon: ShoppingBag,
          color: 'bg-[var(--paper-live-bg)]',
          textColor: 'text-[var(--paper-live-text)]',
        };
      default:
        return {
          label: '既刊/展示',
          icon: BookOpen,
          color: 'bg-[var(--paper-muted)]',
          textColor: 'text-[var(--paper-surface)]',
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[var(--paper-surface)] p-4 border-2 border-[var(--paper-border)] flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-text-muted)]/50" size={18} />
          <input 
            type="text" 
            placeholder="搜索社团名、摊位号、作者..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--paper-bg-secondary)]/30 border border-[var(--paper-border)]/20 font-mono text-sm focus:outline-none focus:border-[var(--paper-accent)] focus:ring-1 focus:ring-[var(--paper-accent)] text-[var(--paper-text)] placeholder-[var(--paper-text-muted)]/40" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 border border-[var(--paper-border)] font-black text-xs sm:text-sm flex items-center justify-center uppercase tracking-widest transition-colors ${showFilters ? 'bg-[var(--paper-border)] text-[var(--paper-surface)]' : 'bg-[var(--paper-surface)] text-[var(--paper-text)] hover:bg-[var(--paper-bg-secondary)]/50'} active:bg-[var(--paper-bg-secondary)]`}>
          <SlidersHorizontal size={16} className="mr-2" /> 筛选条件
        </button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[var(--paper-bg-secondary)]/30 p-4 border border-[var(--paper-border)]/20">
            <div className="space-y-4">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--paper-text-muted)]/60 mb-2">作品焦点</h4>
                <div className="flex gap-2 flex-wrap">
                  {[
                    {id:'NEW', label:'新作/新刊', icon:Sparkles},
                    {id:'SET', label:'套装', icon:Package},
                    {id:'GOODS', label:'周边', icon:ShoppingBag},
                    {id:'REGULAR', label:'展示', icon:BookOpen}
                  ].map(f => (
                    <button key={f.id} onClick={() => toggleSelection(f.id, selectedFocus, setSelectedFocus)} className={`px-2 py-1 text-[10px] border border-[var(--paper-border)] font-black flex items-center gap-1.5 transition-colors ${selectedFocus.includes(f.id) ? 'bg-[var(--paper-accent)] text-[var(--paper-surface)] border-[var(--paper-accent)]' : 'bg-[var(--paper-surface)] text-[var(--paper-text)]'}`}>
                      <f.icon size={12}/> {f.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--paper-text-muted)]/60 mb-2">展区 / 字母块</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableLocations.map(loc => (
                    <button key={loc} onClick={() => toggleSelection(loc, selectedLocations, setSelectedLocations)} className={`px-2 py-1 text-[10px] border border-[var(--paper-border)] font-black transition-colors ${selectedLocations.includes(loc) ? 'bg-[var(--paper-border)] text-[var(--paper-surface)]' : 'bg-[var(--paper-surface)] text-[var(--paper-text)]'}`}>{loc}</button>
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
            const circleCompat = circle as any;
            const meta = circleMetadata.find(m => m.id === circle.id);
            const badge = getFocusBadge(meta?.focus || 'REGULAR');
            const eventRecord = Array.isArray(circleCompat.events)
              ? circleCompat.events.find((ev: any) => ev.eventId === eventId)
              : null;
            const spaceCode = eventRecord?.spaceCode || circleCompat.spaceCode || 'TBD';
            const displayName = circle.title || circleCompat.name || '未命名社团';
            const avatarUrl =
              circle.avatar?.urls.original ||
              circleCompat.poster?.urls?.original ||
              circleCompat.image ||
              'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=400&auto=format&fit=crop';
            const summary = circleCompat.summary || circleCompat.description || '该社团尚未公开简介。';
            const genres = circle.tags?.length > 0 ? circle.tags : (circleCompat.genres || []);
            
            return (
              <div 
                key={circle.id} 
                onClick={() => onPreviewCircle(circle)} 
                className="group relative flex flex-col h-full cursor-pointer transition-all bg-[var(--paper-surface)] border-2 border-[var(--paper-border)] newspaper-shadow hover:newspaper-shadow-hover active:translate-y-0.5"
              >
                <div className={`absolute top-0 right-0 z-10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider transform translate-x-1 -translate-y-1 border border-[var(--paper-border)] ${badge.color} ${badge.textColor}`}>
                   <div className="flex items-center gap-1">
                     <badge.icon size={10} />
                     {badge.label}
                   </div>
                </div>

                <div className="absolute top-8 right-2 font-mono text-[10px] font-black bg-[var(--paper-surface)] text-[var(--paper-text)] px-1.5 py-0.5 border border-[var(--paper-border)] shadow-sm z-10">
                    {spaceCode}
                </div>

                <div className="aspect-[16/10] overflow-hidden relative border-b-2 border-[var(--paper-border)]/10">
                    <div className="w-full h-full bg-[var(--paper-bg-secondary)]/30 flex items-center justify-center">
                        <BookOpen className="opacity-10 text-[var(--paper-text)]" size={32} />
                    </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 overflow-hidden border-2 border-[var(--paper-border)]">
                            <img src={avatarUrl} className="w-full h-full object-cover" alt={displayName} referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-black text-xs sm:text-sm truncate font-header text-[var(--paper-text)]">{displayName}</h4>
                            <div className="text-[10px] text-[var(--paper-text-muted)]/60 truncate font-mono uppercase font-black">{circle.penName}</div>
                        </div>
                    </div>
                    <p className="text-[11px] mb-3 sm:mb-4 line-clamp-2 leading-relaxed font-serif text-[var(--paper-text-muted)] italic">
                        {summary}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1">
                        {genres.slice(0, 2).map((g: string) => (
                            <span key={g} className="text-[9px] px-1.5 py-0.5 font-black uppercase bg-[var(--paper-bg-secondary)]/30 border border-[var(--paper-border)]/10 text-[var(--paper-text-muted)]">
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
        <div className="text-center py-16 bg-[var(--paper-bg-secondary)]/20 border-2 border-dashed border-[var(--paper-border)]/20">
           <Layers size={40} className="mx-auto mb-4 opacity-10 text-[var(--paper-text)]" />
           <div className="font-serif italic text-[var(--paper-text-muted)]/60 text-sm px-8">未找到符合当前筛选条件的社团。</div>
        </div>
      )}
      
      {hasMore && (
        <div className="mt-8 text-center pb-8">
          <button
            onClick={onLoadMore}
            className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-[var(--space-xl)] py-[var(--space-sm)] text-xs font-black tracking-widest text-[var(--paper-text)] uppercase shadow-[var(--paper-shadow-md)] transition-all hover:bg-[var(--paper-hover)] active:translate-y-1 active:bg-[var(--paper-active)] active:shadow-none"
          >
            加载更多
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCirclesSection;
