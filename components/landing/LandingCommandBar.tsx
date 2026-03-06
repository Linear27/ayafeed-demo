import { Link } from '@tanstack/react-router';
import { PreferredRegion } from '../../types';

const REGION_LABELS: Record<PreferredRegion, string> = {
  GLOBAL: '全部地区',
  JAPAN: '日本',
  CN_MAINLAND: '中国大陆',
  OVERSEAS: '海外',
};

export const LandingCommandBar = ({ region }: { region: PreferredRegion }) => (
  <section id="landing-command-bar" aria-label="首页检索入口" className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-4 paper-shadow-sm">
    <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]" onSubmit={(event) => event.preventDefault()}>
      <label className="sr-only" htmlFor="landing-command-search">
        搜索活动 / 社团 / 地点
      </label>
      <input
        id="landing-command-search"
        name="landing-command-search"
        placeholder="搜索活动 / 社团 / 地点"
        autoComplete="off"
        className="min-h-11 border-2 border-[var(--paper-border)] bg-[var(--paper-bg)] px-4 py-2 text-sm text-[var(--paper-text)] outline-none placeholder:text-[var(--paper-text-muted)]"
      />
      <button type="button" className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-hover)] px-4 py-2 text-sm font-bold text-[var(--paper-text)]">
        地区 · {REGION_LABELS[region]}
      </button>
      <button type="button" className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-hover)] px-4 py-2 text-sm font-bold text-[var(--paper-text)]">
        月份
      </button>
      <button type="button" className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-hover)] px-4 py-2 text-sm font-bold text-[var(--paper-text)]">
        类型
      </button>
      <Link
        to="/events"
        className="inline-flex min-h-11 items-center justify-center border-2 border-[var(--paper-border)] bg-[var(--paper-border)] px-4 py-2 text-sm font-black text-[var(--paper-surface)] transition-colors hover:bg-[var(--paper-accent)]"
      >
        查看全部
      </Link>
    </form>
  </section>
);

export default LandingCommandBar;
