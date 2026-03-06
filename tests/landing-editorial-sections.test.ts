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
