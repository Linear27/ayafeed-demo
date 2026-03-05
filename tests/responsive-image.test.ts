import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUnsplashSrcSet } from '../services/responsiveImage';

test('buildUnsplashSrcSet should return undefined for empty input', () => {
  assert.equal(buildUnsplashSrcSet(null), undefined);
  assert.equal(buildUnsplashSrcSet(''), undefined);
});

test('buildUnsplashSrcSet should return undefined for non-unsplash images', () => {
  const src = 'https://cdn.example.com/poster.png';
  assert.equal(buildUnsplashSrcSet(src), undefined);
});

test('buildUnsplashSrcSet should build width descriptors for unsplash url', () => {
  const src =
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop';

  const srcSet = buildUnsplashSrcSet(src, [320, 640, 960]);

  assert.equal(typeof srcSet, 'string');
  assert.match(srcSet!, /w=320/);
  assert.match(srcSet!, /w=640/);
  assert.match(srcSet!, /w=960/);
  assert.match(srcSet!, /320w/);
  assert.match(srcSet!, /640w/);
  assert.match(srcSet!, /960w/);
});
