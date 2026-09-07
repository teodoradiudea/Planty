import { Specie } from './Specie';
import { Status } from './Status';

export interface Plant {
  id: string;
  name: string;
  specie: Specie;
  last_watered: string; // 'YYYY-MM-DD'
  status: Status;
  watering_days: number;
}

export type PlantFormData = Omit<Plant, 'id'>;
