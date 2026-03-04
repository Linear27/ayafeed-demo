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
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper-bg)]';

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
  color = 'bg-[var(--paper-accent)]/10',
  rotate = -2,
}) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute z-50 h-6 w-20 ${color} border-x border-[var(--paper-border)]/5 shadow-sm backdrop-blur-[1px] ${className}`}
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
  color = 'border-[var(--paper-accent)] text-[var(--paper-accent)]',
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
        <article className="group relative min-h-[420px] overflow-hidden border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] shadow-[6px_6px_0px_0px_var(--paper-border)] lg:col-span-8">
          <Tape className="left-1/2 top-0 w-32 -translate-x-1/2" rotate={1} />
          <div className="flex h-full flex-col md:flex-row">
            <div className="relative flex items-center justify-center overflow-hidden border-b-4 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] p-4 md:w-1/2 md:border-b-0 md:border-r-4">
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
                  <Stamp text="TODAY" rotate={-10} className="bg-[var(--paper-surface)]/85 px-4 py-2 text-base" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-7 md:w-1/2 md:p-8">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-[var(--paper-accent)] px-2 py-0.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-surface)]">
                    {mainItem.isToday ? '今日头条' : '近期焦点'}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">
                    {mainItem.type} / {mainItem.id.slice(0, 6)}
                  </span>
                </div>
                <h2 id="landing-feature-heading" className="mb-5 text-2xl leading-tight font-black text-[var(--paper-text)] sm:text-4xl">
                  {mainItem.title}
                </h2>
                <div className="mb-8 space-y-2 text-sm font-bold text-[var(--paper-text-muted)]">
                  <div className="flex items-center gap-2">
                    <Calendar aria-hidden="true" size={16} className="text-[var(--paper-accent)]" /> {mainItem.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin aria-hidden="true" size={16} className="text-[var(--paper-accent)]" /> {mainItem.location || '未知'}
                  </div>
                </div>
              </div>

              <Link
                {...(mainTarget as any)}
                className={`inline-flex w-full items-center justify-center gap-2 border-2 border-[var(--paper-border)] bg-[var(--paper-border)] py-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-surface)] transition-colors duration-200 hover:bg-[var(--paper-accent)] ${FOCUS_RING}`}
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
              className={`group relative flex-1 overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-6 text-[var(--paper-text)] shadow-[2px_2px_0px_0px_var(--paper-border)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--paper-accent)] hover:shadow-[3px_3px_0px_0px_var(--paper-border)] ${FOCUS_RING}`}
            >
              <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-5 transition-transform duration-200 group-hover:scale-110">
                <Clock aria-hidden="true" size={124} />
              </div>
              <div className="relative z-10">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-accent)]">Next Major Event</div>
                <div className="mb-1 text-4xl leading-none font-black tracking-tight text-[var(--paper-text)]">
                  {daysLeft === 0 ? 'TODAY' : `${daysLeft} DAYS`}
                </div>
                <div className="line-clamp-1 text-sm font-bold text-[var(--paper-text-muted)]">距离 {nextMajor.title}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--paper-accent)]">
                  查看情报 <ArrowRight aria-hidden="true" size={14} />
                </div>
              </div>
            </Link>
          )}

          <div className="flex-1 border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 shadow-[2px_2px_0px_0px_var(--paper-border)]">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">AyaFeed Stats</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase text-[var(--paper-text-muted)]">已收录</div>
                <div className="text-2xl font-black tabular-nums text-[var(--paper-text)]">{stats.totalEvents}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[var(--paper-text-muted)]">本周活动</div>
                <div className="text-2xl font-black text-[var(--paper-accent)] tabular-nums">{stats.thisWeekCount}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold uppercase text-[var(--paper-text-muted)]">今日进行中</div>
                <div className="text-xl font-black tabular-nums text-[var(--paper-text)]">{stats.todayCount}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-[var(--paper-text-muted)]">近期更新</div>
                <div className="text-xl font-black tabular-nums text-[var(--paper-text)]">{stats.updateCount}</div>
              </div>
            </div>
          </div>

          <div className="border border-[var(--paper-border)]/30 bg-[var(--paper-bg-secondary)]/50 p-4">
            <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--paper-text-muted)]">Related Paths</div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold">
              <Link to="/events" className={`text-[var(--paper-text-muted)] underline-offset-2 hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}>
                浏览展会名录
              </Link>
              <Link to="/feedback" className={`text-[var(--paper-text-muted)] underline-offset-2 hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}>
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
                className={`group flex gap-4 border border-[var(--paper-border)] bg-[var(--paper-surface)] p-4 shadow-[2px_2px_0px_0px_var(--paper-border)] transition-[background-color,box-shadow,border-color] duration-200 hover:border-[var(--paper-accent)] hover:bg-[var(--paper-bg-secondary)]/50 hover:shadow-[3px_3px_0px_0px_var(--paper-border)] ${FOCUS_RING}`}
              >
                <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden border border-[var(--paper-border)] bg-[var(--paper-bg-secondary)]">
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
                      className={`border border-[var(--paper-border)] px-1 py-0.5 text-[11px] font-black ${item.type === 'live' ? 'bg-yellow-400 text-black' : 'bg-[var(--paper-border)] text-[var(--paper-surface)]'}`}
                    >
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-[var(--paper-text-muted)]">{item.date}</span>
                  </div>
                  <h3 className="line-clamp-1 text-lg leading-tight font-black text-[var(--paper-text)] transition-colors duration-200 group-hover:text-[var(--paper-accent)]">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs font-bold text-[var(--paper-text-muted)]">
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
        <Library aria-hidden="true" className="shrink-0 text-[var(--paper-accent)]" size={32} />
        <h2 className="text-3xl font-black tracking-tight text-[var(--paper-text)] sm:text-4xl uppercase">幻想乡编年史</h2>
        <div className="absolute -bottom-2 left-0 h-1 w-full bg-[var(--paper-border)]/5" aria-hidden="true"></div>
      </div>

      <div className="space-y-20">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.title} className="relative" aria-label={section.title}>
              <div
                className={`mb-8 flex items-center justify-between border-y-2 border-[var(--paper-border)] bg-[var(--paper-bg)]/95 px-5 py-3 shadow-sm ${
                  section.id === 'upcoming' ? '' : 'lg:sticky lg:top-[calc(var(--aya-header-height-compact,46px)+12px)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h3 className="text-2xl font-black tracking-tight sm:text-3xl uppercase">{section.title}</h3>
                </div>
                <div className="bg-[var(--paper-border)] px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--paper-surface)] tabular-nums">
                  {section.items.length} ITEMS
                </div>
              </div>

              <div className="relative ml-3 flex flex-col gap-10 border-l-4 border-[var(--paper-border)]/10 pl-8">
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
          <div className="relative overflow-hidden border-4 border-dashed border-[var(--paper-border)]/20 bg-[var(--paper-surface)]/60 p-12 text-center">
            <div className="absolute -right-10 -top-10 rotate-12 opacity-5" aria-hidden="true">
              <Library size={200} />
            </div>
            <div className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[var(--paper-text-muted)]">ARCHIVE EMPTY</div>
            <h3 className="mb-4 text-2xl font-black text-[var(--paper-text)]">暂无可展示的日程条目</h3>
            <p className="mx-auto max-w-[50ch] text-base leading-relaxed text-[var(--paper-text-muted)] italic">
              当前频道没有未来排期的活动条目。文文新闻编辑部正在加紧取材中，请稍后再来。
            </p>
          </div>
        )}

        <div className="mt-8 border-t-4 border-double border-[var(--paper-border)]/20 pt-10">
          <Link
            to="/events"
            className={`flex w-full items-center justify-center gap-3 border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] py-5 text-base font-black uppercase tracking-[0.28em] shadow-[8px_8px_0px_0px_var(--paper-border)] transition-[background-color,color,transform,box-shadow] duration-200 hover:bg-[var(--paper-border)] hover:text-[var(--paper-surface)] active:translate-y-1 active:shadow-none ${FOCUS_RING}`}
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
        className="absolute -left-[38px] top-8 z-10 h-4 w-4 rounded-full border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] transition-colors duration-200 group-hover:bg-[var(--paper-accent)]"
      />

      {index === 0 && <Tape className="-top-3 left-10" rotate={-5} />}

      <div
        className={`relative border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 shadow-[3px_3px_0px_0px_var(--paper-border)]/20 transition-[box-shadow,border-color] duration-200 hover:border-[var(--paper-accent)] hover:shadow-[4px_4px_0px_0px_var(--paper-border)]/30 ${isLive ? 'bg-[var(--paper-accent)]/5' : ''}`}
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] md:w-32">
            <img
              src={item.image || ''}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              alt={item.title}
              width={320}
              height={440}
              loading="lazy"
              decoding="async"
            />
            {item.isToday && <div className="pointer-events-none absolute inset-0 bg-[var(--paper-accent)]/10" aria-hidden="true"></div>}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`border border-[var(--paper-border)] px-2 py-0.5 text-xs font-black uppercase tracking-[0.12em] ${isLive ? 'bg-yellow-400 text-black' : 'bg-[var(--paper-border)] text-[var(--paper-surface)]'}`}
              >
                {isLive ? '演出 LIVE' : '展会 EVENT'}
              </span>
              <span className="font-mono text-xs font-bold text-[var(--paper-text-muted)]">{item.date}</span>
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
              className={`mb-3 text-xl leading-tight font-black transition-colors duration-200 sm:text-2xl ${isLive ? 'text-[var(--paper-accent)]' : 'text-[var(--paper-text)]'} group-hover:text-[var(--paper-accent)]`}
            >
              {item.title}
            </h4>

            <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm font-bold text-[var(--paper-text-muted)] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin aria-hidden="true" size={14} className="text-[var(--paper-text-muted)]/60" /> {item.location || '未知地点'}
              </div>
              {item.boothCount && (
                <div className="flex items-center gap-2">
                  <Users aria-hidden="true" size={14} className="text-[var(--paper-text-muted)]/60" /> 预计 {item.boothCount} 摊位
                </div>
              )}
              {item.organizer && (
                <div className="flex items-center gap-2">
                  <Building2 aria-hidden="true" size={14} className="text-[var(--paper-text-muted)]/60" /> {item.organizer}
                </div>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1 text-[var(--paper-accent)] underline-offset-2 hover:underline ${FOCUS_RING}`}
                >
                  <ExternalLink aria-hidden="true" size={14} /> 官方网站
                </a>
              )}
            </div>

            <p className="mt-auto line-clamp-2 border-t border-dashed border-[var(--paper-border)]/10 pt-3 text-sm text-[var(--paper-text-muted)] italic break-words">
              {item.summary || '暂无详细摘要信息。'}
            </p>

            <div className="mt-4">
              <Link
                {...(detailTarget as any)}
                className={`inline-flex items-center gap-2 border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors duration-200 hover:bg-[var(--paper-border)] hover:text-[var(--paper-surface)] ${FOCUS_RING}`}
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
    <aside className="mt-8 flex flex-col border-dashed border-[var(--paper-border)]/20 lg:col-span-4 lg:mt-0 lg:border-l lg:pl-10" aria-label="检索与索引">
      <div className="mb-8 -rotate-1 bg-[var(--paper-border)] p-3 text-[var(--paper-surface)]">
        <h2 className="flex items-center text-xl font-black uppercase tracking-[0.12em]">
          <Bookmark aria-hidden="true" className="mr-2 fill-current" /> 检索与索引
        </h2>
      </div>

      <div className="space-y-8">
        <section className="hidden lg:block">
          <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
            快速跳转 (Quick Jump)
          </h3>
          <div className="flex flex-wrap gap-2">
            {months.map((month) => (
              <button
                key={month.key}
                type="button"
                onClick={() => scrollToMonthAnchor(month.key)}
                className={`border border-[var(--paper-border)] bg-[var(--paper-surface)] px-3 py-1.5 text-xs font-bold transition-colors duration-200 hover:bg-[var(--paper-border)] hover:text-[var(--paper-surface)] ${FOCUS_RING}`}
              >
                {month.label}
              </button>
            ))}
            {months.length === 0 && <span className="text-sm text-[var(--paper-text-muted)] italic">无可用月份</span>}
          </div>
        </section>

        <section>
          <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
            地区分布 (Region)
          </h3>
          <ul className="space-y-2 text-sm font-bold font-mono text-[var(--paper-text)]">
            <li className="flex items-center justify-between">
              <span>日本 (JAPAN)</span>
              <span className="border border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)] px-2 py-0.5 tabular-nums">{regionCounts.JAPAN}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>大陆 (CN_MAINLAND)</span>
              <span className="border border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)] px-2 py-0.5 tabular-nums">{regionCounts.CN_MAINLAND}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>海外 (OVERSEAS)</span>
              <span className="border border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)] px-2 py-0.5 tabular-nums">{regionCounts.OVERSEAS}</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
            热门标签 (Tags)
          </h3>
          <div className="flex flex-wrap gap-2">
            {['#东方Project', '#Only', '#同人志即卖会', '#Live', '#交响乐'].map((tag) => (
              <Link
                key={tag}
                to="/events"
                className={`text-xs font-bold text-[var(--paper-accent)] underline-offset-2 transition-colors duration-200 hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-8 border-4 border-[var(--paper-border)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] p-4">
          <div className="absolute right-0 top-0 bg-[var(--paper-border)] px-1 text-[10px] font-bold uppercase text-[var(--paper-surface)]">AD</div>
          <h4 className="mb-2 text-lg font-black text-[var(--paper-text)]">社团入驻开放中</h4>
          <p className="mb-4 text-sm leading-relaxed text-[var(--paper-text-muted)] italic">
            想要在幻想乡日程表上展示您的社团信息吗？现在就申请入驻，获取专属展示页面。
          </p>
          <Link
            to="/circles"
            className={`block w-full bg-[var(--paper-border)] py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-[var(--paper-surface)] transition-colors duration-200 hover:bg-[var(--paper-accent)] ${FOCUS_RING}`}
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
    <section className="sticky top-[var(--aya-header-height-compact,46px)] z-30 -mx-4 mb-8 border-y border-[var(--paper-border)]/15 bg-[var(--paper-bg)]/95 px-4 py-2 backdrop-blur-sm lg:hidden">
      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">快速跳转</div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {months.map((month) => (
          <button
            key={month.key}
            type="button"
            onClick={() => scrollToMonthAnchor(month.key)}
            className={`shrink-0 whitespace-nowrap border border-[var(--paper-border)] bg-[var(--paper-surface)] px-3 py-1.5 text-xs font-bold transition-colors duration-200 hover:bg-[var(--paper-border)] hover:text-[var(--paper-surface)] ${FOCUS_RING}`}
          >
            {month.label}
          </button>
        ))}
      </div>
    </section>
  );
};
