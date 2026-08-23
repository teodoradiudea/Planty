/**
 * Mock for @op-engineering/op-sqlite
 * Simulates an in-memory SQLite database using a plain JS object store.
 */

type Row = Record<string, any>;

// In-memory store shared across the mock session
const tables: Record<string, Row[]> = {};

const mockDb = {
  execute: jest.fn((sql: string, params: any[] = []) => {
    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    // ------------------------------------------------------------------ CREATE
    if (upper.startsWith('CREATE TABLE')) {
      const match = trimmed.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
      if (match) {
        const table = match[1];
        if (!tables[table]) { tables[table] = []; }
      }
      return { rows: [], rowsAffected: 0 };
    }

    // ------------------------------------------------------------------ INSERT
    if (upper.startsWith('INSERT INTO')) {
      const tableMatch = trimmed.match(/INSERT INTO (\w+)/i);
      const colMatch = trimmed.match(/\(([^)]+)\)\s+VALUES/i);
      if (tableMatch && colMatch) {
        const table = tableMatch[1];
        const cols = colMatch[1].split(',').map(c => c.trim());
        const row: Row = {};
        cols.forEach((col, i) => { row[col] = params[i]; });
        if (!tables[table]) { tables[table] = []; }
        tables[table].push(row);
      }
      return { rows: [], rowsAffected: 1, insertId: 1 };
    }

    // ------------------------------------------------------------------ SELECT
    if (upper.startsWith('SELECT')) {
      const tableMatch = trimmed.match(/FROM (\w+)/i);
      if (tableMatch) {
        const table = tableMatch[1];
        return { rows: [...(tables[table] ?? [])] };
      }
      return { rows: [] };
    }

    // ------------------------------------------------------------------ UPDATE
    if (upper.startsWith('UPDATE')) {
      const tableMatch = trimmed.match(/UPDATE\s+(\w+)/i);
      // Use [\s\S] so the regex crosses newlines in multiline SQL strings
      const setMatch = trimmed.match(/SET\s+([\s\S]+?)\s+WHERE/i);
      const whereMatch = trimmed.match(/WHERE\s+id\s*=\s*\?/i);

      if (tableMatch && setMatch && whereMatch) {
        const table = tableMatch[1];
        const id = params[params.length - 1];
        const idx = (tables[table] ?? []).findIndex(r => r.id === id);

        if (idx !== -1) {
          // Parse "col=?, col=?, ..." from the SET clause
          const setCols = setMatch[1]
            .split(',')
            .map(s => s.trim().split('=')[0].trim());
          setCols.forEach((col, i) => {
            tables[table][idx][col] = params[i];
          });
        }
      }
      return { rows: [], rowsAffected: 1 };
    }

    // ------------------------------------------------------------------ DELETE
    if (upper.startsWith('DELETE')) {
      const tableMatch = trimmed.match(/FROM\s+(\w+)/i);
      const whereMatch = trimmed.match(/WHERE\s+id\s*=\s*\?/i);
      if (tableMatch && whereMatch) {
        const table = tableMatch[1];
        const id = params[0];
        tables[table] = (tables[table] ?? []).filter(r => r.id !== id);
      }
      return { rows: [], rowsAffected: 1 };
    }

    return { rows: [], rowsAffected: 0 };
  }),
};

// executeSync is the synchronous variant — same behaviour in the mock
(mockDb as any).executeSync = mockDb.execute;

export const open = jest.fn(() => mockDb);

/** Test helper: wipe all in-memory tables and reset call history */
export const __resetDb = () => {
  Object.keys(tables).forEach(k => delete tables[k]);
  mockDb.execute.mockClear();
  open.mockClear();
};
