import { open } from '@op-engineering/op-sqlite';
import { computeStatus } from '../services/statusComputer';
import type { Plant, PlantFormData } from '../types/Plant';

type DbType = ReturnType<typeof open>;
let _db: DbType | null = null;

/**
 * Opens (or returns the cached) database connection and ensures the schema is
 * up to date.
 *
 * DB file is named planty_v2.sqlite — bump the name when the schema changes
 * again so stale tables don't cause column-mismatch errors.
 */
const getDb = (): DbType => {
  if (!_db) {
    _db = open({ name: 'planty_v2.sqlite' });
    _db.executeSync(`
      CREATE TABLE IF NOT EXISTS plants (
        id           TEXT    PRIMARY KEY NOT NULL,
        name         TEXT    NOT NULL,
        specie_id    INTEGER NOT NULL,
        specie_name  TEXT    NOT NULL,
        status_id    INTEGER NOT NULL,
        status_name  TEXT    NOT NULL,
        last_watered TEXT    NOT NULL,
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
  status_id: number;
  status_name: string;
  last_watered: string;
  watering_days: number | string;
};

/** Maps a flat DB row back to the typed Plant interface */
const rowToPlant = (row: RawRow): Plant => {
  const wateringDays = Number(row.watering_days);
  return {
    id: row.id,
    name: row.name,
    specie: { id: Number(row.specie_id), name: row.specie_name },
    status: computeStatus(row.last_watered, wateringDays),
    last_watered: row.last_watered,
    watering_days: wateringDays,
  };
};

export const getAllPlants = (): Plant[] => {
  const db = getDb();
  const result = db.executeSync('SELECT * FROM plants ORDER BY rowid ASC');
  console.log('[db] getAllPlants raw result:', JSON.stringify(result));
  const plants = extractRows<RawRow>(result).map(rowToPlant);
  console.log('[db] getAllPlants mapped count:', plants.length);
  return plants;
};

export const createPlant = (data: PlantFormData): void => {
  const db = getDb();
  const id = generateId();
  console.log('[db] createPlant: inserting id=', id, 'name=', data.name);
  db.executeSync(
    `INSERT INTO plants
       (id, name, specie_id, specie_name, status_id, status_name, last_watered, watering_days)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.specie.id,
      data.specie.name,
      data.status.id,
      data.status.name,
      data.last_watered,
      data.watering_days,
    ],
  );
  console.log('[db] createPlant: insert done');
};

export const updatePlant = (plant: Plant): void => {
  const db = getDb();
  db.executeSync(
    `UPDATE plants
     SET name=?, specie_id=?, specie_name=?, status_id=?, status_name=?, last_watered=?, watering_days=?
     WHERE id=?`,
    [
      plant.name,
      plant.specie.id,
      plant.specie.name,
      plant.status.id,
      plant.status.name,
      plant.last_watered,
      plant.watering_days,
      plant.id,
    ],
  );
};

export const deletePlant = (id: string): void => {
  const db = getDb();
  db.executeSync('DELETE FROM plants WHERE id=?', [id]);
};

/* ─── settings helpers ──────────────────────────────────────────────────── */

const DEFAULT_NOTIFICATION_HOUR = 17;

/** Returns the persisted notification hour (0-23), defaulting to 17. */
export const getNotificationHour = (): number => {
  const db = getDb();
  const result = db.executeSync(
    "SELECT value FROM settings WHERE key = 'notification_hour'",
  );
  const rows = extractRows<{ value: string }>(result);
  if (rows.length > 0) {
    const parsed = parseInt(rows[0].value, 10);
    return Number.isNaN(parsed) ? DEFAULT_NOTIFICATION_HOUR : parsed;
  }
  return DEFAULT_NOTIFICATION_HOUR;
};

/** Persists the notification hour (0-23). */
export const setNotificationHour = (hour: number): void => {
  const db = getDb();
  db.executeSync(
    `INSERT OR REPLACE INTO settings (key, value) VALUES ('notification_hour', ?)`,
    [String(hour)],
  );
};

/** Only for use in Jest tests — resets the singleton so getDb() re-initialises */
export const _resetDbForTests = (): void => {
  _db = null;
};
