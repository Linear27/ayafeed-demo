import React, { useMemo } from 'react';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Library,
  Radio,
  Clock,
  Bookmark,
  ExternalLink,
  Building2,
  Users,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { TimelineItem } from '../types';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]';

const monthKeyFromDate = (date: string) => date.slice(0, 7);

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  return `${year}年 ${Number(month)}月`;
};

const buildMonthIndex = (items: TimelineItem[]) => {
  const uniqueMonthKeys: string[] = Array.from(new Set<string>(items.map((item) => monthKeyFromDate(item.date))));
  uniqueMonthKeys.sort((a, b) => a.localeCompare(b));
  return uniqueMonthKeys.map((key) => ({ key, label: formatMonthLabel(key) }));
};

const scrollToMonthAnchor = (monthKey: string) => {
  const element = document.getElementById(`month-${monthKey}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const getDetailTarget = (item: TimelineItem) =>
  item.type === 'event'
    ? ({ to: '/events/$eventId', params: { eventId: item.id } } as const)
    : ({ to: '/lives/$liveId', params: { liveId: item.id } } as const);

const normalizeWebsiteUrl = (url: string) => {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

/**
 * 装饰性组件：胶带
 */
export const Tape: React.FC<{ className?: string; color?: string; rotate?: number }> = ({
  className = '',
  color = 'bg-yellow-200/60',
  rotate = -2,
}) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute z-50 h-6 w-20 ${color} border-x border-black/5 shadow-sm backdrop-blur-[1px] ${className}`}
    style={{
      transform: `rotate(${rotate}deg)`,
      clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)',
    }}
  />
);

/**
 * 装饰性组件：印章
 */
const Stamp: React.FC<{ text: string; color?: string; rotate?: number; className?: string }> = ({
  text,
  color = 'border-red-600 text-red-600',
  rotate = -15,
  className = '',
}) => (
  <div
    aria-hidden="true"
    className={`inline-block rounded-sm border-2 px-2 py-1 text-[11px] font-black uppercase tracking-tight opacity-80 mix-blend-multiply ${color} ${className}`}
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
}> = ({ items, region: _region, stats }) => {
  const todayItems = items.filter((i) => i.isToday);
  const upcomingItems = items.filter((i) => !i.isToday);

  const mainItem = todayItems.length > 0 ? todayItems[0] : upcomingItems[0];
  const secondaryItems =
    todayItems.length > 1
      ? todayItems.slice(1, 3)
      : mainItem === upcomingItems[0]
        ? upcomingItems.slice(1, 3)
        : upcomingItems.slice(0, 2);

  if (!mainItem) return null;

  const nextMajor = upcomingItems[0];
  const daysLeft = nextMajor
    ? Math.ceil((new Date(nextMajor.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const mainTarget = getDetailTarget(mainItem);

  return (
    <section className="mx-auto max-w-7xl" aria-labelledby="landing-feature-heading">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <article className="group relative min-h-[420px] overflow-hidden border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.9)] lg:col-span-8">
          <Tape className="left-1/2 top-0 w-32 -translate-x-1/2" rotate={1} />
          <div className="flex h-full flex-col md:flex-row">
            <div className="relative flex items-center justify-center overflow-hidden border-b-4 border-black bg-[#E5E5E5] p-4 md:w-1/2 md:border-b-0 md:border-r-4">
              <img
                src={mainItem.image || ''}
                alt={mainItem.title}
                width={720}
                height={960}
                fetchPriority="high"
                className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
              {mainItem.isToday && (
                <div className="absolute left-4 top-4 z-30">
                  <Stamp text="TODAY" rotate={-10} className="bg-white/85 px-4 py-2 text-base" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-7 md:w-1/2 md:p-8">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-red-600 px-2 py-0.5 text-xs font-black uppercase tracking-[0.16em] text-white">
                    {mainItem.isToday ? '今日头条' : '近期焦点'}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {mainItem.type} / {mainItem.id.slice(0, 6)}
                  </span>
                </div>
                <h2 id="landing-feature-heading" className="mb-5 text-2xl leading-tight font-black text-slate-900 sm:text-4xl">
                  {mainItem.title}
                </h2>
                <div className="mb-8 space-y-2 text-sm font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar aria-hidden="true" size={16} className="text-red-600" /> {mainItem.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin aria-hidden="true" size={16} className="text-red-600" /> {mainItem.location || '未知'}
                  </div>
                </div>
              </div>

              <Link
                {...(mainTarget as any)}
                className={`inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-black py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-red-600 ${FOCUS_RING}`}
              >
                查看详细情报 <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4 lg:col-span-4" aria-label="焦点补充信息">
          {nextMajor && (
            <Link
              {...(getDetailTarget(nextMajor) as any)}
              className={`group relative flex-1 overflow-hidden border-2 border-black bg-white p-6 text-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-red-600 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.45)] ${FOCUS_RING}`}
            >
              <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-5 transition-transform duration-200 group-hover:scale-110">
                <Clock aria-hidden="true" size={124} />
              </div>
              <div className="relative z-10">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-red-700">Next Major Event</div>
                <div className="mb-1 text-4xl leading-none font-black tracking-tight text-slate-900">
                  {daysLeft === 0 ? 'TODAY' : `${daysLeft} DAYS`}
                </div>
                <div className="line-clamp-1 text-sm font-bold text-slate-700">距离 {nextMajor.title}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-red-700">
                  查看情报 <ArrowRight aria-hidden="true" size={14} />
                </div>
              </div>
            </Link>
          )}

          <div className="flex-1 border-2 border-black bg-white p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">AyaFeed Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase text-slate-500">已收录</div>
                <div className="text-2xl font-black tabular-nums">{stats.totalEvents}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-500">本周活动</div>
                <div className="text-2xl font-black text-red-600 tabular-nums">{stats.thisWeekCount}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase text-slate-500">今日进行中</div>
                <div className="text-xl font-black tabular-nums">{stats.todayCount}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-500">近期更新</div>
                <div className="text-xl font-black tabular-nums">{stats.updateCount}</div>
              </div>
            </div>
          </div>

          <div className="border border-black/30 bg-slate-50 p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Related Paths</div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold">
              <Link to="/events" className={`text-slate-700 underline-offset-2 hover:text-red-700 hover:underline ${FOCUS_RING}`}>
                浏览展会名录
              </Link>
              <Link to="/feedback" className={`text-slate-700 underline-offset-2 hover:text-red-700 hover:underline ${FOCUS_RING}`}>
                提交活动情报
              </Link>
            </div>
          </div>
        </aside>

        {secondaryItems.length > 0 && (
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-12">
            {secondaryItems.map((item) => (
              <Link
                key={item.id}
                {...(getDetailTarget(item) as any)}
                className={`group flex gap-4 border border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow,border-color] duration-200 hover:border-red-600 hover:bg-slate-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.42)] ${FOCUS_RING}`}
              >
                <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden border border-black bg-slate-100">
                  <img
                    src={item.image || ''}
                    alt={item.title}
                    width={240}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`border border-black px-1 py-0.5 text-[11px] font-black ${item.type === 'live' ? 'bg-yellow-400' : 'bg-black text-white'}`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{item.date}</span>
                  </div>
                  <h3 className="line-clamp-1 text-lg leading-tight font-black text-slate-900 transition-colors duration-200 group-hover:text-red-600">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-600">
                    <MapPin aria-hidden="true" size={12} /> {item.location || '未知地点'}
                  </div>
                </div>
              </Link>
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
  const todayItems = items.filter((i) => i.isToday);
  const thisWeekItems = items.filter((i) => i.isThisWeek && !i.isToday);
  const upcomingItems = items.filter((i) => !i.isThisWeek);

  const sections = [
    {
      id: 'today',
      title: 'TODAY / 今日情报',
      items: todayItems,
      icon: <Radio aria-hidden="true" size={22} className="text-red-600" />,
    },
    {
      id: 'this-week',
      title: 'THIS WEEK / 本周焦点',
      items: thisWeekItems,
      icon: <Calendar aria-hidden="true" size={22} className="text-black" />,
    },
    {
      id: 'upcoming',
      title: 'UPCOMING / 即将到来',
      items: upcomingItems,
      icon: <Clock aria-hidden="true" size={22} className="text-slate-500" />,
    },
  ].filter((section) => section.items.length > 0);

  const anchoredMonths = new Set<string>();

  return (
    <div className="flex flex-col" id="timeline-root">
      <div className="relative mb-12 flex items-center gap-3">
        <Library aria-hidden="true" className="shrink-0 text-red-600" size={32} />
        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">幻想乡编年史</h2>
        <div className="absolute -bottom-2 left-0 h-1 w-full bg-black/5" aria-hidden="true"></div>
      </div>

      <div className="space-y-20">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.title} className="relative" aria-label={section.title}>
              <div
                className={`mb-8 flex items-center justify-between border-y-2 border-black bg-[#FDFBF7]/95 px-5 py-3 shadow-sm ${
                  section.id === 'upcoming' ? '' : 'lg:sticky lg:top-[calc(var(--aya-header-height-compact,46px)+12px)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h3 className="text-2xl font-black tracking-tight sm:text-3xl">{section.title}</h3>
                </div>
                <div className="bg-black px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-white tabular-nums">
                  {section.items.length} ITEMS
                </div>
              </div>

              <div className="relative ml-3 flex flex-col gap-10 border-l-4 border-black/10 pl-8">
                {section.items.map((item, index) => {
                  const monthKey = monthKeyFromDate(item.date);
                  const anchorId = anchoredMonths.has(monthKey) ? undefined : `month-${monthKey}`;
                  if (!anchoredMonths.has(monthKey)) {
                    anchoredMonths.add(monthKey);
                  }

                  return <ScrapbookCard key={item.id} item={item} index={index} anchorId={anchorId} />;
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="relative overflow-hidden border-4 border-dashed border-slate-300 bg-white/60 p-12 text-center">
            <div className="absolute -right-10 -top-10 rotate-12 opacity-5" aria-hidden="true">
              <Library size={200} />
            </div>
            <div className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-slate-400">ARCHIVE EMPTY</div>
            <h3 className="mb-4 text-2xl font-black text-slate-900">暂无可展示的日程条目</h3>
            <p className="mx-auto max-w-[50ch] text-base leading-relaxed text-slate-600 italic">
              当前频道没有未来排期的活动条目。文文新闻编辑部正在加紧取材中，请稍后再来。
            </p>
          </div>
        )}

        <div className="mt-8 border-t-4 border-double border-black/20 pt-10">
          <Link
            to="/events"
            className={`flex w-full items-center justify-center gap-3 border-4 border-black bg-white py-5 text-base font-black uppercase tracking-[0.28em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-[background-color,color,transform,box-shadow] duration-200 hover:bg-black hover:text-white active:translate-y-1 active:shadow-none ${FOCUS_RING}`}
          >
            查看完整历史存档 <ArrowRight aria-hidden="true" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * 剪贴簿卡片组件 - 核心信息载体
 */
const ScrapbookCard: React.FC<{ item: TimelineItem; index: number; anchorId?: string }> = ({
  item,
  index,
  anchorId,
}) => {
  const isLive = item.type === 'live';
  const detailTarget = getDetailTarget(item);
  const website = item.website ? normalizeWebsiteUrl(item.website) : null;

  return (
    <article id={anchorId} className="group relative scroll-mt-28" aria-labelledby={`timeline-title-${item.id}`}>
      <div
        aria-hidden="true"
        className="absolute -left-[38px] top-8 z-10 h-4 w-4 rounded-full border-4 border-black bg-white transition-colors duration-200 group-hover:bg-red-600"
      />

      {index === 0 && <Tape className="-top-3 left-10" rotate={-5} />}

      <div
        className={`relative border-2 border-black bg-white p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)] transition-[box-shadow,border-color] duration-200 hover:border-red-600 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${isLive ? 'bg-yellow-50/20' : ''}`}
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-slate-100 md:w-32">
            <img
              src={item.image || ''}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              alt={item.title}
              width={320}
              height={440}
              loading="lazy"
              decoding="async"
            />
            {item.isToday && <div className="pointer-events-none absolute inset-0 bg-red-600/10" aria-hidden="true"></div>}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`border border-black px-2 py-0.5 text-xs font-black uppercase tracking-[0.12em] ${isLive ? 'bg-yellow-400' : 'bg-black text-white'}`}
              >
                {isLive ? '演出 LIVE' : '展会 EVENT'}
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">{item.date}</span>
              {item.status && (
                <Stamp
                  text={item.status === 'ONGOING' ? '举办中' : item.status === 'RECRUITING' ? '募集终' : '筹备中'}
                  rotate={-5}
                  className="scale-90"
                />
              )}
            </div>

            <h4
              id={`timeline-title-${item.id}`}
              className={`mb-3 text-xl leading-tight font-black transition-colors duration-200 sm:text-2xl ${isLive ? 'text-red-800' : 'text-slate-900'} group-hover:text-red-600`}
            >
              {item.title}
            </h4>

            <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm font-bold text-slate-700 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin aria-hidden="true" size={14} className="text-slate-500" /> {item.location || '未知地点'}
              </div>
              {item.boothCount && (
                <div className="flex items-center gap-2">
                  <Users aria-hidden="true" size={14} className="text-slate-500" /> 预计 {item.boothCount} 摊位
                </div>
              )}
              {item.organizer && (
                <div className="flex items-center gap-2">
                  <Building2 aria-hidden="true" size={14} className="text-slate-500" /> {item.organizer}
                </div>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 text-red-600 underline-offset-2 hover:underline ${FOCUS_RING}`}
                >
                  <ExternalLink aria-hidden="true" size={14} /> 官方网站
                </a>
              )}
            </div>

            <p className="mt-auto line-clamp-2 border-t border-dashed border-slate-200 pt-3 text-sm text-slate-600 italic break-words">
              {item.summary || '暂无详细摘要信息。'}
            </p>

            <div className="mt-4">
              <Link
                {...(detailTarget as any)}
                className={`inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors duration-200 hover:bg-black hover:text-white ${FOCUS_RING}`}
              >
                查看详情 <ArrowRight aria-hidden="true" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/**
 * 3. 检索与索引侧栏
 */
export const IndexSidebar: React.FC<{
  items: TimelineItem[];
}> = ({ items }) => {
  const months = useMemo(() => buildMonthIndex(items), [items]);

  const regionCounts = useMemo(() => {
    const counts = { JAPAN: 0, CN_MAINLAND: 0, OVERSEAS: 0 };
    items.forEach((item) => {
      if (item.marketRegion === 'JAPAN') counts.JAPAN += 1;
      else if (item.marketRegion === 'CN_MAINLAND') counts.CN_MAINLAND += 1;
      else if (item.marketRegion === 'OVERSEAS') counts.OVERSEAS += 1;
    });
    return counts;
  }, [items]);

  return (
    <aside className="mt-8 flex flex-col border-dashed border-slate-300 lg:col-span-4 lg:mt-0 lg:border-l lg:pl-10" aria-label="检索与索引">
      <div className="mb-8 -rotate-1 bg-black p-3 text-white">
        <h2 className="flex items-center text-xl font-black uppercase tracking-[0.12em]">
          <Bookmark aria-hidden="true" className="mr-2 fill-current" /> 检索与索引
        </h2>
      </div>

      <div className="space-y-8">
        <section className="hidden lg:block">
          <h3 className="mb-3 border-b border-slate-300 pb-1 text-sm font-black uppercase tracking-[0.12em] text-slate-600">
            快速跳转 (Quick Jump)
          </h3>
          <div className="flex flex-wrap gap-2">
            {months.map((month) => (
              <button
                key={month.key}
                type="button"
                onClick={() => scrollToMonthAnchor(month.key)}
                className={`border border-black px-3 py-1.5 text-xs font-bold transition-colors duration-200 hover:bg-black hover:text-white ${FOCUS_RING}`}
              >
                {month.label}
              </button>
            ))}
            {months.length === 0 && <span className="text-sm text-slate-400 italic">无可用月份</span>}
          </div>
        </section>

        <section>
          <h3 className="mb-3 border-b border-slate-300 pb-1 text-sm font-black uppercase tracking-[0.12em] text-slate-600">
            地区分布 (Region)
          </h3>
          <ul className="space-y-2 text-sm font-bold font-mono">
            <li className="flex items-center justify-between">
              <span>日本 (JAPAN)</span>
              <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 tabular-nums">{regionCounts.JAPAN}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>大陆 (CN_MAINLAND)</span>
              <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 tabular-nums">{regionCounts.CN_MAINLAND}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>海外 (OVERSEAS)</span>
              <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 tabular-nums">{regionCounts.OVERSEAS}</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 border-b border-slate-300 pb-1 text-sm font-black uppercase tracking-[0.12em] text-slate-600">
            热门标签 (Tags)
          </h3>
          <div className="flex flex-wrap gap-2">
            {['#东方Project', '#Only', '#同人志即卖会', '#Live', '#交响乐'].map((tag) => (
              <Link
                key={tag}
                to="/events"
                className={`text-xs font-bold text-red-700 underline-offset-2 transition-colors duration-200 hover:text-red-900 hover:underline ${FOCUS_RING}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-8 border-4 border-black bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] p-4">
          <div className="absolute right-0 top-0 bg-black px-1 text-[10px] font-bold uppercase text-white">AD</div>
          <h4 className="mb-2 text-lg font-black">社团入驻开放中</h4>
          <p className="mb-4 text-sm leading-relaxed text-slate-700 italic">
            想要在幻想乡日程表上展示您的社团信息吗？现在就申请入驻，获取专属展示页面。
          </p>
          <Link
            to="/circles"
            className={`block w-full bg-black py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-red-600 ${FOCUS_RING}`}
          >
            了解详情
          </Link>
        </section>
      </div>
    </aside>
  );
};

export const MobileQuickJumpBar: React.FC<{
  items: TimelineItem[];
}> = ({ items }) => {
  const months = useMemo(() => buildMonthIndex(items), [items]);

  if (months.length === 0) return null;

  return (
    <section className="sticky top-[var(--aya-header-height-compact,46px)] z-30 -mx-4 mb-8 border-y border-black/15 bg-[#FDFBF7]/95 px-4 py-2 backdrop-blur-sm lg:hidden">
      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-slate-600">快速跳转</div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {months.map((month) => (
          <button
            key={month.key}
            type="button"
            onClick={() => scrollToMonthAnchor(month.key)}
            className={`shrink-0 whitespace-nowrap border border-black bg-white px-3 py-1.5 text-xs font-bold transition-colors duration-200 hover:bg-black hover:text-white ${FOCUS_RING}`}
          >
            {month.label}
          </button>
        ))}
      </div>
    </section>
  );
};
