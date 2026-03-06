# Landing Redesign Implementation Plan


> **Status:** Implemented and archived on 2026-03-06.

**Goal:** Rebuild the AyaFeed homepage into an editorial landing page that explains the product in the first screen, exposes search/filter entry points early, and provides clear paths for viewers, circles, and organizers.

**Architecture:** Keep data fetching and `TimelineItem` adaptation inside `views/LandingView.tsx`, but move homepage presentation into focused landing modules under `components/landing/`. Add one new pure helper service to shape editorial sections (`focus`, `monthly highlights`, `updates`, `timeline preview`) so homepage ordering is testable without browser tooling. Extend the existing global shell (`components/Navbar.tsx`, `components/Footer.tsx`, `components/BrandLogo.tsx`) instead of creating a second site shell.

**Tech Stack:** React + TypeScript, TanStack Router, Framer Motion, pnpm, `node:test` via `tsx --test`, existing landing helper services in `services/`.

---

## Pre-flight Context

Before implementation, read these files for scope and current behavior:

- PRD: `docs/plans/archive/2026-03-06-landing-redesign-prd.md`
- Current landing view: `views/LandingView.tsx`
- Current landing sections: `components/LandingSections.tsx`
- Current header: `components/Navbar.tsx`
- Current footer: `components/Footer.tsx`
- Current brand symbol: `components/BrandLogo.tsx`
- Existing hero ordering helper: `services/landingHero.ts`
- Existing region helper: `services/landingRegions.ts`
- Existing regression tests: `tests/landing-mobile-ux-regression.test.ts`, `tests/landing-hero.test.ts`, `tests/landing-regions.test.ts`

Use `pnpm` only. Keep all copy and visuals within `theme-newspaper`.

## Task 1: Add homepage data-shaping helper

**Files:**
- Create: `services/landingHomepage.ts`
- Create: `tests/landing-homepage.test.ts`
- Modify: `views/LandingView.tsx`

**Step 1: Write the failing test**

Create `tests/landing-homepage.test.ts` with unit coverage for the new pure helper contract:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLandingHomepageModel } from '../services/landingHomepage';
import type { TimelineItem } from '../types';

const makeItem = (overrides: Partial<TimelineItem> & Pick<TimelineItem, 'id' | 'type' | 'date' | 'title'>): TimelineItem => ({
  id: overrides.id,
  type: overrides.type,
  date: overrides.date,
  title: overrides.title,
  location: overrides.location ?? null,
  image: overrides.image ?? null,
  slug: overrides.slug ?? overrides.id,
  isToday: overrides.isToday ?? false,
  isThisWeek: overrides.isThisWeek ?? false,
  marketRegion: overrides.marketRegion ?? 'JAPAN',
  summary: overrides.summary ?? null,
  status: overrides.status ?? 'UPCOMING',
  originalData: overrides.originalData ?? ({ id: overrides.id } as any),
  boothCount: overrides.boothCount,
  organizer: overrides.organizer,
  website: overrides.website,
  featured: overrides.featured,
  featuredOrder: overrides.featuredOrder ?? null,
});

test('buildLandingHomepageModel should expose hero, focus, monthly, updates and preview collections', () => {
  const model = buildLandingHomepageModel([
    makeItem({ id: 'featured-a', type: 'event', date: '2026-04-12', title: 'Featured A', featured: true, isThisWeek: true }),
    makeItem({ id: 'focus-b', type: 'event', date: '2026-04-20', title: 'Focus B', isThisWeek: true }),
    makeItem({ id: 'preview-c', type: 'live', date: '2026-05-01', title: 'Preview C' }),
    makeItem({ id: 'preview-d', type: 'event', date: '2026-05-04', title: 'Preview D' }),
  ], '2026-03-06');

  assert.equal(model.hero.main.id, 'featured-a');
  assert.ok(model.focusItems.length >= 1);
  assert.ok(model.monthlyHighlights.length >= 1);
  assert.ok(model.timelinePreview.length >= 1);
  assert.ok(model.quickRail.nextMajor);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-homepage.test.ts`
Expected: FAIL because `services/landingHomepage.ts` does not exist yet.

**Step 3: Write minimal implementation**

Create `services/landingHomepage.ts` and export a pure helper with a stable return shape:

```ts
import type { TimelineItem } from '../types';
import { diffCalendarDays } from './date';
import { rankHeroItems } from './landingHero';

export type LandingHomepageModel = {
  hero: { main: TimelineItem | null; secondary: TimelineItem[] };
  focusItems: TimelineItem[];
  monthlyHighlights: TimelineItem[];
  updates: TimelineItem[];
  timelinePreview: TimelineItem[];
  quickRail: {
    nextMajor: TimelineItem | null;
    daysLeft: number | null;
  };
};

export const buildLandingHomepageModel = (items: TimelineItem[], todayDateKey: string): LandingHomepageModel => {
  const ranked = rankHeroItems(items);
  const heroMain = ranked[0] ?? null;
  const heroSecondary = ranked.slice(1, 3);
  const focusItems = ranked.filter((item) => item.isToday || item.isThisWeek).slice(0, 2);
  const monthlyHighlights = ranked.filter((item) => item.id !== heroMain?.id).slice(0, 4);
  const updates = items.slice(0, 4);
  const timelinePreview = items.slice(0, 6);
  const nextMajor = ranked.find((item) => item.id !== heroMain?.id && !item.isToday) ?? null;

  return {
    hero: { main: heroMain, secondary: heroSecondary },
    focusItems,
    monthlyHighlights,
    updates,
    timelinePreview,
    quickRail: {
      nextMajor,
      daysLeft: nextMajor ? Math.max(0, diffCalendarDays(todayDateKey, nextMajor.date)) : null,
    },
  };
};
```

In `views/LandingView.tsx`, replace ad-hoc slicing with `buildLandingHomepageModel()` and pass the returned collections into the new landing modules in later tasks.

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-homepage.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add services/landingHomepage.ts tests/landing-homepage.test.ts views/LandingView.tsx
git commit -m "feat: add landing homepage model"
```

### Task 2: Scaffold landing module composition in `LandingView`

**Files:**
- Create: `components/landing/LandingHero.tsx`
- Create: `components/landing/LandingCommandBar.tsx`
- Create: `components/landing/LandingFocusGrid.tsx`
- Create: `components/landing/LandingMonthlyHighlights.tsx`
- Create: `components/landing/LandingUpdates.tsx`
- Create: `components/landing/LandingTimelinePreview.tsx`
- Create: `components/landing/LandingRoleEntry.tsx`
- Create: `components/landing/index.ts`
- Create: `tests/landing-view-structure.test.ts`
- Modify: `views/LandingView.tsx`

**Step 1: Write the failing test**

Create `tests/landing-view-structure.test.ts` to lock the new homepage composition order:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

test('landing view should compose redesign modules in homepage order', () => {
  const code = read('views/LandingView.tsx');
  assert.match(code, /<LandingHero/);
  assert.match(code, /<LandingCommandBar/);
  assert.match(code, /<LandingFocusGrid/);
  assert.match(code, /<LandingMonthlyHighlights/);
  assert.match(code, /<LandingUpdates/);
  assert.match(code, /<LandingTimelinePreview/);
  assert.match(code, /<LandingRoleEntry/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-view-structure.test.ts`
Expected: FAIL because the new landing modules are not rendered yet.

**Step 3: Write minimal implementation**

Create placeholder modules under `components/landing/` and export them via `components/landing/index.ts`:

```tsx
export const LandingHero = () => <section aria-label="landing-hero" />;
export const LandingCommandBar = () => <section aria-label="landing-command-bar" />;
export const LandingFocusGrid = () => <section aria-label="landing-focus-grid" />;
export const LandingMonthlyHighlights = () => <section aria-label="landing-monthly-highlights" />;
export const LandingUpdates = () => <section aria-label="landing-updates" />;
export const LandingTimelinePreview = () => <section aria-label="landing-timeline-preview" />;
export const LandingRoleEntry = () => <section aria-label="landing-role-entry" />;
```

In `views/LandingView.tsx`, import these modules and render them in this order after the loading / error branches:

```tsx
<LandingHero ... />
<LandingCommandBar ... />
<LandingFocusGrid ... />
<LandingMonthlyHighlights ... />
<LandingUpdates ... />
<LandingTimelinePreview ... />
<LandingRoleEntry />
```

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-view-structure.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/landing views/LandingView.tsx tests/landing-view-structure.test.ts
git commit -m "feat: scaffold landing redesign sections"
```

### Task 3: Rebuild header into utility bar + masthead + primary nav

**Files:**
- Modify: `components/Navbar.tsx`
- Create: `components/BrandLockup.tsx`
- Create: `tests/navbar-home-ia.test.ts`
- Modify: `routes/__root.tsx`

**Step 1: Write the failing test**

Create `tests/navbar-home-ia.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('navbar should expose utility bar, masthead and search-first home nav', () => {
  const code = read('components/Navbar.tsx');
  assert.match(code, /最近更新/);
  assert.match(code, /已收录/);
  assert.match(code, /本周新增/);
  assert.match(code, /提交活动情报/);
  assert.match(code, /搜索活动 \/ 社团 \/ 地点/);
  assert.match(code, /收录说明/);
});

test('brand lockup should exist for masthead usage', () => {
  const code = read('components/BrandLockup.tsx');
  assert.match(code, /文文。速报/);
  assert.match(code, /幻想乡活动情报总览/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: FAIL because `BrandLockup.tsx` does not exist and the new strings are absent in `Navbar.tsx`.

**Step 3: Write minimal implementation**

Add `components/BrandLockup.tsx`:

```tsx
import BrandLogo from './BrandLogo';

const BrandLockup = ({ compact = false }: { compact?: boolean }) => (
  <div className="flex items-center gap-3">
    <BrandLogo size={compact ? 'sm' : 'md'} />
    <div className="min-w-0">
      <div className="font-brand text-xl font-black leading-none text-[var(--paper-text)]">文文。速报</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--paper-text-muted)]">
        幻想乡活动情报总览
      </div>
    </div>
  </div>
);

export default BrandLockup;
```

Update `components/Navbar.tsx` home-state layout to render:

- Utility bar with `最近更新 / 已收录 / 本周新增`
- Masthead using `BrandLockup`
- Primary nav including `展会 / 演出 / 社团 / 归档 / 收录说明 / 关于`
- Search input with placeholder `搜索活动 / 社团 / 地点`
- Persistent `提交活动情报` action
- Mobile: collapse region controls behind a trigger instead of showing a full-width pills row above hero

Keep the existing skip link in `routes/__root.tsx`, but ensure it still lands on `#main-content` after header markup changes.

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/Navbar.tsx components/BrandLockup.tsx routes/__root.tsx tests/navbar-home-ia.test.ts
git commit -m "feat: redesign landing header shell"
```

### Task 4: Implement Hero and secondary picks

**Files:**
- Modify: `components/landing/LandingHero.tsx`
- Create: `tests/landing-hero-contract.test.ts`
- Modify: `views/LandingView.tsx`

**Step 1: Write the failing test**

Create `tests/landing-hero-contract.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('landing hero should expose product value proposition and three primary actions', () => {
  const code = read('components/landing/LandingHero.tsx');
  assert.match(code, /最快找到近期东方同人展、演出与社团情报/);
  assert.match(code, /浏览近期活动/);
  assert.match(code, /按地区检索/);
  assert.match(code, /提交活动情报/);
  assert.match(code, /id="landing-primary-cta"/);
});

test('landing hero should render secondary picks and update card', () => {
  const code = read('components/landing/LandingHero.tsx');
  assert.match(code, /Editor's Pick/);
  assert.match(code, /最近更新/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-hero-contract.test.ts`
Expected: FAIL because the placeholder hero has no required copy.

**Step 3: Write minimal implementation**

Replace the placeholder in `components/landing/LandingHero.tsx` with a two-column hero:

```tsx
<section aria-labelledby="landing-hero-title" className="...">
  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
    <div>
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--paper-text-muted)]">
        本周头条 / Editor's Pick
      </div>
      <h1 id="landing-hero-title" className="...">
        最快找到近期东方同人展、演出与社团情报
      </h1>
      <p className="...">
        按地区、时间与类型快速检索，也可提交活动与社团信息，进入 AyaFeed 收录体系。
      </p>
      <div className="flex flex-wrap gap-3">
        <Link id="landing-primary-cta" to="/events">浏览近期活动</Link>
        <button type="button">按地区检索</button>
        <Link to="/feedback">提交活动情报</Link>
      </div>
    </div>
    <article>{/* main hero card */}</article>
  </div>
  <div className="grid gap-4 md:grid-cols-3">{/* secondary picks + update card */}</div>
</section>
```

Wire props from `views/LandingView.tsx` using the `hero` and `updates` slices built in Task 1.

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-hero-contract.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/landing/LandingHero.tsx views/LandingView.tsx tests/landing-hero-contract.test.ts
git commit -m "feat: add value-led landing hero"
```

### Task 5: Implement command bar with search and filters

**Files:**
- Modify: `components/landing/LandingCommandBar.tsx`
- Create: `tests/landing-command-bar.test.ts`
- Modify: `views/LandingView.tsx`

**Step 1: Write the failing test**

Create `tests/landing-command-bar.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('command bar should expose homepage search and three filters', () => {
  const code = read('components/landing/LandingCommandBar.tsx');
  assert.match(code, /搜索活动 \/ 社团 \/ 地点/);
  assert.match(code, /地区/);
  assert.match(code, /月份/);
  assert.match(code, /类型/);
  assert.match(code, /查看全部/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-command-bar.test.ts`
Expected: FAIL because the placeholder command bar is empty.

**Step 3: Write minimal implementation**

Implement `LandingCommandBar.tsx` with a presentational search/filter row only; avoid adding live URL-state sync in this redesign pass:

```tsx
<section aria-label="首页检索入口" className="...">
  <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto]">
    <label className="sr-only" htmlFor="landing-command-search">搜索活动 / 社团 / 地点</label>
    <input id="landing-command-search" name="landing-command-search" placeholder="搜索活动 / 社团 / 地点" autoComplete="off" />
    <button type="button">地区</button>
    <button type="button">月份</button>
    <button type="button">类型</button>
    <Link to="/events">查看全部</Link>
  </form>
</section>
```

Use real buttons now; deeper filter behavior can remain a follow-up as long as the IA is visible.

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-command-bar.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/landing/LandingCommandBar.tsx tests/landing-command-bar.test.ts views/LandingView.tsx
git commit -m "feat: add landing command bar"
```

### Task 6: Implement focus grid, quick rail, monthly highlights and updates

**Files:**
- Modify: `components/landing/LandingFocusGrid.tsx`
- Modify: `components/landing/LandingMonthlyHighlights.tsx`
- Modify: `components/landing/LandingUpdates.tsx`
- Create: `tests/landing-editorial-sections.test.ts`
- Modify: `views/LandingView.tsx`

**Step 1: Write the failing test**

Create `tests/landing-editorial-sections.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('focus grid should support today and this-week framing plus quick rail cards', () => {
  const code = read('components/landing/LandingFocusGrid.tsx');
  assert.match(code, /今日进行中/);
  assert.match(code, /本周焦点/);
  assert.match(code, /本周统计/);
  assert.match(code, /下一场重点活动/);
  assert.match(code, /收录说明/);
});

test('monthly highlights and updates should expose editorial homepage sections', () => {
  assert.match(read('components/landing/LandingMonthlyHighlights.tsx'), /本月重点档期/);
  assert.match(read('components/landing/LandingUpdates.tsx'), /最近更新/);
  assert.match(read('components/landing/LandingUpdates.tsx'), /新收录/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-editorial-sections.test.ts`
Expected: FAIL because all three modules are placeholders.

**Step 3: Write minimal implementation**

Implement the modules with exact section titles from the PRD:

- `LandingFocusGrid.tsx`
  - choose section title by prop: if any focus item has `isToday`, render `今日进行中`; otherwise render `本周焦点`
  - render 2 focus cards on the left
  - render 3 quick rail cards on the right: `本周统计`, `下一场重点活动`, `收录说明 / 最新更新`

- `LandingMonthlyHighlights.tsx`
  - render 4-card grid titled `本月重点档期`

- `LandingUpdates.tsx`
  - render 4 light-weight cards titled `最近更新 / Recently Added`
  - use labels such as `新收录活动`, `新收录演出`, `新入驻社团`, `信息变更`

Keep all CTAs concrete: `查看详情`, `查看更新`, `查看收录规则`.

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-editorial-sections.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/landing/LandingFocusGrid.tsx components/landing/LandingMonthlyHighlights.tsx components/landing/LandingUpdates.tsx views/LandingView.tsx tests/landing-editorial-sections.test.ts
git commit -m "feat: add editorial landing sections"
```

### Task 7: Reduce the old timeline into a preview module

**Files:**
- Modify: `components/landing/LandingTimelinePreview.tsx`
- Modify: `tests/landing-mobile-ux-regression.test.ts`
- Create: `tests/landing-timeline-preview.test.ts`
- Modify: `views/LandingView.tsx`

**Step 1: Write the failing test**

Create `tests/landing-timeline-preview.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('timeline preview should keep month jump, preview cards and archive CTA', () => {
  const code = read('components/landing/LandingTimelinePreview.tsx');
  assert.match(code, /精简版时间轴/);
  assert.match(code, /快速跳转/);
  assert.match(code, /进入完整时间轴/);
});
```

Update `tests/landing-mobile-ux-regression.test.ts` to read the new landing files instead of `components/LandingSections.tsx`:

```ts
const timelineCode = read('components/landing/LandingTimelinePreview.tsx');
assert.match(timelineCode, /快速跳转/);
assert.match(timelineCode, /min-h-11/);
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-timeline-preview.test.ts tests/landing-mobile-ux-regression.test.ts`
Expected: FAIL because the preview module still uses the placeholder markup and the old test still points at the legacy file.

**Step 3: Write minimal implementation**

Implement `LandingTimelinePreview.tsx` as a simplified version of the current timeline:

- keep month jump buttons
- render only a preview slice (`timelinePreview` prop)
- preserve accessible anchor scrolling
- end with a strong CTA: `进入完整时间轴 / 历史归档`

Do not migrate the full old `ScrapbookTimeline` here; keep this module intentionally short and homepage-specific.

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-timeline-preview.test.ts tests/landing-mobile-ux-regression.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/landing/LandingTimelinePreview.tsx tests/landing-timeline-preview.test.ts tests/landing-mobile-ux-regression.test.ts views/LandingView.tsx
git commit -m "feat: turn landing timeline into preview"
```

### Task 8: Add role entry, redesign footer, and extend brand usage

**Files:**
- Modify: `components/landing/LandingRoleEntry.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/BrandLogo.tsx`
- Create: `tests/landing-role-footer.test.ts`

**Step 1: Write the failing test**

Create `tests/landing-role-footer.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('role entry should include viewer, circle and organizer paths', () => {
  const code = read('components/landing/LandingRoleEntry.tsx');
  assert.match(code, /我是观众/);
  assert.match(code, /我是社团/);
  assert.match(code, /我是主办/);
  assert.match(code, /开始检索/);
  assert.match(code, /查看社团入驻/);
  assert.match(code, /提交活动情报/);
});

test('footer should expose trust links and homepage-specific credibility copy', () => {
  const code = read('components/Footer.tsx');
  assert.match(code, /收录说明/);
  assert.match(code, /数据来源/);
  assert.match(code, /关于 AyaFeed/);
  assert.match(code, /最近更新时间/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-role-footer.test.ts`
Expected: FAIL because the role module is empty and the footer lacks the new trust copy.

**Step 3: Write minimal implementation**

Implement `LandingRoleEntry.tsx` as 3 cards with one sentence and one CTA each.

Update `components/Footer.tsx` to a four-column trust footer:

- 浏览：展会 / 演出 / 社团 / 归档
- 参与：提交活动 / 社团入驻 / 问题反馈
- 说明与信任：收录说明 / 数据来源 / 隐私政策 / 关于 AyaFeed
- 联系：contact / social links

Update `BrandLogo.tsx` only enough to support cleaner masthead/footer usage:

- keep the symbol concept intact
- keep reduced-motion behavior
- avoid adding perpetual animation to masthead default state

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-role-footer.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add components/landing/LandingRoleEntry.tsx components/Footer.tsx components/BrandLogo.tsx tests/landing-role-footer.test.ts
git commit -m "feat: add landing role entry and trust footer"
```

### Task 9: Finish SEO, accessibility, and source-contract fixes

**Files:**
- Modify: `index.html`
- Modify: `components/Navbar.tsx`
- Modify: `components/Footer.tsx`
- Create: `tests/landing-seo-a11y-contract.test.ts`

**Step 1: Write the failing test**

Create `tests/landing-seo-a11y-contract.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('index.html should declare a zh-oriented document language and meta description', () => {
  const code = read('index.html');
  assert.match(code, /<html lang="zh-CN"/);
  assert.match(code, /meta name="description"/);
});

test('header and footer brand links should use visible text in accessible names', () => {
  const navbar = read('components/Navbar.tsx');
  const footer = read('components/Footer.tsx');
  assert.doesNotMatch(navbar, /aria-label="返回首页"/);
  assert.doesNotMatch(footer, /aria-label="返回首页"/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-seo-a11y-contract.test.ts`
Expected: FAIL because `index.html` is still `lang="en"`, there is no meta description, and brand links still override visible text with `aria-label`.

**Step 3: Write minimal implementation**

Apply the following contract fixes:

- `index.html`
  - change `<html lang="en">` to `<html lang="zh-CN">`
  - add `<meta name="description" content="AyaFeed：最快找到近期东方同人展、演出与社团情报。">`
- `components/Navbar.tsx`
  - remove `aria-label="返回首页"` from brand links that already contain visible text
  - ensure utility/search buttons still have descriptive accessible names
- `components/Footer.tsx`
  - remove redundant `aria-label="返回首页"` from visible-text home link
- adjust muted text tokens where contrast is obviously too low, especially utility-bar helper text and footer divider labels

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-seo-a11y-contract.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add index.html components/Navbar.tsx components/Footer.tsx tests/landing-seo-a11y-contract.test.ts
git commit -m "fix: improve landing seo and a11y contracts"
```

### Task 10: Run focused verification, then full project verification

**Files:**
- Modify: `docs/plans/archive/2026-03-06-landing-redesign-prd.md`
- Modify: `README.md` (only if homepage entry copy needs syncing)

**Step 1: Run the focused landing test suite**

Run:

```bash
pnpm exec tsx --test \
  tests/landing-homepage.test.ts \
  tests/landing-view-structure.test.ts \
  tests/navbar-home-ia.test.ts \
  tests/landing-hero-contract.test.ts \
  tests/landing-command-bar.test.ts \
  tests/landing-editorial-sections.test.ts \
  tests/landing-timeline-preview.test.ts \
  tests/landing-role-footer.test.ts \
  tests/landing-seo-a11y-contract.test.ts \
  tests/landing-mobile-ux-regression.test.ts \
  tests/landing-hero.test.ts \
  tests/landing-regions.test.ts
```

Expected: PASS.

**Step 2: Run type-checking**

Run: `pnpm lint`
Expected: PASS.

**Step 3: Run the full project test suite**

Run: `pnpm test`
Expected: PASS.

**Step 4: Manual QA in browser**

Run: `pnpm dev`

Verify manually on desktop and mobile widths:

- Hero explains the product before the first scroll
- Search and filters are visible in the first two viewport heights
- `提交活动情报` is visible in header and role entry
- Timeline is clearly a preview, not a full homepage wall
- Footer contains trust links and update metadata
- Header brand link no longer triggers label-content-name mismatch

**Step 5: Commit documentation sync (only if text changed)**

```bash
git add docs/plans/archive/2026-03-06-landing-redesign-prd.md README.md
git commit -m "docs: sync landing redesign references"
```

## Notes for the implementer

- Prefer modifying the existing shell over introducing a second homepage-only shell.
- Keep `theme-newspaper` untouched as the only supported theme.
- Avoid bringing in new test frameworks; stay with `node:test` + source/unit contract tests unless a browser test runner already exists.
- Use English commit messages if you choose to commit during execution.
- Do not add fake product capabilities. The redesign should make current capabilities clearer, not imply shipping ticketing, auth, or organizer CMS features that are absent.

## Suggested execution order rationale

1. Build pure homepage data shaping first so view sections have stable props.
2. Scaffold module composition next so later UI tasks are isolated.
3. Fix header shell early because it affects every screenshot and first-screen UX.
4. Build editorial sections from top to bottom.
5. Finish with footer, SEO, and accessibility because they are global contracts.

## Optional follow-up tasks (out of scope for this pass)

- Sync command bar filters into URL query params.
- Add render-level component tests once a React testing harness exists.
- Create a dedicated `About AyaFeed` page and `收录说明` page if route content is still missing.
- Add analytics events for the new homepage paths.

