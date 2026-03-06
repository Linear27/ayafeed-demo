export const LandingRoleEntry = () => (
  <section id="landing-role-entry" className="border-2 border-[var(--paper-border)] bg-[var(--paper-surface)] p-5 paper-shadow-sm">
    <div className="mb-4">
      <h2 className="text-2xl font-black text-[var(--paper-text)]">从你的角色开始</h2>
      <p className="mt-2 text-sm leading-7 text-[var(--paper-muted)]">无论你是观众、社团还是主办，都可以从首页快速进入对应入口。</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <article className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4">
        <div className="text-sm font-black text-[var(--paper-text)]">我是观众</div>
        <p className="mt-2 text-sm leading-7 text-[var(--paper-muted)]">先看近期展会、演出与地区焦点，快速开始检索。</p>
        <a href="/events" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
          开始检索
        </a>
      </article>
      <article className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4">
        <div className="text-sm font-black text-[var(--paper-text)]">我是社团</div>
        <p className="mt-2 text-sm leading-7 text-[var(--paper-muted)]">了解资料展示方式、收录范围与首页推荐的呈现路径。</p>
        <a href="/circles" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
          查看社团入驻
        </a>
      </article>
      <article className="border border-[var(--paper-border)]/15 bg-[var(--paper-bg)] p-4">
        <div className="text-sm font-black text-[var(--paper-text)]">我是主办</div>
        <p className="mt-2 text-sm leading-7 text-[var(--paper-muted)]">提交活动情报，帮助 AyaFeed 更快完成公开整理和首页露出。</p>
        <a href="/feedback" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--paper-accent)] underline-offset-4 hover:underline">
          提交活动情报
        </a>
      </article>
    </div>
  </section>
);

export default LandingRoleEntry;
