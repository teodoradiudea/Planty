export interface Specie {
  id: number;
  name: string;
  /** Accurate watering interval in days for this species */
  wateringDays: number;
  /** Emoji representing this species */
  emoji: string;
}
