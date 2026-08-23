import {Specie} from './Specie';
import {Status} from './Status';


// export type PlantType = 'orchid' | 'poinsettia';

export interface Plant {
  id: string; // number
  name: string;
  specie: Specie;
  // type: PlantType;
  last_watered: string; // 'YYYY-MM-DD'
  status: Status;
  watering_days: number;
}

export type PlantFormData = Omit<Plant, 'id'>;
