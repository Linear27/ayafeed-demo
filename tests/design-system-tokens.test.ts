import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

test('design tokens should define color, spacing and elevation primitives', () => {
  const css = read('index.css');

  const requiredTokens = [
    '--paper-bg:',
    '--paper-text:',
    '--paper-accent:',
    '--paper-muted:',
    '--paper-border:',
    '--paper-hover:',
    '--paper-active:',
    '--space-xs:',
    '--space-sm:',
    '--space-md:',
    '--space-lg:',
    '--space-xl:',
    '--paper-shadow-sm:',
    '--paper-shadow-md:',
    '--paper-shadow-lg:',
  ];

  requiredTokens.forEach((token) => {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

test('landing sections should avoid hardcoded color and raw shadow utilities', () => {
  const landingSections = read('components/LandingSections.tsx');

  const disallowedPatterns = [
    /\btext-red-\d+\b/,
    /\btext-black\b/,
    /\btext-slate-\d+\b/,
    /\bbg-yellow-\d+\b/,
    /\bring-red-\d+\b/,
    /shadow-\[\d+px_/,
  ];

  disallowedPatterns.forEach((pattern) => {
    assert.equal(pattern.test(landingSections), false, `unexpected pattern: ${pattern.source}`);
  });
});

test('list and circle pages should use shared paper tokens', () => {
  const targets = [
    'views/EventListView.tsx',
    'views/LiveListView.tsx',
    'views/CircleListView.tsx',
    'views/CircleDetailView.tsx',
    'views/EventDetailView.tsx',
    'views/LiveDetailView.tsx',
    'components/EventFilters.tsx',
    'components/event-detail/EventDetailHeader.tsx',
    'components/event-detail/EventInfoSection.tsx',
    'components/event-detail/EventOverviewSection.tsx',
    'components/event-detail/EventAccessSection.tsx',
    'components/event-detail/EventCirclesSection.tsx',
    'components/live-detail/LiveDetailHero.tsx',
  ];

  const disallowedPatterns = [
    /\btext-red-\d+\b/,
    /\btext-black\b/,
    /\btext-slate-\d+\b/,
    /\bbg-red-\d+\b/,
    /\bbg-white\b/,
    /\bbg-slate-\d+\b/,
    /\bborder-black\b/,
    /shadow-\[\d+px_/,
    /bg-\[#/,
  ];

  targets.forEach((file) => {
    const code = read(file);
    disallowedPatterns.forEach((pattern) => {
      assert.equal(pattern.test(code), false, `${file} contains unexpected pattern: ${pattern.source}`);
    });
  });
});
