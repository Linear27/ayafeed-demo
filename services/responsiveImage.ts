const UNSPLASH_HOST = 'images.unsplash.com';

const normalizeWidths = (widths: number[]) =>
  Array.from(
    new Set(
      widths
        .filter((value) => Number.isFinite(value))
        .map((value) => Math.round(value))
        .filter((value) => value >= 160),
    ),
  ).sort((a, b) => a - b);

export const buildUnsplashSrcSet = (
  src: string | null | undefined,
  widths: number[] = [320, 480, 640, 960, 1280],
) => {
  if (!src) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return undefined;
  }

  if (!parsed.hostname.includes(UNSPLASH_HOST)) {
    return undefined;
  }

  const normalized = normalizeWidths(widths);
  if (normalized.length === 0) return undefined;

  return normalized
    .map((width) => {
      const next = new URL(parsed.toString());
      next.searchParams.set('w', String(width));
      if (!next.searchParams.has('q')) next.searchParams.set('q', '80');
      if (!next.searchParams.has('auto')) next.searchParams.set('auto', 'format');
      if (!next.searchParams.has('fit')) next.searchParams.set('fit', 'crop');
      return `${next.toString()} ${width}w`;
    })
    .join(', ');
};
