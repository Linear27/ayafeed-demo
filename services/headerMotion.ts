export type HeaderMotionPhase = 'masthead' | 'compressing' | 'docked';

export type HeaderMotionInput = {
  isLanding: boolean;
  scrollY: number;
  mastheadBottom: number;
  compressStart: number;
  dockStart: number;
};

export type HeaderMotionState = {
  phase: HeaderMotionPhase;
  progress: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const getHeaderMotionState = ({
  isLanding,
  scrollY,
  mastheadBottom,
  compressStart,
  dockStart,
}: HeaderMotionInput): HeaderMotionState => {
  if (!isLanding) {
    return { phase: 'docked', progress: 1 };
  }

  const trigger = Math.max(scrollY, compressStart - mastheadBottom);

  if (trigger <= compressStart) {
    return { phase: 'masthead', progress: 0 };
  }

  if (trigger >= dockStart) {
    return { phase: 'docked', progress: 1 };
  }

  const progress = clamp((trigger - compressStart) / (dockStart - compressStart), 0, 1);

  return {
    phase: 'compressing',
    progress,
  };
};
