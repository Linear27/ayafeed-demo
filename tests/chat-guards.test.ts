import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkChatRateLimit,
  dedupeHistoryAgainstNewMessage,
  resolveClientIp,
  type GeminiChatMessage,
} from '../services/chatGuards';

test('resolveClientIp should prefer req.ip and normalize ipv4-mapped addresses', () => {
  assert.equal(resolveClientIp({ ip: '::ffff:127.0.0.1' }), '127.0.0.1');
  assert.equal(resolveClientIp({ ip: '203.0.113.8' }), '203.0.113.8');
});

test('resolveClientIp should fallback to socket remoteAddress and guard invalid values', () => {
  assert.equal(resolveClientIp({ ip: 'not-an-ip', socket: { remoteAddress: '::1' } }), '::1');
  assert.equal(resolveClientIp({ ip: 'not-an-ip', socket: { remoteAddress: 'not-an-ip' } }), 'unknown');
});

test('dedupeHistoryAgainstNewMessage should remove duplicated trailing user message', () => {
  const history: GeminiChatMessage[] = [
    { role: 'model', text: 'hi' },
    { role: 'user', text: 'hello' },
  ];
  const deduped = dedupeHistoryAgainstNewMessage(history, 'hello');
  assert.deepEqual(deduped, [{ role: 'model', text: 'hi' }]);
});

test('checkChatRateLimit should enforce max requests inside window', () => {
  const store = new Map<string, { count: number; windowStartAt: number }>();
  const options = { windowMs: 60_000, maxRequests: 2 };
  const now = Date.UTC(2026, 2, 5, 12, 0, 0);

  const first = checkChatRateLimit(store, '203.0.113.8', options, now);
  assert.equal(first.limited, false);
  assert.equal(first.remaining, 1);

  const second = checkChatRateLimit(store, '203.0.113.8', options, now + 5_000);
  assert.equal(second.limited, false);
  assert.equal(second.remaining, 0);

  const third = checkChatRateLimit(store, '203.0.113.8', options, now + 10_000);
  assert.equal(third.limited, true);
  assert.equal(third.remaining, 0);
  assert.ok(third.retryAfterSeconds > 0);
});
