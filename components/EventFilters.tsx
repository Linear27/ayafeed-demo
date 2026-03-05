
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, History, MapPin, Tag } from 'lucide-react';

interface EventFiltersProps {
  isOpen: boolean;
  timeFilter: 'UPCOMING' | 'PAST';
  setTimeFilter: (val: 'UPCOMING' | 'PAST') => void;
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  availableRegionGroups: string[];
  availableGenres: { ips: string[]; types: string[] };
  onClearAll: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  isOpen, timeFilter, setTimeFilter,
  selectedRegions, setSelectedRegions,
  selectedGenres, setSelectedGenres,
  availableRegionGroups, availableGenres,
  onClearAll
}) => {
  const toggleSelection = (item: string, currentList: string[], setList: (l: string[]) => void) => {
    if (currentList.includes(item)) setList(currentList.filter(i => i !== item));
    else setList([...currentList, item]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-[var(--space-md)] overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] p-[var(--space-lg)] shadow-[var(--paper-shadow-md)]"
        >
          <div className="grid grid-cols-1 gap-[var(--space-xl)] md:grid-cols-3">
            {/* Time Filter */}
            <div>
              <h4 className="mb-[var(--space-md)] flex items-center text-[10px] font-black tracking-widest text-[var(--paper-text)] uppercase">
                <Calendar size={12} className="mr-[var(--space-sm)]" /> 时段筛选
              </h4>
              <div className="flex gap-[var(--space-sm)]">
                <button 
                  onClick={() => setTimeFilter('UPCOMING')}
                  className={`px-4 py-2 text-xs font-bold transition-all border ${
                    timeFilter === 'UPCOMING' 
                    ? 'border-[var(--paper-border)] bg-[var(--paper-accent)] text-[var(--paper-surface)] shadow-[var(--paper-shadow-sm)]'
                    : 'border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-muted)] hover:bg-[var(--paper-hover)]'
                  }`}
                >
                  即将到来
                </button>
                <button 
                  onClick={() => setTimeFilter('PAST')}
                  className={`px-4 py-2 text-xs font-bold transition-all border ${
                    timeFilter === 'PAST' 
                    ? 'border-[var(--paper-border)] bg-[var(--paper-border)] text-[var(--paper-surface)] shadow-[var(--paper-shadow-sm)]'
                    : 'border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-muted)] hover:bg-[var(--paper-hover)]'
                  }`}
                >
                  <History size={12} className="inline mr-1" /> 过往存根
                </button>
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <h4 className="mb-[var(--space-md)] flex items-center text-[10px] font-black tracking-widest text-[var(--paper-text)] uppercase">
                <MapPin size={12} className="mr-[var(--space-sm)]" /> 举办地区
              </h4>
              <div className="flex flex-wrap gap-[var(--space-sm)]">
                {availableRegionGroups.map(region => (
                  <button 
                    key={region}
                    onClick={() => toggleSelection(region, selectedRegions, setSelectedRegions)}
                    className={`px-3 py-1.5 text-[10px] font-bold transition-all border ${
                      selectedRegions.includes(region)
                      ? 'border-[var(--paper-border)] bg-[var(--paper-border)] text-[var(--paper-surface)]'
                      : 'border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-muted)] hover:bg-[var(--paper-hover)]'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <h4 className="mb-[var(--space-md)] flex items-center text-[10px] font-black tracking-widest text-[var(--paper-text)] uppercase">
                <Tag size={12} className="mr-[var(--space-sm)]" /> 题材与类别
              </h4>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {availableGenres.types.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      className={`px-2 py-1 text-[9px] font-bold border ${
                        selectedGenres.includes(genre)
                        ? 'border-[var(--paper-border)] bg-[var(--paper-accent)] text-[var(--paper-surface)]'
                        : 'border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-muted)] hover:bg-[var(--paper-hover)]'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableGenres.ips.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      className={`px-2 py-1 text-[9px] font-bold border ${
                        selectedGenres.includes(genre)
                        ? 'border-[var(--paper-border)] bg-[var(--paper-border)] text-[var(--paper-surface)]'
                        : 'border-[var(--paper-border)] bg-[var(--paper-surface)] text-[var(--paper-muted)] hover:bg-[var(--paper-hover)]'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[var(--space-xl)] flex items-center justify-between border-t border-[var(--paper-border)]/20 pt-[var(--space-lg)]">
             <p className="text-[10px] font-bold font-serif italic text-[var(--paper-muted)]">
               * 筛选结果将由文文新闻办公室实时核准。
             </p>
             <button 
              onClick={onClearAll}
              className="border-b-2 border-[var(--paper-border)] pb-0.5 text-[10px] font-black tracking-widest text-[var(--paper-text)] uppercase transition-colors hover:border-[var(--paper-accent)] hover:text-[var(--paper-accent)]"
             >
                重置所有条件
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventFilters;
