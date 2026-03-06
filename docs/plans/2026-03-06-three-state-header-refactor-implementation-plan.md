# Three-State Header Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the landing/header experience into a visually continuous three-state editorial system where the full masthead compresses into a compact dock instead of being replaced by a second, stylistically disconnected navbar.

**Architecture:** Keep the header shell inside `components/Navbar.tsx`, but move scroll-phase calculation into a pure helper so state transitions are testable without browser tooling. Replace the current dual-desktop-shell feeling with one editorial language shared across three desktop states: `masthead`, `compressing`, and `docked`. Keep mobile intentionally simpler; desktop gets the full three-state transition, mobile keeps a stable one-row masthead plus menu drawer.

**Tech Stack:** React + TypeScript, TanStack Router, Framer Motion, pnpm, `node:test` via `tsx --test`, existing paper theme tokens in `index.css`.

---

## Reference Baseline

**Historical local reference**
- Previous demo header: git history version of `components/Navbar.tsx` (the version before the recent landing/header simplification)
- Kept from that version:
  - masthead-first information hierarchy
  - explicit scroll-phase transition into a compact dock
  - editorial typography and category-strip logic
- Intentionally changed from that version:
  - navbar no longer contains `archive / inclusion notes / about`
  - utility density is lower
  - dropdown controls use lighter paper-panel styling

**Current NYT reference (observed on 2026-03-06)**
- Reference target: `https://www.nytimes.com/`
- Kept from current NYT:
  - clear separation between full masthead and post-scroll navigation utility
  - restrained shadow, thin borders, and low-noise motion
  - category strip remains the primary post-scroll affordance
- Intentionally changed from current NYT:
  - AyaFeed should preserve stronger editorial identity in the compact state
  - the compact state should still feel like a compressed masthead, not a generic product strip
  - footer?not navbar?owns archival and trust/about links

---

## Pre-flight Context

Before implementation, read these files for scope and current behavior:

- Current header shell: `components/Navbar.tsx`
- Current brand lockup: `components/BrandLockup.tsx`
- Current logo primitive: `components/BrandLogo.tsx`
- Current paper tokens: `index.css`
- Footer ownership of archive/trust/about links: `components/Footer.tsx`
- Current navbar regression tests: `tests/navbar-home-ia.test.ts`
- Mobile regression tests: `tests/landing-mobile-ux-regression.test.ts`

Use `pnpm` only. Keep all behavior inside `theme-newspaper`.

---

## State Model To Implement

### Desktop State A: `masthead`
- Large centered brand lockup
- Left-side editorial meta note (issue/date/network)
- Right-side low-weight controls (region/language/CTA)
- One category line below the masthead: `events / lives / circles`

### Desktop State B: `compressing`
- Brand scales down and begins shifting left
- Editorial meta fades and tightens
- Category line rises upward toward the compact bar baseline
- Controls compress in spacing and visual weight
- This state is transitional and should be scroll-progress-driven, not a binary toggle

### Desktop State C: `docked`
- Single compact horizontal bar
- Small brand at left, category navigation centered, controls right-aligned
- No secondary informational links in navbar
- Motion settles; state feels stable and quiet

### Mobile Behavior
- Keep the current one-row top masthead + menu button approach
- No desktop-style intermediate compression choreography on mobile
- Preserve region switch + menu drawer stability

---

## Task 1: Add a pure three-state scroll-phase helper

**Files:**
- Create: `services/headerMotion.ts`
- Create: `tests/header-motion.test.ts`
- Modify: `components/Navbar.tsx`

**Step 1: Write the failing test**

Create `tests/header-motion.test.ts` with a pure contract for desktop header phase calculation.

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getHeaderMotionState,
  type HeaderMotionInput,
} from '../services/headerMotion';

const makeInput = (overrides: Partial<HeaderMotionInput> = {}): HeaderMotionInput => ({
  isLanding: true,
  scrollY: 0,
  mastheadBottom: 320,
  compressStart: 48,
  dockStart: 168,
  ...overrides,
});

test('getHeaderMotionState returns masthead near top', () => {
  const state = getHeaderMotionState(makeInput({ scrollY: 0, mastheadBottom: 320 }));
  assert.equal(state.phase, 'masthead');
  assert.equal(state.progress, 0);
});

test('getHeaderMotionState returns compressing in the mid scroll range', () => {
  const state = getHeaderMotionState(makeInput({ scrollY: 110, mastheadBottom: 96 }));
  assert.equal(state.phase, 'compressing');
  assert.ok(state.progress > 0 && state.progress < 1);
});

test('getHeaderMotionState returns docked after threshold', () => {
  const state = getHeaderMotionState(makeInput({ scrollY: 240, mastheadBottom: -40 }));
  assert.equal(state.phase, 'docked');
  assert.equal(state.progress, 1);
});

test('non-landing routes are always docked', () => {
  const state = getHeaderMotionState(makeInput({ isLanding: false }));
  assert.equal(state.phase, 'docked');
  assert.equal(state.progress, 1);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/header-motion.test.ts`
Expected: FAIL because `services/headerMotion.ts` does not exist yet.

**Step 3: Write minimal implementation**

Create `services/headerMotion.ts`.

```ts
export type HeaderPhase = 'masthead' | 'compressing' | 'docked';

export type HeaderMotionInput = {
  isLanding: boolean;
  scrollY: number;
  mastheadBottom: number;
  compressStart: number;
  dockStart: number;
};

export type HeaderMotionState = {
  phase: HeaderPhase;
  progress: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const getHeaderMotionState = ({
  isLanding,
  scrollY,
  mastheadBottom,
  compressStart,
  dockStart,
}: HeaderMotionInput): HeaderMotionState => {
  if (!isLanding) {
    return { phase: 'docked', progress: 1 };
  }

  const trigger = Math.max(scrollY, compressStart - mastheadBottom);

  if (trigger <= compressStart) {
    return { phase: 'masthead', progress: 0 };
  }

  if (trigger >= dockStart) {
    return { phase: 'docked', progress: 1 };
  }

  const progress = clamp((trigger - compressStart) / (dockStart - compressStart), 0, 1);
  return { phase: 'compressing', progress };
};
```

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/header-motion.test.ts`
Expected: PASS.

---

## Task 2: Lock the new navbar IA and three-state shell contract

**Files:**
- Modify: `tests/navbar-home-ia.test.ts`
- Modify: `components/Navbar.tsx`

**Step 1: Write the failing test**

Extend `tests/navbar-home-ia.test.ts` so the header contract is explicit.

Add assertions for:
- desktop nav only includes `events / lives / circles`
- navbar does not include `archive / inclusion notes / about`
- a three-state phase model exists (`masthead`, `compressing`, `docked`)
- the compact dock is not implemented as a completely separate visual grammar

Example contract additions:

```ts
test('navbar should use a three-state editorial phase model', () => {
  const code = read('components/Navbar.tsx');
  assert.match(code, /masthead/);
  assert.match(code, /compressing/);
  assert.match(code, /docked/);
  assert.doesNotMatch(code, /label: 'archive'/);
  assert.doesNotMatch(code, /label: 'inclusion notes'/);
  assert.doesNotMatch(code, /label: 'archive'/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: FAIL until the new phase model is wired into `components/Navbar.tsx`.

**Step 3: Implement the shell contract**

In `components/Navbar.tsx`:
- replace the old binary desktop state with the new helper-driven phase model
- keep `NAV_ITEMS` limited to `events / lives / circles`
- avoid reintroducing footer-owned trust/about/archive links into header navigation

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: PASS.

---

## Task 3: Collapse desktop header into one continuous visual system

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/BrandLockup.tsx`
- Optional modify: `components/BrandLogo.tsx`

**Step 1: Write the failing test**

Add a focused source-level regression test (either in `tests/navbar-home-ia.test.ts` or a new `tests/navbar-three-state-layout.test.ts`) that locks these constraints:
- brand lockup supports a large masthead presentation and a compact dock presentation
- the compact state still reuses the same brand family
- desktop controls and nav are rendered from shared helpers, not duplicated with unrelated styling

Example:

```ts
test('brand lockup should support editorial and compact header roles', () => {
  const code = read('components/BrandLockup.tsx');
  assert.match(code, /compact/);
  assert.match(code, /text-\[1\.9rem\]/);
  assert.match(code, /text-lg/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: FAIL if the required variants/helpers do not yet exist.

**Step 3: Implement the unified layout**

In `components/Navbar.tsx`:
- preserve one editorial DNA across phases
- keep the masthead skeleton visually related to the dock skeleton
- use the same category nav group in both desktop states
- reduce the current ?replacement? feeling by aligning:
  - brand baseline
  - nav baseline
  - right control cluster spacing

Implementation target:
- `masthead`: centered brand, nav on a separate line
- `compressing`: brand shrinks and migrates left while nav rises
- `docked`: small brand left, nav center, controls right

In `components/BrandLockup.tsx`:
- keep masthead size large and ceremonial
- keep compact size quiet and readable
- avoid turning the compact brand into a new visual identity

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: PASS.

---

## Task 4: Implement motion that feels like compression, not replacement

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `index.css`
- Optional modify: `tests/navbar-home-ia.test.ts`

**Step 1: Write the failing test**

Add a source-level motion contract test.

```ts
test('header motion should prefer transform and opacity for state compression', () => {
  const code = read('components/Navbar.tsx');
  assert.match(code, /translate/);
  assert.match(code, /scale/);
  assert.match(code, /opacity/);
  assert.doesNotMatch(code, /transition:\s*'height/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: FAIL until motion properties are wired in.

**Step 3: Implement minimal motion system**

In `components/Navbar.tsx` and/or `index.css`:
- animate only `transform` and `opacity`
- do not animate `height`
- use one easing family for all header compression transitions
- recommended timing:
  - `masthead -> compressing`: `220ms?280ms`
  - `compressing -> docked`: same easing, slightly snappier feel
- recommended properties:
  - brand: `translateX`, `translateY`, `scale`, `opacity`
  - meta note: `opacity`, slight `translateY`
  - category line: `translateY`
  - control cluster: `opacity`, small `translateY`

Recommended motion token:

```ts
const HEADER_EASE = [0.16, 1, 0.3, 1] as const;
```

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: PASS.

---

## Task 5: Keep dropdown controls visually consistent across phases

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `tests/navbar-home-ia.test.ts`

**Step 1: Write the failing test**

Extend the existing dropdown regression to confirm:
- desktop region/language controls reuse the same panel style token
- docked dropdowns still open from the dock itself
- control affordances do not become heavier in the compact state than in the masthead state

Example additions:

```ts
test('desktop dropdowns should share one paper-panel style token across header phases', () => {
  const code = read('components/Navbar.tsx');
  assert.match(code, /dropdownPanelClassName/);
  assert.match(code, /min-w-56/);
  assert.match(code, /min-w-44/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: FAIL if panel tokens are not unified.

**Step 3: Implement the dropdown styling rules**

Keep:
- one shared panel visual token
- arrow rotation and expanded-state border treatment
- low-noise paper shadow

Avoid:
- glossy UI-library look
- oversized rounded corners
- menu weight that visually overpowers the compact dock

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/navbar-home-ia.test.ts`
Expected: PASS.

---

## Task 6: Stabilize mobile without forcing desktop choreography onto it

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `tests/landing-mobile-ux-regression.test.ts`

**Step 1: Write the failing test**

Add a mobile stability regression that ensures:
- mobile still uses one top row with brand + region + menu
- mobile menu remains the place for navigation and language switch
- desktop three-state logic does not leak extra layered bars into mobile markup

Example:

```ts
test('mobile navbar should stay single-row and should not render desktop dock duplication', () => {
  const code = read('components/Navbar.tsx');
  assert.match(code, /lg:hidden/);
  assert.match(code, /????/);
  assert.doesNotMatch(code, /mobile compressing dock/);
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm exec tsx --test tests/landing-mobile-ux-regression.test.ts`
Expected: FAIL if the mobile shell is disturbed.

**Step 3: Implement the mobile safeguard**

Keep mobile intentionally simpler:
- one masthead row
- one drawer
- one region panel
- no desktop intermediate choreography

**Step 4: Run test to verify it passes**

Run: `pnpm exec tsx --test tests/landing-mobile-ux-regression.test.ts`
Expected: PASS.

---

## Task 7: Final validation and visual review

**Files:**
- Modify if needed: `components/Navbar.tsx`
- Modify if needed: `tests/*.test.ts`

**Step 1: Run focused tests**

Run:
- `pnpm exec tsx --test tests/header-motion.test.ts`
- `pnpm exec tsx --test tests/navbar-home-ia.test.ts tests/landing-mobile-ux-regression.test.ts`

Expected: PASS.

**Step 2: Run full verification**

Run:
- `pnpm lint`
- `pnpm test`

Expected: PASS.

**Step 3: Manual browser verification checklist**

Check locally at the landing route:
- top of page shows full masthead
- slight scroll enters a visible compression phase rather than an instant swap
- deeper scroll settles into a compact dock
- returning upward reverses smoothly
- compact dock dropdowns anchor to the dock itself
- mobile keeps one-row masthead + drawer
- navbar contains only `events / lives / circles`
- footer still owns `archive / inclusion notes / about AyaFeed`

**Step 4: If any visual mismatch remains**

Only adjust:
- transition distances
- opacity timing
- spacing and alignment tokens

Do not reintroduce new information architecture inside navbar.

---

## Definition of Done

The work is complete when all of the following are true:

- Landing desktop header has three clear phases: `masthead`, `compressing`, `docked`
- The dock feels like a compressed continuation of the masthead, not a replacement navbar
- Navbar contains only primary content navigation: `events / lives / circles`
- `archive / inclusion notes / about AyaFeed` remain footer-owned
- Region/language dropdowns work in the compact dock and share one visual language
- Mobile remains stable and simpler than desktop
- `pnpm lint` and `pnpm test` both pass
