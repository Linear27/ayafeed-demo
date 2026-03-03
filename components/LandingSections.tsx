import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, ArrowRight, Zap, Music, 
  Sparkles, ChevronRight, ChevronLeft, Library, 
  ChevronDown, Radio, Clock, Camera, Bookmark, 
  Layers, User, Globe, Hash, ExternalLink,
  Building2, Users, Info
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ViewState, TimelineItem } from '../types';

/**
 * 装饰性组件：胶带
 */
export const Tape: React.FC<{ className?: string; color?: string; rotate?: number }> = ({ 
  className = "", 
  color = "bg-yellow-200/60", 
  rotate = -2 
}) => (
  <div 
    className={`absolute h-6 w-20 ${color} backdrop-blur-[1px] border-x border-black/5 shadow-sm z-50 pointer-events-none ${className}`}
    style={{ transform: `rotate(${rotate}deg)`, clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)' }}
  />
);

/**
 * 装饰性组件：印章
 */
const Stamp: React.FC<{ text: string; color?: string; rotate?: number; className?: string }> = ({ 
  text, 
  color = "border-red-600 text-red-600", 
  rotate = -15,
  className = ""
}) => (
  <div 
    className={`inline-block px-2 py-1 border-2 font-black text-[10px] uppercase tracking-tighter rounded-sm opacity-80 mix-blend-multiply ${color} ${className}`}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    {text}
  </div>
);

/**
 * 1. Bento Header 组件 - 动态功能头版
 */
export const BentoHeader: React.FC<{ 
  items: TimelineItem[]; 
  region: string;
  stats: {
    totalEvents: number;
    todayCount: number;
    thisWeekCount: number;
    updateCount: number;
  };
}> = ({ items, region, stats }) => {
  const navigate = useNavigate();
  const todayItems = items.filter(i => i.isToday);
  const upcomingItems = items.filter(i => !i.isToday);
  
  // 确定主头条
  const mainItem = todayItems.length > 0 ? todayItems[0] : upcomingItems[0];
  // 确定次要头条 (最多展示2个)
  const secondaryItems = todayItems.length > 1 
    ? todayItems.slice(1, 3) 
    : (mainItem === upcomingItems[0] ? upcomingItems.slice(1, 3) : upcomingItems.slice(0, 2));

  if (!mainItem) return null;

  // 计算倒计时 (距离下一场非今日活动)
  const nextMajor = upcomingItems[0];
  const daysLeft = nextMajor ? Math.ceil((new Date(nextMajor.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <section className="max-w-7xl mx-auto font-serif">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* 1. 主头条 (占 8 列) */}
        <div className="lg:col-span-8 relative group overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white min-h-[400px]">
          <Tape className="-top-2 left-1/2 -translate-x-1/2 w-32" rotate={1} />
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 relative bg-[#E5E5E5] overflow-hidden flex items-center justify-center p-4 border-b-4 md:border-b-0 md:border-r-4 border-black">
              <img 
                src={mainItem.image || ""} 
                alt={mainItem.title}
                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
              {mainItem.isToday && (
                <div className="absolute top-4 left-4 z-30">
                  <Stamp text="TODAY" rotate={-10} className="text-lg px-4 py-2 bg-white/80" />
                </div>
              )}
            </div>
            
            <div className="md:w-1/2 p-8 flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
                    {mainItem.isToday ? '今日头条' : '近期焦点'}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                    {mainItem.type} / {mainItem.id.slice(0, 6)}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black font-header leading-tight mb-6 group-hover:text-red-600 transition-colors">
                  {mainItem.title}
                </h1>
                <div className="space-y-2 mb-8">
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Calendar size={16} className="text-red-600"/> {mainItem.date}</div>
                   <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><MapPin size={16} className="text-red-600"/> {mainItem.location || "未知"}</div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate({ 
                  to: mainItem.type === 'event' ? '/events/$eventId' : '/lives/$liveId', 
                  params: mainItem.type === 'event' ? { eventId: mainItem.id } : { liveId: mainItem.id } 
                } as any)}
                className="w-full py-4 bg-black text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-red-600 transition-colors flex items-center justify-center gap-3"
              >
                查看详细情报 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. 侧边功能区 (占 4 列) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* 倒计时模块 (高价值) */}
          {nextMajor && (
            <div className="flex-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-red-600 text-white p-6 flex flex-col justify-center relative overflow-hidden group cursor-pointer"
                 onClick={() => navigate({ to: nextMajor.type === 'event' ? '/events/$eventId' : '/lives/$liveId', params: { [nextMajor.type === 'event' ? 'eventId' : 'liveId']: nextMajor.id } } as any)}>
              <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:scale-110">
                <Clock size={160} />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Next Major Event</div>
                <div className="text-5xl font-black font-header mb-1 tracking-tighter">
                  {daysLeft === 0 ? 'TODAY' : `${daysLeft} DAYS`}
                </div>
                <div className="text-xs font-bold italic line-clamp-1 opacity-90">距离 {nextMajor.title}</div>
              </div>
            </div>
          )}

          {/* 数字化信任 (Social Proof) */}
          <div className="flex-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white p-6 flex flex-col justify-center">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-slate-400">AyaFeed Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">已收录</div>
                <div className="text-2xl font-black">{stats.totalEvents}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">本周活动</div>
                <div className="text-2xl font-black text-red-600">{stats.thisWeekCount}</div>
              </div>
            </div>
          </div>

          {/* 快速导航 & 主办方入口 */}
          <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-slate-100 p-6">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/events" className="px-3 py-2 border-2 border-black text-[10px] font-black uppercase text-center bg-white hover:bg-black hover:text-white transition-colors">找活动</Link>
              <button className="px-3 py-2 border-2 border-black text-[10px] font-black uppercase text-center bg-red-600 text-white hover:bg-black transition-colors">投递情报</button>
            </div>
          </div>
        </div>

        {/* 3. 次要头条 (横向补位) */}
        {secondaryItems.length > 0 && (
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {secondaryItems.map((item) => (
              <div 
                key={item.id}
                className="border-2 border-black p-4 bg-white hover:bg-slate-50 cursor-pointer transition-all flex gap-4 group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => navigate({ to: item.type === 'event' ? '/events/$eventId' : '/lives/$liveId', params: { [item.type === 'event' ? 'eventId' : 'liveId']: item.id } } as any)}
              >
                <div className="w-20 h-24 bg-slate-100 border-2 border-black shrink-0 overflow-hidden flex items-center justify-center">
                  <img src={item.image || ""} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] font-black px-1 border border-black ${item.type === 'live' ? 'bg-yellow-400' : 'bg-black text-white'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
                  </div>
                  <h4 className="text-lg font-black font-header line-clamp-1 group-hover:text-red-600 leading-tight">{item.title}</h4>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin size={10} /> {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * 2. 剪贴簿编年史时间轴 - 时间切片分组
 */
export const ScrapbookTimeline: React.FC<{ 
  items: TimelineItem[]; 
}> = ({ items }) => {
  const navigate = useNavigate();
  
  // 按时间切片分组: Today, This Week, Upcoming
  const todayItems = items.filter(i => i.isToday);
  const thisWeekItems = items.filter(i => i.isThisWeek && !i.isToday);
  const upcomingItems = items.filter(i => !i.isThisWeek);

  const sections = [
    { title: 'TODAY / 今日情报', items: todayItems, color: 'bg-red-600', icon: <Radio size={24} className="text-red-600 animate-pulse" /> },
    { title: 'THIS WEEK / 本周焦点', items: thisWeekItems, color: 'bg-black', icon: <Calendar size={24} className="text-black" /> },
    { title: 'UPCOMING / 即将到来', items: upcomingItems, color: 'bg-slate-400', icon: <Clock size={24} className="text-slate-400" /> }
  ].filter(s => s.items.length > 0);

  return (
    <div className="lg:col-span-8 flex flex-col">
      <div className="flex items-center gap-3 mb-12 relative">
        <Library className="shrink-0 text-red-600" size={32} />
        <h2 className="text-4xl font-black font-header text-slate-900 tracking-tighter">幻想乡编年史</h2>
        <div className="absolute -bottom-2 left-0 w-full h-1 bg-black/5"></div>
      </div>

      <div className="space-y-24">
        {sections.length > 0 ? (
          sections.map((section) => (
            <div key={section.title} className="relative">
              {/* Section Header */}
              <div className="sticky top-16 z-40 bg-[#FDFBF7]/90 backdrop-blur-sm py-4 mb-10 border-y-4 border-black flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4">
                  {section.icon}
                  <h3 className="text-3xl font-black font-header tracking-tighter italic">{section.title}</h3>
                </div>
                <div className="text-xs font-black bg-black text-white px-2 py-1 uppercase tracking-widest">
                  {section.items.length} ITEMS
                </div>
              </div>

              {/* List Layout */}
              <div className="flex flex-col gap-12 border-l-4 border-black/10 ml-4 pl-10 relative">
                {section.items.map((item, idx) => (
                  <ScrapbookCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="border-4 border-dashed border-slate-300 bg-white/60 p-12 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-5 rotate-12"><Library size={200} /></div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">ARCHIVE EMPTY</div>
            <h3 className="text-2xl font-black font-header text-slate-900 mb-4">暂无可展示的日程条目</h3>
            <p className="text-base text-slate-600 font-serif italic max-w-[50ch] mx-auto leading-relaxed">
              当前频道没有未来排期的活动条目。文文新闻编辑部正在加紧取材中，请稍后再来。
            </p>
          </div>
        )}
        
        <div className="mt-12 pt-12 border-t-4 border-double border-black/20">
          <Link 
            to="/events"
            className="w-full py-6 font-black text-lg uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white active:translate-y-1 active:shadow-none"
          >
            查看完整历史存档 <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * 剪贴簿卡片组件 - 核心信息载体
 */
const ScrapbookCard: React.FC<{ item: TimelineItem; index: number }> = ({ item, index }) => {
  const navigate = useNavigate();
  const isLive = item.type === 'live';
  const targetRoute = isLive ? '/lives/$liveId' : '/events/$eventId';
  const targetParams = isLive ? { liveId: item.id } : { eventId: item.id };

  // 随机旋转角度，增加剪贴感
  const rotation = useMemo(() => (index % 2 === 0 ? 0.5 : -0.5), [index]);

  return (
    <div 
      className="relative group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Timeline Dot */}
      <div className="absolute -left-[46px] top-8 w-4 h-4 rounded-full border-4 border-black bg-white z-10 group-hover:bg-red-600 transition-colors" />
      
      {/* Tape Decoration */}
      {index % 3 === 0 && <Tape className="-top-3 left-10" rotate={-5} />}
      
      <div 
        className={`relative bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${isLive ? 'bg-yellow-50/30' : ''}`}
        onClick={() => navigate({ to: targetRoute as any, params: targetParams as any })}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster Thumbnail */}
          <div className="w-full md:w-32 h-44 bg-slate-100 border-2 border-black shrink-0 overflow-hidden flex items-center justify-center relative">
            <img 
              src={item.image || ""} 
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110" 
              alt={item.title}
            />
            {item.isToday && (
              <div className="absolute inset-0 bg-red-600/10 pointer-events-none"></div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border border-black ${isLive ? 'bg-yellow-400' : 'bg-black text-white'}`}>
                {isLive ? '演出 LIVE' : '展会 EVENT'}
              </span>
              <span className="text-xs font-bold font-mono text-slate-400">{item.date}</span>
              {item.status && (
                <Stamp 
                  text={item.status === 'ONGOING' ? '举办中' : (item.status === 'RECRUITING' ? '募集终' : '筹备中')} 
                  rotate={-5} 
                  className="scale-90" 
                />
              )}
            </div>

            <h4 className={`text-xl sm:text-2xl font-black font-header mb-3 leading-tight group-hover:text-red-600 transition-colors ${isLive ? 'text-red-800' : 'text-slate-900'}`}>
              {item.title}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-4 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {item.location || "未知地点"}</div>
              {item.boothCount && <div className="flex items-center gap-2"><Users size={14} className="text-slate-400" /> 预计 {item.boothCount} 摊位</div>}
              {item.organizer && <div className="flex items-center gap-2"><Building2 size={14} className="text-slate-400" /> {item.organizer}</div>}
              {item.website && (
                <div className="flex items-center gap-2 text-red-600 hover:underline">
                  <ExternalLink size={14} /> 官方网站
                </div>
              )}
            </div>

            <p className="text-sm text-slate-500 italic line-clamp-2 mt-auto border-t border-dashed border-slate-200 pt-3">
              {item.summary || "暂无详细摘要信息。"}
            </p>
          </div>
        </div>
      </div>
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
