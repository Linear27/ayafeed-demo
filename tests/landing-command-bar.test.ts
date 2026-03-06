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
