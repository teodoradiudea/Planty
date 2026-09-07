import type { Specie } from '../types/Specie';
import type { Status } from '../types/Status';

/**
 * Full species list with accurate watering frequencies.
 * Emoji is co-located here — no separate SPECIE_EMOJI map needed.
 */
export const AVAILABLE_SPECIES: Specie[] = [
  { id: 1,  name: 'Orchid',        wateringDays: 7,  emoji: '🌸' },
  { id: 2,  name: 'Poinsettia',    wateringDays: 3,  emoji: '🌺' },
  { id: 3,  name: 'Succulent',     wateringDays: 14, emoji: '🪴' },
  { id: 4,  name: 'Pothos',        wateringDays: 7,  emoji: '🍃' },
  { id: 5,  name: 'Peace Lily',    wateringDays: 4,  emoji: '🌷' },
  { id: 6,  name: 'Snake Plant',   wateringDays: 14, emoji: '🌿' },
  { id: 7,  name: 'Spider Plant',  wateringDays: 5,  emoji: '🌱' },
  { id: 8,  name: 'Aloe Vera',     wateringDays: 14, emoji: '🌵' },
  { id: 9,  name: 'Monstera',      wateringDays: 7,  emoji: '🫧' },
  { id: 10, name: 'Lavender',      wateringDays: 5,  emoji: '💜' },
];

export const AVAILABLE_STATUSES: Status[] = [
  { id: 1, name: 'Healthy' },
  { id: 2, name: 'Needs Water' },
  { id: 3, name: 'Wilting' },
];

export const STATUS_COLOR: Record<string, string> = {
  healthy:       '#52B788',
  'needs water': '#E07A5F',
  wilting:       '#D62839',
};

/** Consistent fallback used across all components when status is unknown */
export const STATUS_COLOR_FALLBACK = '#9E9E9E';

