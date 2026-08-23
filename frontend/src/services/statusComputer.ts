import { AVAILABLE_STATUSES } from '../constants/plantOptions';
import type { Status } from '../types/Status';

/**
 * Computes a plant's status based on how many days remain until the next
 * watering date.
 *
 *  - Healthy     → next watering is 2+ days away
 *  - Needs Water → next watering is today or tomorrow
 *  - Wilting     → next watering date has passed (overdue)
 */
export const computeStatus = (lastWatered: string, wateringDays: number): Status => {
  const [y, m, d] = lastWatered.split('-').map(Number);
  const lastDate = new Date(y, m - 1, d);
  lastDate.setHours(0, 0, 0, 0);

  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + wateringDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = nextDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffDays < 0) {
    // Overdue
    return AVAILABLE_STATUSES.find(s => s.name === 'Wilting') ?? AVAILABLE_STATUSES[2];
  }
  if (diffDays <= 1) {
    // Due today or tomorrow
    return AVAILABLE_STATUSES.find(s => s.name === 'Needs Water') ?? AVAILABLE_STATUSES[1];
  }
  // Plenty of time
  return AVAILABLE_STATUSES.find(s => s.name === 'Healthy') ?? AVAILABLE_STATUSES[0];
};
