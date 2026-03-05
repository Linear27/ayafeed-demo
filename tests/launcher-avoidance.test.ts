import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLauncherAvoidance } from '../services/launcherAvoidance';

const rect = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
});

test('resolveLauncherAvoidance should keep launcher unchanged when no overlap', () => {
  const result = resolveLauncherAvoidance({
    launcherRect: rect(320, 700, 44, 44),
    targetRect: rect(16, 620, 200, 44),
    viewport: { width: 375, height: 812 },
  });

  assert.deepEqual(result, { offsetX: 0, offsetY: 0 });
});

test('resolveLauncherAvoidance should move launcher upward first when overlap exists', () => {
  const result = resolveLauncherAvoidance({
    launcherRect: rect(320, 690, 44, 44),
    targetRect: rect(44, 680, 320, 44),
    viewport: { width: 375, height: 812 },
  });

  assert.equal(result.offsetY > 0, true);
  assert.equal(result.offsetX, 0);
});

test('resolveLauncherAvoidance should move launcher left when upward move is impossible', () => {
  const result = resolveLauncherAvoidance({
    launcherRect: rect(320, 8, 44, 44),
    targetRect: rect(290, 4, 90, 44),
    viewport: { width: 375, height: 812 },
  });

  assert.equal(result.offsetX < 0, true);
  assert.equal(result.offsetY, 0);
});
