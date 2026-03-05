import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Calendar,
  ArrowRight,
  Library,
  ImageOff,
  Radio,
  Clock,
  Bookmark,
  ExternalLink,
  Building2,
  Users,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { PreferredRegion, TimelineItem } from '../types';
import { diffCalendarDays } from '../services/date';
import { rankHeroItems } from '../services/landingHero';
import { buildRegionDistribution } from '../services/landingRegions';
import { getScrapbookCardInteractionPolicy } from '../services/scrapbookCardPolicy';
import { buildUnsplashSrcSet } from '../services/responsiveImage';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--paper-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper-bg)]';

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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
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

const PosterFallback: React.FC<{ title: string; compact?: boolean }> = ({ title, compact = false }) => (
  <div
    role="img"
    aria-label={`${title} 暂无海报`}
    className={`flex h-full w-full flex-col items-center justify-center bg-[var(--paper-bg-secondary)] text-[var(--paper-text-muted)] ${
      compact ? 'gap-1' : 'gap-2'
    }`}
  >
    <ImageOff aria-hidden="true" size={compact ? 16 : 24} className="opacity-65" />
    {!compact ? (
      <span className="text-xs font-bold tracking-[0.12em] text-[var(--paper-text-muted)]/80">
        暂无海报
      </span>
    ) : null}
  </div>
);

const PosterImage: React.FC<{
  src: string | null | undefined;
  alt: string;
  title: string;
  className: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'high' | 'low' | 'auto';
  compactFallback?: boolean;
  sizes?: string;
}> = ({
  src,
  alt,
  title,
  className,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  compactFallback = false,
  sizes = '100vw',
}) => {
  const [hasError, setHasError] = useState(false);
  const srcSet = buildUnsplashSrcSet(src);

  if (!src || hasError) {
    return <PosterFallback title={title} compact={compactFallback} />;
  }

  const handleError = () => setHasError(true);

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      fetchPriority={fetchPriority}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      className={className}
    />
  );
};

/**
 * 1. Bento Header 组件 - 动态功能头版
 */
export const BentoHeader: React.FC<{
  items: TimelineItem[];
  region: PreferredRegion;
  todayDateKey: string;
}> = ({ items, region: _region, todayDateKey: _todayDateKey }) => {
  const rankedItems = rankHeroItems(items);
  const mainItem = rankedItems[0];
  const secondaryItems = rankedItems.slice(1, 3);

  if (!mainItem) {
    return (
      <section className="mx-auto max-w-7xl" aria-labelledby="landing-feature-heading">
        <div className="relative overflow-hidden border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-xl)] shadow-[var(--paper-shadow-lg)] sm:p-[var(--space-xl)]">
          <Tape className="left-8 top-0 w-24" rotate={-3} />
          <div className="absolute -right-8 -top-10 opacity-5" aria-hidden="true">
            <Library size={180} />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[var(--paper-text-muted)]">情报待更新</div>
            <h2 id="landing-feature-heading" className="text-3xl leading-tight font-black text-[var(--paper-text)] sm:text-4xl">
              号外：近期暂无头条情报
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-[var(--paper-text-muted)] italic">
              编辑部正在加紧取材中。你可以先浏览现有名录，或向编辑部提交新的活动线索。
            </p>

            <div className="mt-[var(--space-lg)] flex flex-col gap-[var(--space-sm)] sm:flex-row">
              <Link
                to="/events"
                id="landing-primary-cta"
                className={`inline-flex items-center justify-center gap-[var(--space-sm)] border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-[var(--space-lg)] py-[var(--space-sm)] text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-surface)] transition-colors duration-200 hover:bg-[var(--paper-accent)] active:bg-[var(--paper-active)] ${FOCUS_RING}`}
              >
                浏览展会名录 <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link
                to="/feedback"
                className={`inline-flex items-center justify-center gap-[var(--space-sm)] border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-[var(--space-lg)] py-[var(--space-sm)] text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-text)] transition-colors duration-200 hover:bg-[var(--paper-hover)] active:bg-[var(--paper-active)] ${FOCUS_RING}`}
              >
                提交活动情报 <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const mainIsFeatured = mainItem.type === 'event' && mainItem.featured === true;

  const mainTarget = getDetailTarget(mainItem);

  return (
    <section className="mx-auto max-w-7xl" aria-labelledby="landing-feature-heading">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <article className="group relative min-h-[420px] overflow-hidden border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] shadow-[var(--paper-shadow-lg)] lg:col-span-12">
          <Tape className="left-1/2 top-0 w-32 -translate-x-1/2" rotate={1} />
          <div className="flex h-full flex-col md:flex-row">
            <div className="relative flex items-center justify-center overflow-hidden border-b-4 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] p-4 md:w-1/2 md:border-b-0 md:border-r-4">
              <PosterImage
                src={mainItem.image}
                alt={mainItem.title}
                title={mainItem.title}
                width={720}
                height={960}
                fetchPriority="high"
                loading="eager"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="relative z-10 h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
              {mainItem.image && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/12 via-transparent to-black/16 opacity-45"
                />
              )}
              {mainItem.image && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(26,26,26,0.12)_1px,transparent_1px)] [background-size:9px_9px] opacity-20"
                />
              )}
              {mainItem.isToday && (
                <div className="absolute left-4 top-4 z-30">
                  <Stamp text="TODAY" rotate={-10} className="bg-[var(--paper-surface)]/85 px-4 py-2 text-base" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between p-[var(--space-lg)] md:w-1/2 md:p-[var(--space-xl)]" style={{ backgroundImage: 'var(--paper-fibers)' }}>
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-[var(--paper-accent)] px-2 py-0.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--paper-surface)]">
                    {mainIsFeatured ? '重点活动' : mainItem.isToday ? '今日头条' : '近期焦点'}
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">
                    {mainItem.type === 'live' ? 'LIVE BRIEF' : 'EVENT BRIEF'}
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
                id="landing-primary-cta"
                className={`inline-flex w-full items-center justify-center gap-[var(--space-sm)] border-2 border-[var(--paper-border)] bg-[var(--paper-border)] py-[var(--space-sm)] text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-surface)] transition-colors duration-200 hover:bg-[var(--paper-accent)] active:bg-[var(--paper-active)] ${FOCUS_RING}`}
              >
                查看详细情报 <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </article>

        {secondaryItems.length > 0 && (
          <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-12">
            {secondaryItems.map((item) => (
              <Link
                key={item.id}
                {...(getDetailTarget(item) as any)}
                className={`group flex gap-[var(--space-md)] border border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-md)] shadow-[var(--paper-shadow-sm)] transition-[background-color,box-shadow,border-color] duration-200 hover:border-[var(--paper-accent)] hover:bg-[var(--paper-hover)] hover:shadow-[var(--paper-shadow-md)] ${FOCUS_RING}`}
              >
                <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden border border-[var(--paper-border)] bg-[var(--paper-bg-secondary)]">
                  <PosterImage
                    src={item.image}
                    alt={item.title}
                    title={item.title}
                    width={240}
                    height={320}
                    compactFallback
                    sizes="80px"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`border border-[var(--paper-border)] px-1 py-0.5 text-[11px] font-black ${item.type === 'live' ? 'bg-[var(--paper-live-bg)] text-[var(--paper-live-text)]' : 'bg-[var(--paper-border)] text-[var(--paper-surface)]'}`}
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
      title: '今日情报 / TODAY',
      items: todayItems,
      icon: <Radio aria-hidden="true" size={22} className="text-[var(--paper-accent)]" />,
    },
    {
      id: 'this-week',
      title: '本周焦点 / THIS WEEK',
      items: thisWeekItems,
      icon: <Calendar aria-hidden="true" size={22} className="text-[var(--paper-text)]" />,
    },
    {
      id: 'upcoming',
      title: '即将到来 / UPCOMING',
      items: upcomingItems,
      icon: <Clock aria-hidden="true" size={22} className="text-[var(--paper-muted)]" />,
    },
  ].filter((section) => section.items.length > 0);

  const anchoredMonths = new Set<string>();

  return (
    <div className="flex flex-col" id="timeline-root">
      <div className="relative mb-12 flex items-center gap-[var(--space-sm)]">
        <Library aria-hidden="true" className="shrink-0 text-[var(--paper-accent)]" size={32} />
        <h2 className="text-3xl font-black tracking-tight text-[var(--paper-text)] sm:text-4xl uppercase">幻想乡活动时间轴</h2>
        <div className="absolute -bottom-2 left-0 h-1 w-full bg-[var(--paper-border)]/5" aria-hidden="true"></div>
      </div>

      <div className="space-y-20">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.title} className="relative" aria-label={section.title}>
              <div
                className={`mb-8 flex items-center justify-between border-y-2 border-[var(--paper-border)] bg-[var(--paper-bg)]/95 px-[var(--space-lg)] py-[var(--space-sm)] shadow-[var(--paper-shadow-sm)] ${
                  section.id === 'upcoming' ? '' : 'lg:sticky lg:top-[calc(var(--aya-header-height-compact,46px)+12px)]'
                }`}
              >
                <div className="flex items-center gap-[var(--space-sm)]">
                  {section.icon}
                  <h3 className="text-2xl font-black tracking-tight sm:text-3xl uppercase">{section.title}</h3>
                </div>
                <div className="bg-[var(--paper-border)] px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--paper-surface)] tabular-nums">
                  {section.items.length} 条目
                </div>
              </div>

              <div className="relative ml-[var(--space-sm)] flex flex-col gap-[var(--space-xl)] border-l-4 border-[var(--paper-border)]/10 pl-[var(--space-xl)]">
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
          <div className="relative overflow-hidden border-4 border-dashed border-[var(--paper-border)]/20 bg-[var(--paper-surface)]/60 p-[var(--space-xl)] text-center">
            <div className="absolute -right-10 -top-10 rotate-12 opacity-5" aria-hidden="true">
              <Library size={200} />
            </div>
            <div className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[var(--paper-text-muted)]">暂无档期 / ARCHIVE EMPTY</div>
            <h3 className="mb-4 text-2xl font-black text-[var(--paper-text)]">暂无可展示的日程条目</h3>
            <p className="mx-auto max-w-[50ch] text-base leading-relaxed text-[var(--paper-text-muted)] italic">
              当前频道没有未来排期的活动条目。文文新闻编辑部正在加紧取材中，请稍后再来。
            </p>
          </div>
        )}

        <div className="mt-[var(--space-xl)] border-t-4 border-double border-[var(--paper-border)]/20 pt-[var(--space-xl)]">
          <Link
            to="/events"
            className={`flex w-full items-center justify-center gap-[var(--space-sm)] border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] py-[var(--space-lg)] text-base font-black uppercase tracking-[0.28em] shadow-[var(--paper-shadow-lg)] transition-[background-color,color,transform,box-shadow] duration-200 hover:bg-[var(--paper-hover)] active:translate-y-1 active:bg-[var(--paper-active)] active:shadow-none ${FOCUS_RING}`}
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
  const interactionPolicy = getScrapbookCardInteractionPolicy(item);

  return (
    <article id={anchorId} className="group relative scroll-mt-28" aria-labelledby={`timeline-title-${item.id}`}>
      <div
        aria-hidden="true"
        className="absolute -left-[38px] top-8 z-10 h-4 w-4 rounded-full border-4 border-[var(--paper-border)] bg-[var(--paper-surface)] transition-colors duration-200 group-hover:bg-[var(--paper-accent)]"
      />

      {index === 0 && <Tape className="-top-3 left-10" rotate={-5} />}

      <div
        className={`relative border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-md)] shadow-[var(--paper-shadow-md)] transition-[box-shadow,border-color] duration-200 hover:border-[var(--paper-accent)] hover:shadow-[var(--paper-shadow-lg)] ${isLive ? 'bg-[var(--paper-accent)]/5' : ''}`}
      >
        <div className="flex flex-col gap-[var(--space-lg)] md:flex-row">
          <div className="relative flex h-44 w-full shrink-0 items-center justify-center overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-bg-secondary)] md:w-32">
            <PosterImage
              src={item.image}
              alt={item.title}
              title={item.title}
              width={320}
              height={440}
              compactFallback
              sizes="(min-width: 768px) 128px, 100vw"
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {item.isToday && <div className="pointer-events-none absolute inset-0 bg-[var(--paper-accent)]/10" aria-hidden="true"></div>}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-[var(--space-sm)] flex flex-wrap items-center gap-[var(--space-sm)]">
              <span
                className={`border border-[var(--paper-border)] px-2 py-0.5 text-xs font-black uppercase tracking-[0.12em] ${isLive ? 'bg-[var(--paper-live-bg)] text-[var(--paper-live-text)]' : 'bg-[var(--paper-border)] text-[var(--paper-surface)]'}`}
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
              {interactionPolicy.primaryCta === 'title-link' ? (
                <Link
                  {...(detailTarget as any)}
                  className={`inline underline-offset-2 transition-colors duration-200 hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}
                >
                  {item.title}
                </Link>
              ) : (
                item.title
              )}
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
  todayDateKey: string;
  stats: {
    totalEvents: number;
    todayCount: number;
    thisWeekCount: number;
    updateCount: number;
  };
}> = ({ items, todayDateKey, stats }) => {
  const months = useMemo(() => buildMonthIndex(items), [items]);
  const rankedItems = useMemo(() => rankHeroItems(items), [items]);
  const mainItemId = rankedItems[0]?.id;
  const nextMajor = useMemo(
    () => rankedItems.find((item) => item.id !== mainItemId && !item.isToday),
    [rankedItems, mainItemId],
  );
  const daysLeft = nextMajor
    ? Math.max(0, diffCalendarDays(todayDateKey, nextMajor.date))
    : null;

  const regionCounts = useMemo(() => buildRegionDistribution(items), [items]);

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
                className={`border border-[var(--paper-border)] bg-[var(--paper-surface)] px-[var(--space-sm)] py-[var(--space-xs)] text-xs font-bold transition-colors duration-200 hover:bg-[var(--paper-hover)] active:bg-[var(--paper-active)] ${FOCUS_RING}`}
              >
                {month.label}
              </button>
            ))}
            {months.length === 0 && <span className="text-sm text-[var(--paper-text-muted)] italic">无可用月份</span>}
          </div>
        </section>

        <section>
          <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
            情报统计 / Stats
          </h3>
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
              <div className="text-xs font-bold uppercase text-[var(--paper-text-muted)]">7日新增</div>
              <div className="text-xl font-black tabular-nums text-[var(--paper-text)]">{stats.updateCount}</div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--paper-text-muted)]">统计口径：按活动开始日期计算近 7 天新增条目</p>
        </section>

        {nextMajor && (
          <section>
            <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
              下个重点活动 / Next
            </h3>
            <Link
              {...(getDetailTarget(nextMajor) as any)}
                className={`group relative block overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-[var(--space-md)] text-[var(--paper-text)] shadow-[var(--paper-shadow-sm)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[var(--paper-accent)] hover:shadow-[var(--paper-shadow-md)] ${FOCUS_RING}`}
            >
              <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-5 transition-transform duration-200 group-hover:scale-110">
                <Clock aria-hidden="true" size={110} />
              </div>
              <div className="relative z-10">
                <div className="mb-1 text-3xl leading-none font-black tracking-tight text-[var(--paper-text)]">
                  {daysLeft === 0 ? 'TODAY' : `${daysLeft} DAYS`}
                </div>
                <div className="line-clamp-1 text-sm font-bold text-[var(--paper-text-muted)]">{nextMajor.title}</div>
                <div className="mt-1 text-xs font-bold text-[var(--paper-text-muted)]">{nextMajor.date}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--paper-accent)]">
                  查看情报 <ArrowRight aria-hidden="true" size={14} />
                </div>
              </div>
            </Link>
          </section>
        )}

        <section>
          <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
            相关入口 / Paths
          </h3>
          <div className="flex flex-wrap gap-[var(--space-sm)] text-xs font-bold">
            <Link
              to="/events"
                className={`inline-flex min-h-11 items-center px-2 text-[var(--paper-muted)] underline-offset-2 transition-colors duration-200 hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}
            >
              浏览展会名录
            </Link>
            <Link
              to="/feedback"
                className={`inline-flex min-h-11 items-center px-2 text-[var(--paper-muted)] underline-offset-2 transition-colors duration-200 hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}
            >
              提交活动情报
            </Link>
          </div>
        </section>

        <section>
          <h3 className="mb-3 border-b border-[var(--paper-border)]/20 pb-1 text-sm font-black uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
            地区分布 (Region)
          </h3>
          <ul className="space-y-2 text-sm font-bold font-mono text-[var(--paper-text)]">
            {regionCounts.length > 0 ? (
              regionCounts.map((row) => (
                <li key={row.key} className="flex items-center justify-between">
                  <span>{row.label}</span>
                  <span className="border border-[var(--paper-border)]/20 bg-[var(--paper-bg-secondary)] px-2 py-0.5 tabular-nums">
                    {row.count}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-[var(--paper-text-muted)] italic">暂无地区数据</li>
            )}
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
                className={`inline-flex min-h-11 items-center rounded-sm px-2 text-xs font-bold text-[var(--paper-accent)] underline-offset-2 transition-colors duration-200 hover:bg-[var(--paper-hover)] hover:text-[var(--paper-accent)] hover:underline ${FOCUS_RING}`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-8 border-4 border-[var(--paper-border)] p-4" style={{ backgroundImage: 'var(--paper-cubes)' }}>
          <div className="absolute right-0 top-0 bg-[var(--paper-border)] px-1 text-[11px] font-bold uppercase text-[var(--paper-surface)]">AD</div>
          <h4 className="mb-2 text-lg font-black text-[var(--paper-text)]">社团入驻开放中</h4>
          <p className="mb-4 text-sm leading-relaxed text-[var(--paper-text-muted)] italic">
            想要在幻想乡日程表上展示您的社团信息吗？现在就申请入驻，获取专属展示页面。
          </p>
          <Link
            to="/circles"
            className={`flex min-h-11 w-full items-center justify-center bg-[var(--paper-border)] py-[var(--space-sm)] text-center text-xs font-bold uppercase tracking-[0.12em] text-[var(--paper-surface)] transition-colors duration-200 hover:bg-[var(--paper-accent)] active:bg-[var(--paper-active)] ${FOCUS_RING}`}
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
      <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">快速跳转</div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {months.map((month) => (
          <button
            key={month.key}
            type="button"
            onClick={() => scrollToMonthAnchor(month.key)}
            className={`min-h-11 shrink-0 whitespace-nowrap border border-[var(--paper-border)] bg-[var(--paper-surface)] px-[var(--space-md)] py-[var(--space-sm)] text-xs font-bold transition-colors duration-200 hover:bg-[var(--paper-hover)] active:bg-[var(--paper-active)] ${FOCUS_RING}`}
          >
            {month.label}
          </button>
        ))}
      </div>
    </section>
  );
};
