import { isIP } from 'node:net';

export type GeminiChatMessage = {
  role: 'user' | 'model';
  text: string;
};

export type ChatRateLimitEntry = {
  count: number;
  windowStartAt: number;
};

export type ChatRateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  maxEntries?: number;
};

export type ChatRateLimitResult = {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAtEpochSeconds: number;
};

const normalizeIp = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = trimmed.startsWith('::ffff:') ? trimmed.slice('::ffff:'.length) : trimmed;
  return isIP(candidate) ? candidate : null;
};

export const resolveClientIp = (req: {
  ip?: string | null;
  socket?: { remoteAddress?: string | null };
}): string => {
  return normalizeIp(req.ip) ?? normalizeIp(req.socket?.remoteAddress) ?? 'unknown';
};

export const dedupeHistoryAgainstNewMessage = (
  history: GeminiChatMessage[],
  newMessage: string,
): GeminiChatMessage[] => {
  if (history.length === 0) return history;

  const trimmed = newMessage.trim();
  if (!trimmed) return history;

  const last = history[history.length - 1];
  if (last.role === 'user' && last.text === trimmed) {
    return history.slice(0, -1);
  }
  return history;
};

const cleanupStaleEntries = (
  store: Map<string, ChatRateLimitEntry>,
  now: number,
  windowMs: number,
  maxEntries: number,
) => {
  if (store.size < maxEntries) return;
  for (const [ip, entry] of store.entries()) {
    if (now - entry.windowStartAt > windowMs) {
      store.delete(ip);
    }
  }
};

const toResetAtSeconds = (windowStartAt: number, windowMs: number) =>
  Math.ceil((windowStartAt + windowMs) / 1000);

const toRetryAfterSeconds = (windowStartAt: number, windowMs: number, now: number) =>
  Math.max(1, Math.ceil((windowStartAt + windowMs - now) / 1000));

export const checkChatRateLimit = (
  store: Map<string, ChatRateLimitEntry>,
  ip: string,
  options: ChatRateLimitOptions,
  now = Date.now(),
): ChatRateLimitResult => {
  const maxEntries = options.maxEntries ?? 1024;
  cleanupStaleEntries(store, now, options.windowMs, maxEntries);

  const entry = store.get(ip);
  if (!entry || now - entry.windowStartAt > options.windowMs) {
    store.set(ip, { count: 1, windowStartAt: now });
    return {
      limited: false,
      remaining: Math.max(0, options.maxRequests - 1),
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
      resetAtEpochSeconds: toResetAtSeconds(now, options.windowMs),
    };
  }

  if (entry.count >= options.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      retryAfterSeconds: toRetryAfterSeconds(entry.windowStartAt, options.windowMs, now),
      resetAtEpochSeconds: toResetAtSeconds(entry.windowStartAt, options.windowMs),
    };
  }

  entry.count += 1;
  store.set(ip, entry);
  return {
    limited: false,
    remaining: Math.max(0, options.maxRequests - entry.count),
    retryAfterSeconds: toRetryAfterSeconds(entry.windowStartAt, options.windowMs, now),
    resetAtEpochSeconds: toResetAtSeconds(entry.windowStartAt, options.windowMs),
  };
};
