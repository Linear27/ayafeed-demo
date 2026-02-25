
import React from 'react';
import { ChevronLeft, ExternalLink, Calendar, MapPin, Users } from 'lucide-react';
import { PublicEventDetail, Theme } from '../../types';

import { AdaptedEventDetail } from '../../services/adapters';

interface EventDetailHeaderProps {
  event: AdaptedEventDetail;
  circleCount: number;
  onBack: () => void;
  onSelectCirclesTab: () => void;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({ event, circleCount, onBack, onSelectCirclesTab }) => {
  const isLandscape = event.posterOrientation === 'landscape';

  return (
    <div className="bg-white border-b-2 border-black relative z-10 pb-2">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-slate-900 hover:text-red-600 text-xs sm:text-sm font-black font-mono uppercase tracking-tighter">
            <ChevronLeft size={18} className="mr-1" /> 返回索引
          </button>
          <div className="text-xs sm:text-xs font-mono text-slate-400">报告编号: {event.slug.toUpperCase()}</div>
        </div>

        <div className="px-4 pb-6 sm:pb-8 pt-2">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Poster Section */}
            {event.poster && (
              <div className={`w-full ${isLandscape ? 'md:w-96' : 'md:w-80'} shrink-0 relative flex justify-center`}>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${isLandscape ? 'w-48' : 'w-40'} h-8 bg-black/10 rotate-2 z-0`}></div>
                <div className={`${isLandscape ? 'aspect-video' : 'aspect-[3/4]'} w-full max-w-[320px] sm:max-w-none border-2 border-black bg-white p-2 shadow-lg relative z-10 transform -rotate-1 transition-transform hover:rotate-0 duration-500`}>
                  <div className="w-full h-full bg-slate-200 overflow-hidden relative">
                    <img src={event.poster || null} className="w-full h-full object-cover" alt="Event Poster" />
                  </div>
                </div>
              </div>
            )}

            {/* Meta Section */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-red-600 text-white px-2 py-0.5 text-xs font-black uppercase tracking-wider">专题报导</span>
                {event.genres?.slice(0, 2).map((g: string) => (
                  <span key={g} className="px-2 py-0.5 text-xs font-black border border-black uppercase tracking-tighter bg-white">{g}</span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] mb-6 font-header border-b-4 border-double border-slate-300 pb-4">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 font-header">
                <div className="flex items-start gap-4 p-4 border-2 border-black bg-white newspaper-shadow-sm">
                  <div className="p-2 shrink-0 bg-red-600 text-white">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">举办日期</div>
                    <div className="text-xl sm:text-2xl font-black leading-none">{event.date}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 border-2 border-black bg-white newspaper-shadow-sm">
                  <div className="p-2 shrink-0 bg-black text-white">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">举办城市</div>
                    <div className="text-lg sm:text-xl font-black leading-tight flex flex-wrap items-center">
                      {event.location && (
                        <div className="mr-3 px-2 py-1 flex items-center bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span className="text-base font-black tracking-[0.15em]">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate prose-lg max-w-none text-slate-800 font-serif leading-relaxed mb-8 border-l-4 border-red-600 pl-6 bg-white/50 py-2">
                {event.description}
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-4">
                {event.website && (
                  <a href={event.website} target="_blank" rel="noreferrer"
                    className="px-8 py-4 bg-slate-900 text-white font-black text-sm border-2 border-transparent text-center hover:bg-white hover:text-black hover:border-black transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex items-center justify-center active:translate-y-1 active:shadow-none uppercase tracking-widest"
                  >
                    <ExternalLink size={18} className="mr-2" /> 官方网站
                  </a>
                )}
                <button onClick={onSelectCirclesTab}
                  className="px-8 py-4 bg-white text-black font-black text-sm border-2 border-black text-center hover:bg-slate-100 transition-all flex items-center justify-center active:translate-y-1 uppercase tracking-widest"
                >
                  <Users size={18} className="mr-2" /> 检索社团 ({circleCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailHeader;
