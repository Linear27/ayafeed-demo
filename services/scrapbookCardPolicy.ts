import { TimelineItem } from '../types';

export type ScrapbookCardInteractionPolicy = {
  clickableContainer: boolean;
  primaryCta: 'title-link';
};

export const getScrapbookCardInteractionPolicy = (
  _item: Pick<TimelineItem, 'isToday' | 'isThisWeek' | 'type'>,
): ScrapbookCardInteractionPolicy => {
  return {
    clickableContainer: false,
    primaryCta: 'title-link',
  };
};
