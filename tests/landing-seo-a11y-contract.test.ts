import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('index.html should declare a zh-oriented document language and meta description', () => {
  const code = read('index.html');
  assert.match(code, /<html lang="zh-CN"/);
  assert.match(code, /meta name="description"/);
});

test('header and footer brand links should use visible text in accessible names', () => {
  const navbar = read('components/Navbar.tsx');
  const footer = read('components/Footer.tsx');
  assert.doesNotMatch(navbar, /aria-label="返回首页"/);
  assert.doesNotMatch(footer, /aria-label="返回首页"/);
});
