/**
 * Unit tests for src/database/db.ts
 * Uses the in-memory op-sqlite mock (wired via jest.config.js moduleNameMapper).
 */

import {
  _resetDbForTests,
  createPlant,
  deletePlant,
  getAllPlants,
  updatePlant,
} from '../src/database/db';
import { __resetDb } from './__mocks__/@op-engineering/op-sqlite';

const ORCHID_SPECIE = { id: 1, name: 'Orchid' };
const POINSETTIA_SPECIE = { id: 2, name: 'Poinsettia' };
const HEALTHY_STATUS = { id: 1, name: 'Healthy' };
const NEEDS_WATER_STATUS = { id: 2, name: 'Needs Water' };

const ORCHID_DATA = {
  name: 'My Orchid',
  specie: ORCHID_SPECIE,
  status: HEALTHY_STATUS,
  last_watered: '2026-08-15',
  watering_days: 7,
};

const POINSETTIA_DATA = {
  name: 'Red Beauty',
  specie: POINSETTIA_SPECIE,
  status: NEEDS_WATER_STATUS,
  last_watered: '2026-08-14',
  watering_days: 3,
};

beforeEach(() => {
  __resetDb();
  _resetDbForTests();
});

// ---------------------------------------------------------------------------

describe('getAllPlants', () => {
  it('returns empty array when no plants exist', () => {
    expect(getAllPlants()).toEqual([]);
  });

  it('returns all created plants', () => {
    createPlant(ORCHID_DATA);
    createPlant(POINSETTIA_DATA);
    expect(getAllPlants()).toHaveLength(2);
  });

  it('reconstructs specie object correctly', () => {
    createPlant(ORCHID_DATA);
    const [plant] = getAllPlants();
    expect(plant.specie).toEqual(ORCHID_SPECIE);
  });

  it('reconstructs status object correctly', () => {
    createPlant(ORCHID_DATA);
    const [plant] = getAllPlants();
    expect(plant.status).toEqual(HEALTHY_STATUS);
  });
});

// ---------------------------------------------------------------------------

describe('createPlant', () => {
  it('adds a plant that then appears in getAllPlants', () => {
    createPlant(ORCHID_DATA);
    const plants = getAllPlants();
    expect(plants).toHaveLength(1);
    expect(plants[0].name).toBe('My Orchid');
    expect(plants[0].watering_days).toBe(7);
  });

  it('assigns a unique id to each plant', () => {
    createPlant(ORCHID_DATA);
    createPlant(POINSETTIA_DATA);
    const [a, b] = getAllPlants();
    expect(a.id).toBeDefined();
    expect(b.id).toBeDefined();
    expect(a.id).not.toBe(b.id);
  });

  it('stores specie and status as nested objects', () => {
    createPlant(POINSETTIA_DATA);
    const [p] = getAllPlants();
    expect(p.specie.id).toBe(2);
    expect(p.specie.name).toBe('Poinsettia');
    expect(p.status.id).toBe(2);
    expect(p.status.name).toBe('Needs Water');
  });
});

// ---------------------------------------------------------------------------

describe('updatePlant', () => {
  it('updates name and watering_days', () => {
    createPlant(ORCHID_DATA);
    const [plant] = getAllPlants();

    updatePlant({ ...plant, name: 'Updated', watering_days: 14 });

    const updated = getAllPlants().find(p => p.id === plant.id);
    expect(updated?.name).toBe('Updated');
    expect(updated?.watering_days).toBe(14);
  });

  it('updates specie and status objects', () => {
    createPlant(ORCHID_DATA);
    const [plant] = getAllPlants();

    updatePlant({ ...plant, specie: POINSETTIA_SPECIE, status: NEEDS_WATER_STATUS });

    const updated = getAllPlants().find(p => p.id === plant.id);
    expect(updated?.specie).toEqual(POINSETTIA_SPECIE);
    expect(updated?.status).toEqual(NEEDS_WATER_STATUS);
  });

  it('does not modify other plants', () => {
    createPlant(ORCHID_DATA);
    createPlant(POINSETTIA_DATA);
    const [first, second] = getAllPlants();

    updatePlant({ ...first, name: 'Changed' });

    expect(getAllPlants().find(p => p.id === second.id)?.name).toBe('Red Beauty');
  });
});

// ---------------------------------------------------------------------------

describe('deletePlant', () => {
  it('removes the plant from the list', () => {
    createPlant(ORCHID_DATA);
    const [plant] = getAllPlants();
    deletePlant(plant.id);
    expect(getAllPlants()).toHaveLength(0);
  });

  it('only removes the targeted plant', () => {
    createPlant(ORCHID_DATA);
    createPlant(POINSETTIA_DATA);
    const [first, second] = getAllPlants();
    deletePlant(first.id);
    expect(getAllPlants()).toHaveLength(1);
    expect(getAllPlants()[0].id).toBe(second.id);
  });

  it('is a no-op when the id does not exist', () => {
    createPlant(ORCHID_DATA);
    deletePlant('non-existent-id');
    expect(getAllPlants()).toHaveLength(1);
  });
});
