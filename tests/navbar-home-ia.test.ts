import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('navbar should expose a nyt-style masthead and editorial nav without utility clutter', () => {
  const code = read('components/Navbar.tsx');
  assert.match(code, /\u7b2c 13042 \u671f/);
  assert.match(code, /Gensokyo Intelligence Network/);
  assert.match(code, /\u63d0\u4ea4\u6d3b\u52a8\u60c5\u62a5/);
  assert.match(code, /\u5c55\u4f1a/);
  assert.match(code, /\u6f14\u51fa/);
  assert.match(code, /\u793e\u56e2/);
  assert.doesNotMatch(code, /\u5f52\u6863/);
  assert.doesNotMatch(code, /\u6536\u5f55\u8bf4\u660e/);
  assert.doesNotMatch(code, /\u5173\u4e8e/);
  assert.doesNotMatch(code, /\u6700\u8fd1\u66f4\u65b0/);
  assert.doesNotMatch(code, /\u5df2\u6536\u5f55/);
  assert.doesNotMatch(code, /\u672c\u5468\u65b0\u589e/);
  assert.doesNotMatch(code, /\u641c\u7d22\u6d3b\u52a8 \/ \u793e\u56e2 \/ \u5730\u70b9/);
});

test('brand lockup should exist for masthead usage', () => {
  const code = read('components/BrandLockup.tsx');
  assert.match(code, /\u6587\u6587\u3002\u901f\u62a5/);
  assert.match(code, /\u5e7b\u60f3\u4e61\u6d3b\u52a8\u60c5\u62a5\u603b\u89c8/);
});

test('navbar dock should mount only when visible and close duplicate menu state when hidden', () => {
  const code = read('components/Navbar.tsx');

  assert.match(code, /\{isDockVisible \? \(\s*<div\s+data-aya-dock="true"/s);
  assert.match(
    code,
    /useEffect\(\(\) => \{\s*setIsMobileMenuOpen\(false\);\s*setIsLanguageMenuOpen\(false\);\s*setIsRegionMenuOpen\(false\);\s*\}, \[isDockVisible\]\);/s,
  );
  assert.doesNotMatch(code, /max-h-0 border-b border-transparent shadow-none/);
});

test('navbar dock should own visible region and language dropdown panels after collapse', () => {
  const code = read('components/Navbar.tsx');

  assert.match(code, /const dropdownPanelClassName =[\s\S]*?top-\[calc\(100%\+[0-9]+px\)\]/);
  assert.match(code, /const renderDesktopRegionControl = \([\s\S]*?aria-label="\u5730\u533a\u5207\u6362"[\s\S]*?dropdownPanelClassName\} min-w-56 p-1\.5/);
  assert.match(code, /const renderDesktopLanguageControl = \([\s\S]*?aria-label="\u8bed\u8a00\u5207\u6362"[\s\S]*?dropdownPanelClassName\} min-w-44 p-1\.5/);
  assert.match(code, /renderDesktopRegionControl\(\{[\s\S]*?compact: true,[\s\S]*?menuVisible: isDockVisible && isRegionMenuOpen,[\s\S]*?\}\)/);
  assert.match(code, /renderDesktopLanguageControl\(\{[\s\S]*?compact: true,[\s\S]*?menuVisible: isDockVisible && isLanguageMenuOpen,[\s\S]*?\}\)/);
});

test('navbar should use a three-state editorial phase model', () => {
  const navbarCode = read('components/Navbar.tsx');
  const motionCode = read('services/headerMotion.ts');

  assert.match(motionCode, /masthead/);
  assert.match(motionCode, /compressing/);
  assert.match(motionCode, /docked/);
  assert.match(navbarCode, /getHeaderMotionState/);
  assert.match(navbarCode, /data-aya-state=\{headerMotion\.phase\}/);
  assert.doesNotMatch(navbarCode, /label: '归档'/);
  assert.doesNotMatch(navbarCode, /label: '收录说明'/);
  assert.doesNotMatch(navbarCode, /label: '关于 AyaFeed'/);
});

test('brand lockup should support editorial and compact header roles', () => {
  const code = read('components/BrandLockup.tsx');

  assert.match(code, /compact\?: boolean/);
  assert.match(code, /text-\[1\.9rem\]/);
  assert.match(code, /text-lg md:text-xl/);
});

test('header motion should prefer transform and opacity for editorial compression', () => {
  const code = read('components/Navbar.tsx');

  assert.match(code, /headerMotion\.progress/);
  assert.match(code, /translate3d\(/);
  assert.match(code, /scale\(/);
  assert.match(code, /opacity:/);
});
