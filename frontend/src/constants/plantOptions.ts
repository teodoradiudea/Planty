import type { Specie } from '../types/Specie';
import type { Status } from '../types/Status';

export const AVAILABLE_SPECIES: Specie[] = [
  { id: 1, name: 'Orchid', image: 'hshshhsda' },
  { id: 2, name: 'Poinsettia', image: 'isiisdj' },
];

export const AVAILABLE_STATUSES: Status[] = [
  { id: 1, name: 'Healthy' },
  { id: 2, name: 'Needs Water' },
  { id: 3, name: 'Wilting' },
];

export const SPECIE_EMOJI: Record<string, string> = {
  orchid: '🌸',
  poinsettia: '🌺',
};

export const STATUS_COLOR: Record<string, string> = {
  healthy: '#52B788',
  'needs water': '#E07A5F',
  wilting: '#D62839',
};
