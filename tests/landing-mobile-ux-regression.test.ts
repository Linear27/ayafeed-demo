import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

test('navbar mobile area should include region controls in masthead and menu', () => {
  const code = read('components/Navbar.tsx');

  assert.match(code, /地区切换/);
  assert.match(code, /REGION_OPTIONS\.map/);
  assert.doesNotMatch(code, /header-search/);
});

test('landing primary cta should expose overlap anchor for floating launcher', () => {
  const code = read('components/landing/LandingHero.tsx');
  assert.match(code, /id="landing-primary-cta"/);
});

test('sidebar quick links and tags should use minimum touch target classes', () => {
  const timelineCode = read('components/landing/LandingTimelinePreview.tsx');

  assert.match(timelineCode, /快速跳转/);
  assert.match(timelineCode, /inline-flex min-h-11 items-center px-2 text-\[var\(--paper-muted\)\]/);
  assert.match(timelineCode, /inline-flex min-h-11 items-center rounded-sm px-2 text-xs font-bold text-\[var\(--paper-accent\)\]/);
});
