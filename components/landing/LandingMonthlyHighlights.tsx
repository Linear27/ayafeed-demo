import type { TimelineItem } from '../../types';

const detailHref = (item: TimelineItem) =>
  item.type === 'event' ? `/events/${item.slug}` : `/lives/${item.slug}`;

export const LandingMonthlyHighlights = ({ items }: { items: TimelineItem[] }) => (
  <section className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 paper-shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-2xl font-black text-[var(--paper-text)]">本月重点档期</h2>
      <a href="/events" className="text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
        查看详情
      </a>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.slice(0, 4).map((item) => (
        <a key={item.id} href={detailHref(item)} className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4 transition-colors hover:bg-[var(--paper-hover)]">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">Monthly Highlight</div>
          <h3 className="mt-2 text-lg font-black text-[var(--paper-text)]">{item.title}</h3>
          <p className="mt-2 text-sm text-[var(--paper-muted)]">{item.summary ?? item.location ?? '近期档期整理中'}</p>
        </a>
      ))}
    </div>
  </section>
);

export default LandingMonthlyHighlights;
