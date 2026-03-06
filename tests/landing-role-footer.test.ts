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
