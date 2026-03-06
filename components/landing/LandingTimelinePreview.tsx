import type { TimelineItem } from '../../types';

const monthKeyFromDate = (date: string) => date.slice(0, 7);

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  return `${year} 年 ${Number(month)} 月`;
};

const scrollToMonthAnchor = (monthKey: string) => {
  const target = document.getElementById(`landing-month-${monthKey}`);
  if (!target) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
};

const detailHref = (item: TimelineItem) =>
  item.type === 'event' ? `/events/${item.slug}` : `/lives/${item.slug}`;

const formatDateLabel = (date: string) =>
  new Date(`${date}T00:00:00+08:00`).toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  });

export const LandingTimelinePreview = ({ items }: { items: TimelineItem[] }) => {
  const monthKeys = Array.from(new Set(items.map((item) => monthKeyFromDate(item.date))));
  const renderedAnchors = new Set<string>();

  return (
    <section id="landing-timeline-preview" className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 paper-shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--paper-text)]">精简版时间轴</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--paper-muted)]">首页只保留近期预览，完整档期与历史信息请进入完整列表继续查看。</p>
        </div>
        <div>
          <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">快速跳转</div>
          <div className="flex flex-wrap gap-2">
            {monthKeys.map((monthKey) => (
              <button
                key={monthKey}
                type="button"
                onClick={() => scrollToMonthAnchor(monthKey)}
                className="inline-flex min-h-11 items-center px-2 text-[var(--paper-muted)] border border-[var(--paper-border)]/20 bg-[var(--paper-bg)] text-sm font-bold transition-colors hover:bg-[var(--paper-hover)]"
              >
                {formatMonthLabel(monthKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const monthKey = monthKeyFromDate(item.date);
          const anchorId = renderedAnchors.has(monthKey) ? undefined : `landing-month-${monthKey}`;
          renderedAnchors.add(monthKey);

          return (
            <a
              key={item.id}
              id={anchorId}
              href={detailHref(item)}
              className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4 transition-colors hover:bg-[var(--paper-hover)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex min-h-11 items-center rounded-sm px-2 text-xs font-bold text-[var(--paper-accent)] border border-[var(--paper-accent)]/20 bg-[var(--paper-surface)]">
                  {item.type === 'live' ? '演出预览' : '展会预览'}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">{formatDateLabel(item.date)}</span>
              </div>
              <h3 className="mt-3 text-lg font-black text-[var(--paper-text)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--paper-muted)]">{item.location ?? '地点整理中'}</p>
            </a>
          );
        })}
      </div>

      <div className="mt-5 border-t border-dashed border-[var(--paper-border)]/20 pt-5">
        <a href="/events" className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-4 py-2 text-sm font-black text-[var(--paper-surface)] transition-colors hover:bg-[var(--paper-accent)]">
          进入完整时间轴 / 历史归档
        </a>
      </div>
    </section>
  );
};

export default LandingTimelinePreview;
