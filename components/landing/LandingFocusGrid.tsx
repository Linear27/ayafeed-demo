import type { LandingHomepageModel } from '../../services/landingHomepage';
import type { TimelineItem } from '../../types';

const detailHref = (item: TimelineItem) =>
  item.type === 'event' ? `/events/${item.slug}` : `/lives/${item.slug}`;

const formatDateLabel = (date: string) =>
  new Date(`${date}T00:00:00+08:00`).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });

type LandingStats = {
  totalEvents: number;
  todayCount: number;
  thisWeekCount: number;
  updateCount: number;
};

type LandingFocusGridProps = {
  focusItems: TimelineItem[];
  stats: LandingStats;
  quickRail: LandingHomepageModel['quickRail'];
};

export const LandingFocusGrid = ({ focusItems, stats, quickRail }: LandingFocusGridProps) => {
  const sectionTitle = focusItems.some((item) => item.isToday) ? '今日进行中' : '本周焦点';

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
      <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 paper-shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[var(--paper-text)]">{sectionTitle}</h2>
          <a href="/events" className="text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
            查看详情
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {focusItems.slice(0, 2).map((item) => (
            <a key={item.id} href={detailHref(item)} className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4 transition-colors hover:bg-[var(--paper-hover)]">
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">
                {item.isToday ? '今日进行中' : '本周焦点'}
              </div>
              <h3 className="mt-2 text-lg font-black text-[var(--paper-text)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--paper-muted)]">{item.location ?? '地点整理中'}</p>
              <div className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">{formatDateLabel(item.date)}</div>
            </a>
          ))}
          {focusItems.length === 0 ? (
            <div className="border border-dashed border-[var(--paper-border)]/25 bg-[var(--paper-bg)] p-4 text-sm text-[var(--paper-text-muted)] md:col-span-2">
              本周焦点整理中，稍后会补齐重点档期和推荐卡片。
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-4 paper-shadow-sm">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">本周统计</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-3">
              <div className="text-xs text-[var(--paper-text-muted)]">已收录</div>
              <div className="mt-1 text-2xl font-black text-[var(--paper-text)]">{stats.totalEvents}</div>
            </div>
            <div className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-3">
              <div className="text-xs text-[var(--paper-text-muted)]">本周新增</div>
              <div className="mt-1 text-2xl font-black text-[var(--paper-text)]">{stats.updateCount}</div>
            </div>
            <div className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-3">
              <div className="text-xs text-[var(--paper-text-muted)]">今日进行中</div>
              <div className="mt-1 text-2xl font-black text-[var(--paper-text)]">{stats.todayCount}</div>
            </div>
            <div className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-3">
              <div className="text-xs text-[var(--paper-text-muted)]">本周焦点</div>
              <div className="mt-1 text-2xl font-black text-[var(--paper-text)]">{stats.thisWeekCount}</div>
            </div>
          </div>
        </div>

        <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-4 paper-shadow-sm">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">下一场重点活动</div>
          <div className="mt-3 text-lg font-black text-[var(--paper-text)]">{quickRail.nextMajor?.title ?? '正在整理近期重点档期'}</div>
          <div className="mt-2 text-sm text-[var(--paper-muted)]">
            {quickRail.daysLeft === null ? '稍后补充日期。' : `距离开始还有 ${quickRail.daysLeft} 天。`}
          </div>
          <a href={quickRail.nextMajor ? detailHref(quickRail.nextMajor) : '/events'} className="mt-4 inline-flex text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
            查看详情
          </a>
        </div>

        <div className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-4 paper-shadow-sm">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">收录说明 / 最新更新</div>
          <p className="mt-3 text-sm leading-7 text-[var(--paper-muted)]">了解 AyaFeed 的收录范围、来源处理方式，以及首页更新频率说明。</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a href="/#footer-trust" className="text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
              查看收录规则
            </a>
            <a href="/#footer-sources" className="text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
              查看更新
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFocusGrid;
