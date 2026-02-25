
import { Circle } from '../../types';
import { HANDCRAFTED_CIRCLES } from './handcrafted';
import { generateCircles } from './generator';

export const CIRCLES: Circle[] = [
  ...HANDCRAFTED_CIRCLES,
  ...generateCircles(200)
];
