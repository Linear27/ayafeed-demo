
import { Circle } from '../../types';
import { HANDCRAFTED_CIRCLES } from './handcrafted';
import { generateCircles } from './generator';
import { EVENTS } from '../events/index';

const EVENT_SEEDS = EVENTS.map((event) => ({
  id: event.id,
  title: event.title,
  date: event.date,
}));

export const CIRCLES: Circle[] = [
  ...HANDCRAFTED_CIRCLES,
  ...generateCircles(Math.max(200, EVENT_SEEDS.length * 18), EVENT_SEEDS),
];
