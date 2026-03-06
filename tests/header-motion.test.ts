import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getHeaderMotionState,
  type HeaderMotionInput,
} from '../services/headerMotion';

const makeInput = (overrides: Partial<HeaderMotionInput> = {}): HeaderMotionInput => ({
  isLanding: true,
  scrollY: 0,
  mastheadBottom: 320,
  compressStart: 48,
  dockStart: 168,
  ...overrides,
});

test('getHeaderMotionState returns masthead near top', () => {
  const state = getHeaderMotionState(makeInput({ scrollY: 0, mastheadBottom: 320 }));
  assert.equal(state.phase, 'masthead');
  assert.equal(state.progress, 0);
});

test('getHeaderMotionState returns compressing in the mid scroll range', () => {
  const state = getHeaderMotionState(makeInput({ scrollY: 110, mastheadBottom: 96 }));
  assert.equal(state.phase, 'compressing');
  assert.ok(state.progress > 0);
  assert.ok(state.progress < 1);
});

test('getHeaderMotionState returns docked after threshold', () => {
  const state = getHeaderMotionState(makeInput({ scrollY: 220, mastheadBottom: 24 }));
  assert.equal(state.phase, 'docked');
  assert.equal(state.progress, 1);
});

test('getHeaderMotionState returns docked for non-landing pages', () => {
  const state = getHeaderMotionState(makeInput({ isLanding: false, scrollY: 0 }));
  assert.equal(state.phase, 'docked');
  assert.equal(state.progress, 1);
});
