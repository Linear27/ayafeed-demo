
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
          className="overflow-hidden mt-4 bg-[#F3F1E6] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Time Filter */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center text-black">
                <Calendar size={12} className="mr-2" /> 时段筛选
              </h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTimeFilter('UPCOMING')}
                  className={`px-4 py-2 text-xs font-bold transition-all border ${
                    timeFilter === 'UPCOMING' 
                    ? 'bg-red-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white border-slate-300'
                  }`}
                >
                  即将到来
                </button>
                <button 
                  onClick={() => setTimeFilter('PAST')}
                  className={`px-4 py-2 text-xs font-bold transition-all border ${
                    timeFilter === 'PAST' 
                    ? 'bg-slate-900 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white border-slate-300'
                  }`}
                >
                  <History size={12} className="inline mr-1" /> 过往存根
                </button>
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center text-black">
                <MapPin size={12} className="mr-2" /> 举办地区
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableRegionGroups.map(region => (
                  <button 
                    key={region}
                    onClick={() => toggleSelection(region, selectedRegions, setSelectedRegions)}
                    className={`px-3 py-1.5 text-[10px] font-bold transition-all border ${
                      selectedRegions.includes(region)
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-slate-300 text-slate-600'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center text-black">
                <Tag size={12} className="mr-2" /> 题材与类别
              </h4>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {availableGenres.types.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      className={`px-2 py-1 text-[9px] font-bold border ${
                        selectedGenres.includes(genre)
                        ? 'bg-red-600 text-white border-black'
                        : 'bg-white border-slate-300'
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
                        ? 'bg-black text-white border-black'
                        : 'bg-white border-slate-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
             <p className="text-[10px] font-bold italic text-slate-500 font-serif">
               * 筛选结果将由文文新闻办公室实时核准。
             </p>
             <button 
              onClick={onClearAll}
              className="text-[10px] font-black uppercase tracking-widest border-b-2 pb-0.5 transition-colors text-black border-black hover:text-red-600 hover:border-red-600"
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
