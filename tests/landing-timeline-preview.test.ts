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
