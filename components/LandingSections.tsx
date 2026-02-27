
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, ArrowRight, Zap, Music, 
  Library, Radio, Clock, User, Globe
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
  const navigate = useNavigate();
  const featuredEvent = events[0];
  const subEvents = events.slice(1, 4);

  if (!featuredEvent) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-4 pb-6 relative font-serif">
        <div className="flex items-center gap-4 mb-4 select-none">
          <div className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest skew-x-[-12deg] border border-white shrink-0 shadow-sm">
            <span className="skew-x-[12deg] inline-block">今日头条</span>
          </div>
          <div className="h-px flex-1 bg-red-600/20"></div>
        </div>

        <div className="min-h-[400px]">
          <div className="w-full h-[400px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white/70 flex items-center">
            <div className="p-8 sm:p-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-widest">
                NO UPCOMING
              </div>
              <h3 className="mt-4 text-3xl sm:text-4xl font-black font-header text-slate-900 leading-tight">
                近期暂无未来排期
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-serif italic max-w-[65ch]">
                当前数据集中没有可展示的未来展会。你仍可浏览展会存档与历史记录。
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 transition-colors"
                >
                  打开展会名录 <ArrowRight size={18} />
                </Link>
                <Link
                  to="/lives"
                  className="inline-flex items-center justify-center px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
                >
                  查看演出快讯
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const InfoCell = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string | number, className?: string }) => (
    <div className={`flex flex-col justify-center p-2 sm:p-3 min-h-[60px] ${className}`}>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1 text-slate-500">
            <Icon size={10} strokeWidth={2.5} /> {label}
        </div>
        <div className="font-bold leading-tight line-clamp-1 text-sm font-header text-slate-900">
            {value}
        </div>
    </div>
  );

  const displayDate = featuredEvent.startAt.split('T')[0];
  const displayRegion = featuredEvent.marketRegion === 'JAPAN' ? 'JP' : (featuredEvent.marketRegion === 'CN_MAINLAND' ? 'CN' : 'OVERSEA');

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4 pb-6 relative font-serif">
      <div className="flex items-center gap-4 mb-4 select-none">
        <div className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest skew-x-[-12deg] border border-white shrink-0 shadow-sm">
          <span className="skew-x-[12deg] inline-block">今日头条</span>
        </div>
        <div className="h-px flex-1 bg-red-600/20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Featured Event */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative w-full h-[280px] sm:h-[360px] group cursor-pointer" onClick={() => navigate({ to: '/events/$eventId', params: { eventId: featuredEvent.id } })}>
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#E5E5E5] p-2">
                <img 
                    src={featuredEvent.poster?.urls.original || null} 
                    className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                    alt={featuredEvent.title} 
                />
                <div className="absolute -bottom-4 -left-4 z-20">
                    <div className="stamp text-lg bg-white/90 backdrop-blur-sm shadow-sm">
                        {displayRegion}
                    </div>
                </div>
              </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
              <div className="flex items-center gap-1"><User size={12}/> ORG: {featuredEvent.id}</div>
              <div className="text-right flex items-center gap-1"><Globe size={12}/> {displayRegion} 分社</div>
          </div>
          
          <div className="mt-4 flex flex-col">
            <h1 
                className="text-2xl sm:text-3xl lg:text-4xl font-black leading-[1.1] mb-4 cursor-pointer hover:text-red-600 transition-colors font-header line-clamp-2"
                onClick={() => navigate({ to: '/events/$eventId', params: { eventId: featuredEvent.id } })}
            >
                {featuredEvent.title}
            </h1>

            <div className="grid grid-cols-2 gap-px border-2 mb-4 bg-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <InfoCell icon={Calendar} label="时间" value={displayDate} className="bg-white" />
              <InfoCell icon={MapPin} label="地点" value={featuredEvent.location?.name || '未知'} className="bg-white" />
            </div>

            <p className="text-sm leading-relaxed line-clamp-2 mb-4 text-slate-800 font-serif italic border-l-4 border-red-600/20 pl-3">
                {featuredEvent.summary}
            </p>
          </div>
        </div>

        {/* Sub Featured Events */}
        {subEvents.length > 0 && (
          <div className="lg:col-span-4 flex flex-col gap-4 lg:border-l-2 border-black lg:pl-6">
            <div className="hidden lg:block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
              更多头条
            </div>
            {subEvents.map((subEvent) => {
              const subDate = subEvent.startAt.split('T')[0];
              const subRegion = subEvent.marketRegion === 'JAPAN' ? 'JP' : (subEvent.marketRegion === 'CN_MAINLAND' ? 'CN' : 'OVERSEA');
              return (
                <div 
                  key={subEvent.id} 
                  className="group cursor-pointer flex gap-3 pb-4 border-b-2 border-dashed border-slate-300 last:border-0 last:pb-0"
                  onClick={() => navigate({ to: '/events/$eventId', params: { eventId: subEvent.id } })}
                >
                  <div className="w-20 h-24 shrink-0 border-2 border-black bg-slate-100 flex items-center justify-center p-1 relative shadow-sm group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <img src={subEvent.poster?.urls.original || null} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={subEvent.title} />
                    <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-black px-1 py-0.5 uppercase">
                      {subRegion}
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-1 font-mono font-black text-[10px] text-slate-500 mb-1">
                      <Clock size={10} /> {subDate}
                    </div>
                    <h3 className="font-black leading-tight text-sm font-header text-slate-900 group-hover:text-red-700 line-clamp-2 mb-1">
                      {subEvent.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono uppercase truncate">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate">{subEvent.location?.name || '未知'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
             <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-1.5 py-0.5 uppercase tracking-tighter">
                {displayRegion}
             </div>
             {isToday && (
              <div className="absolute bottom-0 left-0 bg-red-600 text-white text-xs font-black px-1.5 py-0.5 flex items-center gap-1">
                <Radio size={10} className="animate-pulse"/> 正在举办
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs sm:text-[12px] font-black uppercase tracking-widest ${isToday ? 'text-red-600' : 'text-slate-500'}`}>
            {event.marketRegion === 'JAPAN' ? '日本特报' : (event.marketRegion === 'CN_MAINLAND' ? '大陆频道' : '亚洲分社')}
          </span>
          <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-[12px] text-slate-500">
            <Clock size={10} /> {displayDate}
          </div>
        </div>
        <h3 className="font-black leading-tight mb-2 text-lg font-header transition-colors line-clamp-2 text-slate-900 group-hover:text-red-700">
          {event.title}
        </h3>
        <p className="text-sm mb-3 line-clamp-2 leading-relaxed text-slate-700 font-serif">
          {event.summary}
        </p>
        <div className="mt-auto flex items-center gap-1.5 text-xs font-bold text-slate-400 font-mono uppercase">
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
}> = ({ events, todayStr }) => {
  const hasEvents = events.length > 0;

  return (
    <div className="lg:col-span-8 flex flex-col">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-black pb-2">
        <Library className="shrink-0 text-red-600" size={28} />
        <h2 className="text-3xl font-black font-header text-slate-900">速报存档</h2>
      </div>

      {hasEvents ? (
        <>
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
        </>
      ) : (
        <div className="border-2 border-dashed border-slate-300 bg-white/60 p-8 sm:p-10 text-center">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            NO UPCOMING
          </div>
          <h3 className="mt-3 text-xl sm:text-2xl font-black font-header text-slate-900">
            暂无可展示的速报条目
          </h3>
          <p className="mt-2 text-sm text-slate-600 font-serif italic max-w-[60ch] mx-auto">
            当前频道没有未来排期的展会条目。你仍可打开完整名录查看存档与历史记录。
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 transition-colors"
            >
              打开展会名录 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const LiveSidebar: React.FC<{ 
  lives: PublicLiveListItem[]; 
}> = ({ lives }) => {
  const hasLives = lives.length > 0;

  const getLiveStatus = (startAt: string) => {
    const today = new Date().toISOString().split('T')[0];
    const startDate = startAt.split('T')[0];
    if (startDate < today) return { label: '已结束', color: 'bg-slate-500' };
    if (startDate === today) return { label: '进行中', color: 'bg-red-600' };
    return { label: '即将开始', color: 'bg-indigo-600' };
  };

  return (
    <div className="lg:col-span-4 pl-0 lg:pl-10 flex flex-col lg:border-l border-slate-300 border-dashed">
      <div className="mb-6 bg-black text-white p-3 transform -rotate-1">
        <h2 className="text-xl font-black font-header flex items-center uppercase tracking-widest">
          <Zap className="mr-2 text-yellow-400 fill-current" /> 舞台排程
        </h2>
      </div>

      {hasLives ? (
        <>
          <div className="space-y-4">
            {lives.map((live) => {
              const status = getLiveStatus(live.startAt);
              const dateObj = new Date(live.startAt);
              const month = dateObj.getMonth() + 1;
              const day = dateObj.getDate();
              
              return (
                <Link key={live.id} to="/lives/$liveId" params={{ liveId: live.id }} className="group cursor-pointer flex gap-3 pb-4 border-b border-dashed border-slate-300 last:border-0 last:pb-0">
                  <div className="w-14 h-16 shrink-0 border-2 border-black bg-white flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-0.5 transition-all">
                    <span className="text-[10px] font-black uppercase text-slate-500 border-b-2 border-slate-200 w-full text-center pb-0.5 mb-0.5">{month}月</span>
                    <span className="text-xl font-black font-header leading-none">{day}</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 text-white ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {live.location?.countryCode || 'JP'}
                      </span>
                    </div>
                    <h3 className="font-black leading-tight text-sm font-header text-slate-900 group-hover:text-red-700 line-clamp-2 mb-1">
                      {live.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-1 text-[10px] font-bold text-slate-500 font-mono uppercase truncate">
                      <MapPin size={10} className="shrink-0" />
                      <span className="truncate">{live.location?.name || '未知场馆'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <Link 
              to="/lives" 
              className="w-full py-3 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 hover:text-white"
            >
              查看所有演出
            </Link>
          </div>
        </>
      ) : (
        <div className="border-2 border-dashed border-slate-300 bg-white/60 p-8 text-center">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            NO UPCOMING
          </div>
          <h3 className="mt-3 text-lg sm:text-xl font-black font-header text-slate-900">
            暂无舞台排程
          </h3>
          <p className="mt-2 text-sm text-slate-600 font-serif italic max-w-[60ch] mx-auto">
            当前频道没有可展示的未来演出。你可以查看演出列表，或切换版面频道。
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/lives"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black text-xs sm:text-sm uppercase tracking-[0.22em] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
            >
              查看演出快讯 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
