
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, History, MapPin, Music, Mic2, X } from 'lucide-react';
import { Theme } from '../types';

interface LiveFiltersProps {
  theme: Theme;
  isOpen: boolean;
  timeFilter: 'UPCOMING' | 'PAST';
  setTimeFilter: (val: 'UPCOMING' | 'PAST') => void;
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  availableRegions: string[];
  onClearAll: () => void;
}

const LiveFilters: React.FC<LiveFiltersProps> = ({
  theme, isOpen, timeFilter, setTimeFilter,
  selectedRegions, setSelectedRegions,
  selectedTypes, setSelectedTypes,
  availableRegions, onClearAll
}) => {
  const isNewspaper = theme === 'newspaper';

  const toggleSelection = (item: string, currentList: string[], setList: (l: string[]) => void) => {
    if (currentList.includes(item)) setList(currentList.filter(i => i !== item));
    else setList([...currentList, item]);
  };

  const PERFORMANCE_TYPES = [
    { id: 'Live', label: '乐队/演唱会', icon: Mic2 },
    { id: 'DJ', label: 'DJ Set/俱乐部', icon: Music },
    { id: 'Festival', label: '音乐祭/拼盘', icon: Music }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`overflow-hidden mt-4 ${
            isNewspaper 
              ? 'bg-[#F3F1E6] border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
              : 'bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-inner'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Time Filter */}
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center ${isNewspaper ? 'text-black' : 'text-slate-400'}`}>
                <Calendar size={12} className="mr-2" /> 演期档案
              </h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setTimeFilter('UPCOMING')}
                  className={`px-4 py-2 text-xs font-bold transition-all border ${
                    timeFilter === 'UPCOMING' 
                    ? (isNewspaper ? 'bg-red-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-indigo-600 text-white border-indigo-600 shadow-md')
                    : (isNewspaper ? 'bg-white border-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100')
                  }`}
                >
                  即将演出
                </button>
                <button 
                  onClick={() => setTimeFilter('PAST')}
                  className={`px-4 py-2 text-xs font-bold transition-all border ${
                    timeFilter === 'PAST' 
                    ? (isNewspaper ? 'bg-slate-900 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-indigo-600 text-white border-indigo-600 shadow-md')
                    : (isNewspaper ? 'bg-white border-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100')
                  }`}
                >
                  <History size={12} className="inline mr-1" /> 历史存根
                </button>
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center ${isNewspaper ? 'text-black' : 'text-slate-400'}`}>
                <MapPin size={12} className="mr-2" /> 演出地区
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableRegions.map(region => (
                  <button 
                    key={region}
                    onClick={() => toggleSelection(region, selectedRegions, setSelectedRegions)}
                    className={`px-3 py-1.5 text-[10px] font-bold transition-all border ${
                      selectedRegions.includes(region)
                      ? (isNewspaper ? 'bg-black text-white border-black' : 'bg-indigo-100 text-indigo-700 border-indigo-200')
                      : (isNewspaper ? 'bg-white border-slate-300 text-slate-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100')
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Type Filter */}
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 flex items-center ${isNewspaper ? 'text-black' : 'text-slate-400'}`}>
                <Music size={12} className="mr-2" /> 演出形式
              </h4>
              <div className="flex flex-wrap gap-2">
                {PERFORMANCE_TYPES.map(type => (
                  <button 
                    key={type.id}
                    onClick={() => toggleSelection(type.id, selectedTypes, setSelectedTypes)}
                    className={`px-3 py-1.5 text-[10px] font-bold transition-all border flex items-center gap-1.5 ${
                      selectedTypes.includes(type.id)
                      ? (isNewspaper ? 'bg-red-600 text-white border-black' : 'bg-indigo-600 text-white border-indigo-600 shadow-sm')
                      : (isNewspaper ? 'bg-white border-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100')
                    }`}
                  >
                    <type.icon size={12} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
             <p className={`text-[10px] font-bold italic ${isNewspaper ? 'text-slate-500 font-serif' : 'text-slate-400'}`}>
               {isNewspaper ? '* 演出信息更新频率受现场快讯限制。' : '* 自动匹配多重检索条件。'}
             </p>
             <button 
              onClick={onClearAll}
              className={`text-[10px] font-black uppercase tracking-widest border-b-2 pb-0.5 transition-colors ${
                isNewspaper ? 'text-black border-black hover:text-red-600 hover:border-red-600' : 'text-slate-400 border-transparent hover:text-indigo-600 hover:border-indigo-600'
              }`}
             >
               清除过滤器
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveFilters;
