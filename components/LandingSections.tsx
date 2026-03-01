import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, ArrowRight, Zap, Music, 
  Sparkles, ChevronRight, ChevronLeft, Library, 
  ChevronDown, Radio, Clock, Camera, Bookmark, 
  Layers, User, Globe, Hash
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ViewState } from '../types';
import { TimelineItem } from '../views/LandingView';

/**
 * 1. 焦点轮播组件 - 强化沉浸感
 */
export const HeroCarousel: React.FC<{ 
  items: TimelineItem[]; 
  userRegion?: string;
}> = ({ items, userRegion }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const featuredItem = items[safeIndex];
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    setCurrentIndex((prev) => {
      if (items.length === 0) return 0;
      return Math.min(prev, items.length - 1);
    });
  }, [items.length]);

  if (!featuredItem) {
    return (
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-6 relative font-serif">
        <div className="flex items-center gap-4 mb-6 select-none">
          <div className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest -skew-x-12 border border-white shrink-0 shadow-sm">
            <span className="skew-x-12 inline-block">今日头条</span>
          </div>
          <div className="h-px flex-1 bg-red-600/20"></div>
        </div>

        <div className="min-h-112.5">
          <div className="w-full h-112.5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white/70 flex items-center">
            <div className="p-8 sm:p-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-widest">
                NO UPCOMING
              </div>
              <h3 className="mt-4 text-3xl sm:text-4xl font-black font-header text-slate-900 leading-tight">
                近期暂无未来排期
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-serif italic max-w-[65ch]">
                当前数据集中没有可展示的未来展会或演出。你仍可浏览存档与历史记录。
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

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  const InfoCell = ({ icon: Icon, label, value, className = "" }: { icon: any, label: string, value: string | number, className?: string }) => (
    <div className={`flex flex-col justify-center p-3 sm:p-4 min-h-20 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs sm:text-[12px] font-black uppercase tracking-wider mb-1 text-slate-500">
            <Icon size={12} strokeWidth={2.5} /> {label}
        </div>
        <div className="font-bold leading-tight line-clamp-2 text-base font-header text-slate-900">
            {value}
        </div>
    </div>
  );

  const displayDate = featuredItem.date;
  const displayRegion = featuredItem.marketRegion === 'JAPAN' ? 'JP' : (featuredItem.marketRegion === 'CN_MAINLAND' ? 'CN' : 'OVERSEA');
  const targetRoute = featuredItem.type === 'event' ? '/events/$eventId' : '/lives/$liveId';
  const targetParams = featuredItem.type === 'event' ? { eventId: featuredItem.id } : { liveId: featuredItem.id };

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-6 relative font-serif">
      <div className="flex items-center gap-4 mb-6 select-none">
        <div className="bg-red-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest -skew-x-12 border border-white shrink-0 shadow-sm">
          <span className="skew-x-12 inline-block">今日头条</span>
        </div>
        <div className="h-px flex-1 bg-red-600/20"></div>
        {items.length > 1 && (
          <>
            <div className="flex items-center gap-4">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`切换头条 ${idx + 1}`}
                  className={`transition-all duration-500 ease-in-out ${
                    safeIndex === idx 
                      ? 'w-14 h-0.75 bg-red-600' 
                      : 'w-2 h-2 rounded-full bg-red-600/30 hover:bg-red-600/60'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-1 ml-6 shrink-0">
              <button onClick={prev} aria-label="上一条头条" className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"><ChevronLeft size={14} /></button>
              <button onClick={next} aria-label="下一条头条" className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"><ChevronRight size={14} /></button>
            </div>
          </>
        )}
      </div>

      <div className="min-h-112.5">
        <AnimatePresence mode="wait">
          <motion.div 
            key={safeIndex}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="lg:col-span-7 flex flex-col">
              <div className="relative w-full h-80 sm:h-100 group cursor-pointer" onClick={() => navigate({ to: targetRoute as any, params: targetParams as any })}>
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#E5E5E5] p-2">
                    <img 
                        src={featuredItem.image || null} 
                        className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        alt={featuredItem.title} 
                    />
                    <div className="absolute -bottom-4 -left-4 z-20">
                        <div className="stamp text-xl bg-white/90 backdrop-blur-sm shadow-sm">
                            {displayRegion}
                        </div>
                    </div>
                    {featuredItem.isToday && (
                      <div className="absolute top-4 right-4 z-30 bg-red-600 text-white px-4 py-2 font-black text-lg uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3">
                        TODAY
                      </div>
                    )}
                  </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-xs font-bold font-mono uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-1"><User size={12}/> ID: {featuredItem.id.slice(0, 8)}</div>
                  <div className="text-right flex items-center gap-1"><Globe size={12}/> {displayRegion} 分社</div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs font-black uppercase tracking-wider bg-red-600 text-white">
                    {featuredItem.marketRegion === 'OVERSEAS' ? '全球热点' : `${displayRegion} 频道`}
                </span>
                <span className={`px-2 py-1 text-xs font-black uppercase tracking-wider border-2 border-black ${featuredItem.type === 'live' ? 'bg-yellow-400 text-black' : 'bg-white text-black'}`}>
                    {featuredItem.type === 'event' ? '展会 EVENT' : '演出 LIVE'}
                </span>
              </div>

              <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none mb-6 cursor-pointer hover:text-red-600 transition-colors font-header"
                  onClick={() => navigate({ to: targetRoute as any, params: targetParams as any })}
              >
                  {featuredItem.title}
              </h1>

              <div className="grid grid-cols-2 gap-px border-2 mb-6 bg-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <InfoCell icon={Calendar} label="时间" value={displayDate} className="bg-white" />
                <InfoCell icon={MapPin} label="地点" value={featuredItem.location || '未知'} className="bg-white" />
              </div>

              <p className="text-base leading-relaxed line-clamp-4 mb-8 text-slate-800 font-serif italic border-l-4 border-red-600/20 pl-4">
                  {featuredItem.summary || '暂无详细摘要信息。'}
              </p>

              <div className="mt-auto flex items-center gap-4">
                <button 
                    onClick={() => navigate({ to: targetRoute as any, params: targetParams as any })}
                    className="flex-1 py-4 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group bg-red-600 text-white border-2 border-black hover:bg-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
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
 * 2. 统一时间轴编年史
 */
export const UnifiedTimeline: React.FC<{ 
  items: TimelineItem[]; 
}> = ({ items }) => {
  const navigate = useNavigate();
  const hasItems = items.length > 0;

  const groupedItems = useMemo(() => {
    const groups: Record<string, TimelineItem[]> = {};
    items.forEach(item => {
      const dateObj = new Date(item.date);
      const yearMonth = `${dateObj.getFullYear()}年 ${dateObj.getMonth() + 1}月`;
      if (!groups[yearMonth]) {
        groups[yearMonth] = [];
      }
      groups[yearMonth].push(item);
    });
    return groups;
  }, [items]);

  return (
    <div className="lg:col-span-8 flex flex-col">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-black pb-2">
        <Library className="shrink-0 text-red-600" size={28} />
        <h2 className="text-3xl font-black font-header text-slate-900">幻想乡日程表</h2>
      </div>

      {hasItems ? (
        <div className="space-y-12">
          {Object.entries(groupedItems).map(([month, monthItems]: [string, TimelineItem[]]) => (
            <div key={month} id={`month-${month.replace(/\s/g, '')}`} className="relative">
              <div className="sticky top-16 z-40 bg-[#FDFBF7] py-2 mb-4 border-y-2 border-black flex items-center gap-2">
                <ChevronDown size={16} className="text-red-600" />
                <h3 className="text-xl font-black font-header">{month}</h3>
              </div>
              
              <div className="flex flex-col gap-0 border-l-2 border-black ml-3 pl-6 relative">
                {monthItems.map((item, idx) => {
                  const isLive = item.type === 'live';
                  const targetRoute = isLive ? '/lives/$liveId' : '/events/$eventId';
                  const targetParams = isLive ? { liveId: item.id } : { eventId: item.id };
                  
                  return (
                    <div 
                      key={`${item.id}-${idx}`} 
                      className={`relative py-4 border-b border-dashed border-slate-300 last:border-0 group cursor-pointer transition-colors hover:bg-slate-100/50 -ml-6 pl-6 pr-4 ${isLive ? 'bg-yellow-50/30' : ''}`}
                      onClick={() => navigate({ to: targetRoute as any, params: targetParams as any })}
                    >
                      {/* Timeline Node */}
                      <div className={`absolute -left-1.25 top-6 w-2 h-2 rounded-full border-2 border-black ${isLive ? 'bg-yellow-400' : 'bg-white group-hover:bg-red-600'}`} />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                          <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border border-black ${isLive ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}>
                            {isLive ? '演出' : '展会'}
                          </span>
                          <span className="font-mono font-bold text-sm text-slate-700 w-16">
                            {item.date.substring(5).replace('-', '.')}
                          </span>
                          <span className="text-xs font-bold text-slate-500 w-16 truncate">
                            {item.location?.split(' ')[0] || '未知'}
                          </span>
                        </div>
                        
                        <h4 className={`text-base sm:text-lg font-bold font-header line-clamp-1 flex-1 ${isLive ? 'text-red-700' : 'text-slate-900 group-hover:text-red-600'}`}>
                          {item.title}
                        </h4>
                        
                        {item.isToday && (
                          <span className="shrink-0 flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 border border-red-200">
                            <Radio size={10} className="animate-pulse" /> 正在举办
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="mt-12 pt-8 border-t-2 border-black">
            <Link 
              to="/events"
              className="w-full py-4 font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:bg-black hover:text-white"
            >
              浏览完整名录 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 bg-white/60 p-8 sm:p-10 text-center">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
            NO UPCOMING
          </div>
          <h3 className="mt-3 text-xl sm:text-2xl font-black font-header text-slate-900">
            暂无可展示的日程条目
          </h3>
          <p className="mt-2 text-sm text-slate-600 font-serif italic max-w-[60ch] mx-auto">
            当前频道没有未来排期的活动条目。你仍可打开完整名录查看存档与历史记录。
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * 3. 检索与索引侧栏
 */
export const IndexSidebar: React.FC<{ 
  items: TimelineItem[]; 
}> = ({ items }) => {
  const months = useMemo(() => {
    const uniqueMonths = new Set<string>();
    items.forEach(item => {
      const dateObj = new Date(item.date);
      uniqueMonths.add(`${dateObj.getFullYear()}年 ${dateObj.getMonth() + 1}月`);
    });
    return Array.from(uniqueMonths);
  }, [items]);

  const regionCounts = useMemo(() => {
    const counts = { JAPAN: 0, CN_MAINLAND: 0, OVERSEAS: 0 };
    items.forEach(item => {
      if (item.marketRegion === 'JAPAN') counts.JAPAN++;
      else if (item.marketRegion === 'CN_MAINLAND') counts.CN_MAINLAND++;
      else if (item.marketRegion === 'OVERSEAS') counts.OVERSEAS++;
    });
    return counts;
  }, [items]);

  const scrollToMonth = (month: string) => {
    const el = document.getElementById(`month-${month.replace(/\s/g, '')}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:col-span-4 pl-0 lg:pl-10 flex flex-col lg:border-l border-slate-300 border-dashed">
      <div className="mb-8 bg-black text-white p-3 transform -rotate-1">
        <h2 className="text-xl font-black font-header flex items-center uppercase tracking-widest">
          <Bookmark className="mr-2 text-white fill-current" /> 检索与索引
        </h2>
      </div>

      <div className="space-y-8">
        {/* Quick Jump */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-300 pb-1">
            快速跳转 (Quick Jump)
          </h3>
          <div className="flex flex-wrap gap-2">
            {months.map(month => (
              <button
                key={month}
                onClick={() => scrollToMonth(month)}
                className="px-3 py-1.5 text-xs font-bold border border-black hover:bg-black hover:text-white transition-colors"
              >
                {month}
              </button>
            ))}
            {months.length === 0 && <span className="text-sm text-slate-400 italic">无可用月份</span>}
          </div>
        </div>

        {/* Region Distribution */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-300 pb-1">
            地区分布 (Region)
          </h3>
          <ul className="space-y-2 text-sm font-bold font-mono">
            <li className="flex justify-between items-center">
              <span>日本 (JAPAN)</span>
              <span className="bg-slate-100 px-2 py-0.5 border border-slate-300">{regionCounts.JAPAN}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>大陆 (CN_MAINLAND)</span>
              <span className="bg-slate-100 px-2 py-0.5 border border-slate-300">{regionCounts.CN_MAINLAND}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>海外 (OVERSEAS)</span>
              <span className="bg-slate-100 px-2 py-0.5 border border-slate-300">{regionCounts.OVERSEAS}</span>
            </li>
          </ul>
        </div>

        {/* Popular Tags */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-300 pb-1">
            热门标签 (Tags)
          </h3>
          <div className="flex flex-wrap gap-2">
            {['#东方Project', '#Only', '#同人志即卖会', '#Live', '#交响乐'].map(tag => (
              <span key={tag} className="text-xs font-bold text-red-700 hover:underline cursor-pointer flex items-center">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Ad Space / Notice */}
        <div className="mt-8 border-4 border-black p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
          <div className="absolute top-0 right-0 bg-black text-white text-[10px] px-1 uppercase font-bold">AD</div>
          <h4 className="font-black font-header text-lg mb-2">社团入驻开放中</h4>
          <p className="text-xs font-serif italic mb-4">想要在幻想乡日程表上展示您的社团信息吗？现在就申请入驻，获取专属展示页面。</p>
          <Link to="/circles" className="block text-center w-full py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">
            了解详情
          </Link>
        </div>
      </div>
    </div>
  );
};
