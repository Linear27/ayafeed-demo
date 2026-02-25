
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { PublicEventDetail, Theme } from '../../types';

import { AdaptedEventDetail } from '../../services/adapters';

interface EventAccessSectionProps {
  event: AdaptedEventDetail;
  setActiveFloorMapIndex: (i: number) => void;
  setShowFloorMapModal: (show: boolean) => void;
}

const EventAccessSection: React.FC<EventAccessSectionProps> = ({ event, setActiveFloorMapIndex, setShowFloorMapModal }) => {
  const floorMaps = event.floorMapImages || [];

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 sm:p-8 border-2 border-black newspaper-shadow-sm">
        <h3 className="font-black text-xl sm:text-2xl mb-6 font-header border-b-2 border-black pb-2 uppercase tracking-widest">交通指引</h3>
        <div className="prose prose-slate max-w-none text-slate-700 font-serif leading-relaxed">
          {event.transportation ? (
            <div className="whitespace-pre-wrap">{event.transportation}</div>
          ) : (
            <div className="text-slate-400 italic">暂无详细交通指引信息。</div>
          )}
        </div>
      </section>

      {floorMaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {floorMaps.map((map: string, i: number) => (
            <div 
              key={i} 
              onClick={() => { setActiveFloorMapIndex(i); setShowFloorMapModal(true); }} 
              className="aspect-video bg-black cursor-pointer relative group border-2 border-black active:scale-95 transition-transform newspaper-shadow-sm hover:newspaper-shadow"
            >
              <img src={map || null} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={`Floor Map ${i + 1}`} />
              <div className="absolute bottom-0 left-0 bg-white px-3 py-1.5 text-xs font-black border-t-2 border-r-2 border-black uppercase tracking-wider">平面图 {i + 1}</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full text-white">
                <Search size={24}/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
          <div className="text-slate-400 mb-4 flex justify-center"><MapPin size={48} /></div>
          <h3 className="text-xl font-black text-slate-900 mb-2">暂无场馆图</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">该展会尚未发布官方场馆平面图，请关注后续更新或访问官网。</p>
        </div>
      )}
    </div>
  );
};

export default EventAccessSection;
