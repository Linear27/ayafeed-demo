import type { TimelineItem } from '../../types';

const UPDATE_LABELS = ['新收录活动', '新收录演出', '新收录社团', '信息变更'];

const detailHref = (item: TimelineItem) =>
  item.type === 'event' ? `/events/${item.slug}` : `/lives/${item.slug}`;

export const LandingUpdates = ({ items }: { items: TimelineItem[] }) => (
  <section className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 paper-shadow-sm">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-2xl font-black text-[var(--paper-text)]">最近更新 / Recently Added</h2>
      <a href="/#footer-sources" className="text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
        查看更新
      </a>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.slice(0, 4).map((item, index) => (
        <a key={item.id} href={detailHref(item)} className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4 transition-colors hover:bg-[var(--paper-hover)]">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-accent)]">{UPDATE_LABELS[index] ?? '新收录'}</div>
          <h3 className="mt-2 text-lg font-black text-[var(--paper-text)]">{item.title}</h3>
          <p className="mt-2 text-sm text-[var(--paper-muted)]">{item.location ?? item.summary ?? '补充信息同步中'}</p>
        </a>
      ))}
    </div>
  </section>
);

export default LandingUpdates;
