const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_BUSINESS_TIME_ZONE = 'Asia/Shanghai';

const buildDateKey = (parts: Intl.DateTimeFormatPart[]) => {
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return null;
  }

  return `${year}-${month}-${day}`;
};

const parseDateKeyToUtc = (dateKey: string) => {
  if (!DATE_KEY_RE.test(dateKey)) {
    return null;
  }

  const parsed = new Date(`${dateKey}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const extractDateKey = (dateTime: string | null | undefined) => {
  if (!dateTime) return null;
  const candidate = dateTime.split('T')[0]?.trim();
  if (!candidate || !DATE_KEY_RE.test(candidate)) return null;
  return candidate;
};

export const getBusinessDateKey = (timeZone = DEFAULT_BUSINESS_TIME_ZONE, now = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const key = buildDateKey(formatter.formatToParts(now));

  if (key) return key;
  return now.toISOString().slice(0, 10);
};

export const diffCalendarDays = (fromDateKey: string, toDateKey: string) => {
  const from = parseDateKeyToUtc(fromDateKey);
  const to = parseDateKeyToUtc(toDateKey);

  if (!from || !to) return 0;
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
};

export const getRecentWindowCount = (
  dateKeys: Array<string | null | undefined>,
  anchorDateKey: string,
  windowDays = 7,
) => {
  return dateKeys.reduce((count, key) => {
    if (!key) return count;
    const delta = diffCalendarDays(anchorDateKey, key);
    if (delta >= 0 && delta < windowDays) {
      return count + 1;
    }
    return count;
  }, 0);
};
