export type UiRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type ViewportSize = {
  width: number;
  height: number;
};

export type LauncherAvoidanceInput = {
  launcherRect: UiRect;
  targetRect: UiRect;
  viewport: ViewportSize;
  liftPx?: number;
  shiftLeftPx?: number;
  safeGapPx?: number;
};

export type LauncherAvoidanceOffset = {
  offsetX: number;
  offsetY: number;
};

const overlapLength = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
  Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));

const getOverlapArea = (a: UiRect, b: UiRect) =>
  overlapLength(a.left, a.right, b.left, b.right) *
  overlapLength(a.top, a.bottom, b.top, b.bottom);

const translateRect = (rect: UiRect, offsetX: number, offsetY: number): UiRect => ({
  left: rect.left + offsetX,
  right: rect.right + offsetX,
  top: rect.top - offsetY,
  bottom: rect.bottom - offsetY,
  width: rect.width,
  height: rect.height,
});

const staysInViewport = (rect: UiRect, viewport: ViewportSize, safeGapPx: number) =>
  rect.left >= safeGapPx &&
  rect.right <= viewport.width - safeGapPx &&
  rect.top >= safeGapPx &&
  rect.bottom <= viewport.height - safeGapPx;

export const resolveLauncherAvoidance = ({
  launcherRect,
  targetRect,
  viewport,
  liftPx = 64,
  shiftLeftPx = 64,
  safeGapPx = 8,
}: LauncherAvoidanceInput): LauncherAvoidanceOffset => {
  const baseOverlap = getOverlapArea(launcherRect, targetRect);
  if (baseOverlap <= 0) {
    return { offsetX: 0, offsetY: 0 };
  }

  const upwardCandidate = translateRect(launcherRect, 0, liftPx);
  const upwardOverlap = staysInViewport(upwardCandidate, viewport, safeGapPx)
    ? getOverlapArea(upwardCandidate, targetRect)
    : Number.POSITIVE_INFINITY;
  if (upwardOverlap <= 0) {
    return { offsetX: 0, offsetY: liftPx };
  }

  const leftCandidate = translateRect(launcherRect, -shiftLeftPx, 0);
  const leftOverlap = staysInViewport(leftCandidate, viewport, safeGapPx)
    ? getOverlapArea(leftCandidate, targetRect)
    : Number.POSITIVE_INFINITY;
  if (leftOverlap <= 0) {
    return { offsetX: -shiftLeftPx, offsetY: 0 };
  }

  if (upwardOverlap < baseOverlap && upwardOverlap <= leftOverlap) {
    return { offsetX: 0, offsetY: liftPx };
  }

  if (leftOverlap < baseOverlap) {
    return { offsetX: -shiftLeftPx, offsetY: 0 };
  }

  return { offsetX: 0, offsetY: 0 };
};
