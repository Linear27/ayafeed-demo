
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, ArrowRight, Zap, Music, 
  Sparkles, ChevronRight, ChevronLeft, Library, 
  Radio, Clock, Camera, Bookmark, 
  Layers, User, Globe
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { PublicEventListItem, PublicLiveListItem, ViewState } from '../types';

/**
 * 1. 焦点轮播组件 - 强化沉浸感
 */
export const HeroCarousel: React.FC<{ 
  events: PublicEventListItem[]; 
  onSelect: (id: string) => void;
  onNavigate: (v: ViewState) => void;
  userRegion?: string;
}> = ({ events, onSelect, onNavigate, userRegion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredEvent = events[currentIndex];
  const navigate = useNavigate();

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [events.length]);

  if (!featuredEvent) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % events.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);

  const InfoCell = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string | number, className?: string }) => (
    <div className={`flex flex-col justify-center p-3 sm:p-4 min-h-[80px] ${className}`}>
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-1 text-slate-500">
            <Icon size={12} strokeWidth={2.5} /> {label}
        </div>
        <div className="font-bold leading-tight line-clamp-2 text-base font-header text-slate-900">
            {value}
        </div>
    </div>
  );

  const displayDate = featuredEvent.startAt.split('T')[0];
  const displayRegion = featuredEvent.marketRegion === 'JAPAN' ? 'JP' : (featuredEvent.marketRegion === 'CN_MAINLAND' ? 'CN' : 'OVERSEA');

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-6 relative font-serif">
      <div className="flex items-center gap-4 mb-6 select-none">
        <div className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest skew-x-[-12deg] border border-white shrink-0 shadow-sm">
          <span className="skew-x-[12deg] inline-block">今日头条</span>
        </div>
        <div className="h-px flex-1 bg-red-600/20"></div>
        <div className="flex items-center gap-4">
          {events.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-500 ease-in-out ${
                currentIndex === idx 
                  ? 'w-14 h-[3px] bg-red-600' 
                  : 'w-2 h-2 rounded-full bg-red-600/30 hover:bg-red-600/60'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-1 ml-6 shrink-0">
          <button onClick={prev} className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"><ChevronLeft size={14} /></button>
          <button onClick={next} className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>

      <div className="min-h-[450px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative w-full h-[320px] sm:h-[400px] group cursor-pointer" onClick={() => navigate({ to: '/events/$eventId', params: { eventId: featuredEvent.id } })}>
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#E5E5E5] p-2">
                    <img 
                        src={featuredEvent.poster?.urls.original || null} 
                        className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        alt={featuredEvent.title} 
                    />
                    <div className="absolute -bottom-4 -left-4 z-20">
                        <div className="stamp text-xl bg-white/90 backdrop-blur-sm shadow-sm">
                            {displayRegion}
                        </div>
                    </div>
                  </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-1"><User size={12}/> ORG: {featuredEvent.id}</div>
                  <div className="text-right flex items-center gap-1"><Globe size={12}/> {displayRegion} 分社</div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">
                    {featuredEvent.marketRegion === 'OVERSEAS' ? '全球热点' : `${displayRegion} 频道`}
                </span>
              </div>

              <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1] mb-6 cursor-pointer hover:text-red-600 transition-colors font-header"
                  onClick={() => navigate({ to: '/events/$eventId', params: { eventId: featuredEvent.id } })}
              >
                  {featuredEvent.title}
              </h1>

              <div className="grid grid-cols-2 gap-px border-2 mb-6 bg-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <InfoCell icon={Calendar} label="时间" value={displayDate} className="bg-white" />
                <InfoCell icon={MapPin} label="地点" value={featuredEvent.location?.name || '未知'} className="bg-white" />
              </div>

              <p className="text-base leading-relaxed line-clamp-4 mb-8 text-slate-800 font-serif italic border-l-4 border-red-600/20 pl-4">
                  {featuredEvent.summary}
              </p>

              <div className="mt-auto flex items-center gap-4">
                <button 
                    onClick={() => navigate({ to: '/events/$eventId', params: { eventId: featuredEvent.id } })}
                    className="flex-1 py-4 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group bg-red-600 text-white border-2 border-black hover:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                >
                    查看详情 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

/**
 * 2. 最新快讯项组件 - 增强对比度
 */
const ScoopItem: React.FC<{ event: PublicEventListItem; isToday: boolean }> = ({ event, isToday }) => {
  const navigate = useNavigate();
  const displayDate = event.startAt.split('T')[0];
  const displayRegion = event.marketRegion === 'JAPAN' ? 'JP' : (event.marketRegion === 'CN_MAINLAND' ? 'CN' : 'OVERSEA');

  return (
  <div className="group cursor-pointer" onClick={() => navigate({ to: '/events/$eventId', params: { eventId: event.id } })}>
    <div className="flex gap-4 items-start relative min-h-[160px]">
      <div className="w-32 sm:w-40 shrink-0">
        <div className={`border-2 p-1 bg-white shadow-sm transition-all group-hover:shadow-md h-[140px] ${isToday ? 'border-red-600' : 'border-black'}`}>
          <div className="overflow-hidden relative h-full flex items-center justify-center bg-slate-100">
             <img src={event.poster?.urls.original || null} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={event.title} />
             <div className="absolute top-0 right-0 bg-black text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                {displayRegion}
             </div>
             {isToday && (
              <div className="absolute bottom-0 left-0 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 flex items-center gap-1">
                <Radio size={10} className="animate-pulse"/> 正在举办
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-red-600' : 'text-slate-500'}`}>
            {event.marketRegion === 'JAPAN' ? '日本特报' : (event.marketRegion === 'CN_MAINLAND' ? '大陆频道' : '亚洲分社')}
          </span>
          <div className="flex items-center gap-1 font-mono font-black text-[10px] text-slate-500">
            <Clock size={10} /> {displayDate}
          </div>
        </div>
        <h3 className="font-black leading-tight mb-2 text-lg font-header transition-colors line-clamp-2 text-slate-900 group-hover:text-red-700">
          {event.title}
        </h3>
        <p className="text-sm mb-3 line-clamp-2 leading-relaxed text-slate-700 font-serif">
          {event.summary}
        </p>
        <div className="mt-auto flex items-center gap-1.5 text-[10px] font-bold text-slate-400 font-mono uppercase">
          <MapPin size={10} className="shrink-0" />
          <span className="truncate">{event.location?.name}</span>
        </div>
      </div>
    </div>
    <div className="mt-6 border-t border-dashed border-slate-300"></div>
  </div>
  );
};

export const ScoopSection: React.FC<{ 
  events: PublicEventListItem[]; 
  todayStr: string;
}> = ({ events, todayStr }) => (
  <div className="lg:col-span-8 flex flex-col">
    <div className="flex items-center gap-3 mb-8 border-b-2 border-black pb-2">
      <Library className="shrink-0 text-red-600" size={28} />
      <h2 className="text-3xl font-black font-header text-slate-900">速报存档</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
      {events.map((event, idx) => (
        <ScoopItem key={`${event.id}-${idx}`} event={event} isToday={event.startAt.split('T')[0] === todayStr} />
      ))}
    </div>
    <div className="mt-12">
      <Link 
        to="/events"
        className="w-full py-4 font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:bg-black hover:text-white"
      >
        浏览完整名录 <ArrowRight size={18} />
      </Link>
    </div>
  </div>
);

export const LiveSidebar: React.FC<{ 
  lives: PublicLiveListItem[]; 
}> = ({ lives }) => (
  <div className="lg:col-span-4 pl-0 lg:pl-10 flex flex-col lg:border-l border-slate-300 border-dashed">
    <div className="mb-8 bg-black text-white p-3 transform -rotate-1">
      <h2 className="text-xl font-black font-header flex items-center uppercase tracking-widest">
        <Zap className="mr-2 text-yellow-400 fill-current" /> 舞台排程
      </h2>
    </div>
    <div className="space-y-8">
      {lives.map((live) => (
        <Link key={live.id} to="/lives" className="relative group cursor-pointer block overflow-hidden">
          <div className="aspect-[16/9] overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img src={live.poster?.urls.original || null} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={live.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter shadow-sm">
                {live.location?.countryCode || 'JP'}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-yellow-500 text-[10px] font-black mb-1 flex items-center uppercase tracking-widest"><Music size={12} className="mr-2"/> {live.startAt.split('T')[0]}</div>
              <div className="text-white font-black font-header leading-tight truncate">{live.title}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
    <div className="mt-12">
      <Link 
        to="/lives" 
        className="w-full py-4 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 hover:text-white"
      >
        查看所有演出
      </Link>
    </div>
  </div>
);
