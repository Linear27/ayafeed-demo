import { PreferredRegion, TimelineItem } from '../../types';

const REGION_LABELS: Record<PreferredRegion, string> = {
  GLOBAL: '全站视角',
  JAPAN: '日本',
  CN_MAINLAND: '中国大陆',
  OVERSEAS: '海外',
};

const formatDateLabel = (date: string) =>
  new Date(`${date}T00:00:00+08:00`).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

const detailHref = (item: TimelineItem) =>
  item.type === 'event' ? `/events/${item.slug}` : `/lives/${item.slug}`;

type LandingHeroProps = {
  hero: {
    main: TimelineItem | null;
    secondary: TimelineItem[];
  };
  updates: TimelineItem[];
  region: PreferredRegion;
};

export const LandingHero = ({ hero, updates, region }: LandingHeroProps) => {
  const main = hero.main;

  return (
    <section aria-labelledby="landing-hero-title" className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 paper-shadow-md sm:p-6 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--paper-text-muted)]">
              本周头条 / Editor's Pick
            </div>
            <h1 id="landing-hero-title" className="max-w-[16ch] text-4xl font-black leading-tight text-[var(--paper-text)] sm:text-5xl">
              最快找到近期东方同人展、演出与社团情报
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--paper-muted)] sm:text-base">
              按地区、时间与类型快速检索，也可提交活动与社团信息，进入 AyaFeed 收录体系。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              id="landing-primary-cta"
              href="/events"
              className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-4 py-2 text-sm font-black text-[var(--paper-surface)] transition-colors hover:bg-[var(--paper-accent)]"
            >
              浏览近期活动
            </a>
            <a
              href="#landing-command-bar"
              className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-hover)] px-4 py-2 text-sm font-bold text-[var(--paper-text)] transition-colors hover:bg-[var(--paper-active)]"
            >
              按地区检索
            </a>
            <a
              href="/feedback"
              className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] px-4 py-2 text-sm font-bold text-[var(--paper-text)] transition-colors hover:bg-[var(--paper-hover)]"
            >
              提交活动情报
            </a>
          </div>

          <div className="inline-flex items-center gap-2 border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--paper-text-muted)]">
            <span>当前视角</span>
            <span className="text-[var(--paper-text)]">{REGION_LABELS[region]}</span>
          </div>
        </div>

        <article className="grid gap-4">
          <a
            href={main ? detailHref(main) : '/events'}
            className="group relative overflow-hidden border-2 border-[var(--paper-border)] bg-[var(--paper-bg)] p-4 paper-shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--paper-text-muted)]">
              <span>Editor&apos;s Pick</span>
              <span className="inline-flex items-center border border-[var(--paper-border)]/20 bg-[var(--paper-surface)] px-2 py-1 text-[var(--paper-accent)]">
                {main?.type === 'live' ? '演出' : '展会'}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(180px,0.9fr)]">
              <div className="space-y-3">
                <h2 className="text-2xl font-black leading-tight text-[var(--paper-text)] sm:text-3xl">
                  {main?.title ?? '近期重点活动整理中'}
                </h2>
                <p className="text-sm leading-7 text-[var(--paper-muted)]">
                  {main?.summary ?? '我们会把近期最值得先看的展会、演出与社团情报排在首页第一屏。'}
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--paper-text-muted)]">
                  <span>{main ? formatDateLabel(main.date) : '即将更新'}</span>
                  <span>{main?.location ?? '地点待补充'}</span>
                </div>
              </div>
              <div className="min-h-56 border border-[var(--paper-border)]/15 bg-[var(--paper-surface)]">
                {main?.image ? (
                  <img src={main.image} alt={main.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]" />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold text-[var(--paper-text-muted)]">
                    AyaFeed 焦点档期卡片
                  </div>
                )}
              </div>
            </div>
          </a>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {hero.secondary.map((item) => (
          <a key={item.id} href={detailHref(item)} className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4 transition-colors hover:bg-[var(--paper-hover)]">
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">Editor&apos;s Pick</div>
            <h3 className="mt-2 text-lg font-black text-[var(--paper-text)]">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--paper-muted)]">{item.location ?? '更多档期地点整理中'}</p>
          </a>
        ))}

        <div className="border border-[var(--paper-border)]/15 bg-[var(--paper-surface)] p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">最近更新</div>
          <div className="mt-3 space-y-3">
            {updates.slice(0, 2).map((item) => (
              <a key={item.id} href={detailHref(item)} className="block border-b border-dashed border-[var(--paper-border)]/20 pb-3 last:border-b-0 last:pb-0">
                <div className="text-sm font-bold text-[var(--paper-text)]">{item.title}</div>
                <div className="mt-1 text-xs text-[var(--paper-text-muted)]">{item.type === 'live' ? '演出整理' : '展会整理'} · {formatDateLabel(item.date)}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
