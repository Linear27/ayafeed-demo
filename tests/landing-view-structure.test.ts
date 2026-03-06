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
