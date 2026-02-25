
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { PublicEventDetail, Theme } from '../../types';

interface EventAccessSectionProps {
  event: PublicEventDetail;
  setActiveFloorMapIndex: (i: number) => void;
  setShowFloorMapModal: (show: boolean) => void;
}

const EventAccessSection: React.FC<EventAccessSectionProps> = ({ event, setActiveFloorMapIndex, setShowFloorMapModal }) => {
  const floorMaps = event.floorMapImages || [];

  return (
    <div className="space-y-8">
      {floorMaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {floorMaps.map((map, i) => (
            <div 
              key={i} 
              onClick={() => { setActiveFloorMapIndex(i); setShowFloorMapModal(true); }} 
              className="aspect-video bg-black cursor-pointer relative group border-2 border-black active:scale-95 transition-transform newspaper-shadow-sm hover:newspaper-shadow"
            >
              <img src={map.url || null} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={map.name} />
              <div className="absolute bottom-0 left-0 bg-white px-3 py-1.5 text-xs font-black border-t-2 border-r-2 border-black uppercase tracking-wider">{map.name}</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full text-white">
                <Search size={24}/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
          <div className="text-slate-400 mb-4 flex justify-center"><MapPin size={48} /></div>
          <h3 className="text-xl font-black text-slate-900 mb-2">暂无路线或场馆图</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">该展会尚未发布官方场馆平面图或交通指引，请关注后续更新或访问官网。</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(event.title + ' 交通')}`, '_blank')}
              className="px-6 py-2 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
            >
              搜索相关信息
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAccessSection;
