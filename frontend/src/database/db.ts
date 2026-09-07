import { open } from '@op-engineering/op-sqlite';
import { computeStatus } from '../services/statusComputer';
import { AVAILABLE_SPECIES } from '../constants/plantOptions';
import type { Plant, PlantFormData } from '../types/Plant';

type DbType = ReturnType<typeof open>;
let _db: DbType | null = null;

/**
 * Opens (or returns the cached) database connection and ensures the schema is
 * up to date.
 *
 * DB file is named planty_v3.sqlite — bumped from v2 to drop the dead
 * status_id / status_name columns that were never read back.
 */
const getDb = (): DbType => {
  if (!_db) {
    _db = open({ name: 'planty_v3.sqlite' });
    _db.executeSync(`
      CREATE TABLE IF NOT EXISTS plants (
        id            TEXT    PRIMARY KEY NOT NULL,
        name          TEXT    NOT NULL,
        specie_id     INTEGER NOT NULL,
        specie_name   TEXT    NOT NULL,
        last_watered  TEXT    NOT NULL,
        watering_days INTEGER NOT NULL
      )
    `);
    _db.executeSync(`
      CREATE TABLE IF NOT EXISTS settings (
        key   TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      )
    `);
  }
  return _db;
};

const generateId = (): string =>
  `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * op-sqlite v18 executeSync returns either:
 *   { rows: Record<string,Scalar>[] }          ← already mapped
 *   { rawRows: Scalar[][], columnNames: string[] }  ← needs mapping
 * This helper normalises both into a plain array of objects.
 */
const extractRows = <T>(result: any): T[] => {
  if (!result) { return []; }

  // Already a mapped array
  if (Array.isArray(result.rows) && result.rows.length > 0) {
    return result.rows as T[];
  }

  // Raw rows that need to be zipped with column names
  if (
    Array.isArray(result.rawRows) &&
    result.rawRows.length > 0 &&
    Array.isArray(result.columnNames)
  ) {
    return result.rawRows.map((rawRow: any[]) => {
      const obj: Record<string, any> = {};
      (result.columnNames as string[]).forEach((col, i) => {
        obj[col] = rawRow[i];
      });
      return obj as T;
    });
  }

  // Legacy compat: rows._array (older react-native-sqlite-storage shape)
  if (result.rows?._array) {
    return result.rows._array as T[];
  }

  return [];
};

type RawRow = {
  id: string;
  name: string;
  specie_id: number;
  specie_name: string;
  last_watered: string;
  watering_days: number | string;
};

/** Maps a flat DB row back to the typed Plant interface */
const rowToPlant = (row: RawRow): Plant => {
  const wateringDays = Number(row.watering_days);
  // Reconstruct full Specie from the registry so wateringDays + emoji are fresh
  const specie =
    AVAILABLE_SPECIES.find(s => s.id === Number(row.specie_id)) ??
    { id: Number(row.specie_id), name: row.specie_name, wateringDays, emoji: '🌿' };
  return {
    id: row.id,
    name: row.name,
    specie,
    status: computeStatus(row.last_watered, wateringDays),
    last_watered: row.last_watered,
    watering_days: wateringDays,
  };
};

export const getAllPlants = (): Plant[] => {
  const db = getDb();
  try {
    const result = db.executeSync('SELECT * FROM plants ORDER BY rowid ASC');
    return extractRows<RawRow>(result).map(rowToPlant);
  } catch (err: any) {
    throw new Error(`getAllPlants failed: ${err?.message ?? err}`);
  }
};

/** Creates a plant and returns the fully hydrated Plant object (including generated id). */
export const createPlant = (data: PlantFormData): Plant => {
  const db = getDb();
  const id = generateId();
  try {
    db.executeSync(
      `INSERT INTO plants
         (id, name, specie_id, specie_name, last_watered, watering_days)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.specie.id,
        data.specie.name,
        data.last_watered,
        data.watering_days,
      ],
    );
  } catch (err: any) {
    throw new Error(`createPlant failed: ${err?.message ?? err}`);
  }
  return {
    id,
    name: data.name,
    specie: data.specie,
    status: computeStatus(data.last_watered, data.watering_days),
    last_watered: data.last_watered,
    watering_days: data.watering_days,
  };
};

export const updatePlant = (plant: Plant): void => {
  const db = getDb();
  try {
    db.executeSync(
      `UPDATE plants
       SET name=?, specie_id=?, specie_name=?, last_watered=?, watering_days=?
       WHERE id=?`,
      [
        plant.name,
        plant.specie.id,
        plant.specie.name,
        plant.last_watered,
        plant.watering_days,
        plant.id,
      ],
    );
  } catch (err: any) {
    throw new Error(`updatePlant failed: ${err?.message ?? err}`);
  }
};

export const deletePlant = (id: string): void => {
  const db = getDb();
  try {
    db.executeSync('DELETE FROM plants WHERE id=?', [id]);
  } catch (err: any) {
    throw new Error(`deletePlant failed: ${err?.message ?? err}`);
  }
};

/* ─── settings helpers ──────────────────────────────────────────────────── */

const DEFAULT_NOTIFICATION_HOUR = 17;

/** Returns the persisted notification hour (0-23), defaulting to 17. */
export const getNotificationHour = (): number => {
  const db = getDb();
  try {
    const result = db.executeSync(
      "SELECT value FROM settings WHERE key = 'notification_hour'",
    );
    const rows = extractRows<{ value: string }>(result);
    if (rows.length > 0) {
      const parsed = parseInt(rows[0].value, 10);
      return Number.isNaN(parsed) ? DEFAULT_NOTIFICATION_HOUR : parsed;
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_NOTIFICATION_HOUR;
};

/** Persists the notification hour (0-23). */
export const setNotificationHour = (hour: number): void => {
  const db = getDb();
  try {
    db.executeSync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES ('notification_hour', ?)`,
      [String(hour)],
    );
  } catch (err: any) {
    throw new Error(`setNotificationHour failed: ${err?.message ?? err}`);
  }
};

const DEFAULT_NOTIFICATION_MINUTE = 0;

/** Returns the persisted notification minute (0-59), defaulting to 0. */
export const getNotificationMinute = (): number => {
  const db = getDb();
  try {
    const result = db.executeSync(
      "SELECT value FROM settings WHERE key = 'notification_minute'",
    );
    const rows = extractRows<{ value: string }>(result);
    if (rows.length > 0) {
      const parsed = parseInt(rows[0].value, 10);
      return Number.isNaN(parsed) ? DEFAULT_NOTIFICATION_MINUTE : parsed;
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_NOTIFICATION_MINUTE;
};

/** Persists the notification minute (0-59). */
export const setNotificationMinute = (minute: number): void => {
  const db = getDb();
  try {
    db.executeSync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES ('notification_minute', ?)`,
      [String(minute)],
    );
  } catch (err: any) {
    throw new Error(`setNotificationMinute failed: ${err?.message ?? err}`);
  }
};

/** Only for use in Jest tests — resets the singleton so getDb() re-initialises */
export const _resetDbForTests = (): void => {
  _db = null;
};

