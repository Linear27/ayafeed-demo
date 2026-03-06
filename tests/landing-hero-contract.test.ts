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
