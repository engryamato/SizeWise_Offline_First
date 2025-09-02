// Phase 0 — DataService outline (better-sqlite3)
// Validates: WAL PRAGMA, atomic migration runner, settings persistence, basic error mapping
// Note: Requires better-sqlite3 at runtime. Install later.

// @ts-ignore types present after deps install
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

type DbHandle = any; // better-sqlite3 Database

export type DbErrorCode =
  | 'E_DB_OPEN'
  | 'E_DB_MIGRATION'
  | 'E_DB_CONSTRAINT'
  | 'E_DB_IO'
  | 'E_DB_UNKNOWN';

export class DbError extends Error {
  code: DbErrorCode;
  details?: unknown;
  constructor(code: DbErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export class DataService {
  readonly dbPath: string;
  private db?: DbHandle;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  init(): void {
    try {
      this.open();
      this.applyPragmas();
      this.runMigrations();
      this.ensureAppMeta();
    } catch (err) {
      throw this.mapSqliteError(err, 'E_DB_MIGRATION', 'Failed to initialize database');
    }
  }

  close(): void {
    this.db?.close?.();
    this.db = undefined;
  }

  get isOpen(): boolean {
    return !!this.db;
  }

  get journalMode(): string {
    const r = this.db!.pragma('journal_mode', { simple: true });
    return Array.isArray(r) ? r[0].journal_mode : r;
  }

  get foreignKeys(): number {
    const r = this.db!.pragma('foreign_keys', { simple: true });
    return Array.isArray(r) ? r[0].foreign_keys : r;
  }

  // Settings API
  getEngineSetting<T = unknown>(key: string): T | undefined {
    const row = this.db!.prepare('SELECT value_json FROM engine_settings WHERE key = ?').get(key);
    if (!row) return undefined;
    try {
      return JSON.parse(row.value_json) as T;
    } catch {
      return undefined;
    }
  }

  setEngineSetting(key: string, value: unknown): void {
    const value_json = JSON.stringify(value);
    this.db!
      .prepare(
        "INSERT INTO engine_settings (key, value_json, updated_at) VALUES (@key, @value_json, strftime('%Y-%m-%dT%H:%M:%fZ','now'))\n         ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updated_at=excluded.updated_at"
      )
      .run({ key, value_json });
  }

  // Backup (best-effort; if not supported, simple file copy when possible)
  async backupTo(destPath: string): Promise<void> {
    if (!this.db) throw new DbError('E_DB_OPEN', 'Database not open');
    const db: any = this.db;
    if (typeof db.backup === 'function') {
      await db.backup(destPath);
    } else {
      // Fallback for older versions: simple copy if file-based
      if (this.dbPath === ':memory:') throw new DbError('E_DB_IO', 'Cannot backup in-memory database');
      await fs.promises.copyFile(this.dbPath, destPath);
    }
  }

  // Internal
  private open(): void {
    try {
      // @ts-ignore
      this.db = new Database(this.dbPath);
      this.db.pragma('foreign_keys = ON');
    } catch (err) {
      throw this.mapSqliteError(err, 'E_DB_OPEN', 'Failed to open database');
    }
  }

  private applyPragmas(): void {
    // WAL mode; synchronous NORMAL as a starting point; tune later per spec
    const jm = this.db!.pragma('journal_mode = WAL', { simple: true });
    // Ensure the returned mode is WAL
    const mode = Array.isArray(jm) ? jm[0].journal_mode : jm;
    if ((mode || '').toString().toLowerCase() !== 'wal') {
      throw new DbError('E_DB_MIGRATION', `Failed to enable WAL (journal_mode=${mode})`);
    }
    this.db!.pragma('synchronous = NORMAL');
    this.db!.pragma('temp_store = MEMORY');
    this.db!.pragma('cache_size = -16000'); // ~16MB
  }

  private runMigrations(): void {
    const migrationsDir = path.resolve(process.cwd(), 'sql/migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    this.db!.exec('BEGIN');
    try {
      for (const file of files) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        this.db!.exec(sql);
      }
      this.db!.exec('COMMIT');
    } catch (err) {
      try { this.db!.exec('ROLLBACK'); } catch {}
      throw this.mapSqliteError(err, 'E_DB_MIGRATION', 'Migration application failed');
    }

    // Record applied migrations if table exists
    const hasApplied = this.tableExists('migrations_applied');
    if (hasApplied) {
      const stmt = this.db!.prepare(
        "INSERT INTO migrations_applied (id, applied_at) VALUES (?, strftime('%Y-%m-%dT%H:%M:%fZ','now')) ON CONFLICT(id) DO NOTHING"
      );
      for (const file of files) stmt.run(file);
    }
  }

  private ensureAppMeta(): void {
    if (!this.tableExists('app_meta')) return;
    const row = this.db!.prepare('SELECT id FROM app_meta WHERE id = 1').get();
    const latest = this.latestMigrationId();
    if (!row) {
      this.db!
        .prepare(
          "INSERT INTO app_meta (id, schema_version, last_migrated_at) VALUES (1, ?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))"
        )
        .run(latest);
    } else {
      this.db!
        .prepare(
          "UPDATE app_meta SET schema_version = ?, last_migrated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now'), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = 1"
        )
        .run(latest);
    }
  }

  private tableExists(name: string): boolean {
    const row = this.db!.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(name);
    return !!row;
  }

  private latestMigrationId(): string {
    const dir = path.resolve(process.cwd(), 'sql/migrations');
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));
    return files[files.length - 1] ?? 'unknown';
  }

  private mapSqliteError(err: any, fallback: DbErrorCode, msg: string): DbError {
    const message = err?.message ?? String(err);
    if (/SQLITE_CONSTRAINT/.test(message)) return new DbError('E_DB_CONSTRAINT', msg, message);
    if (/SQLITE_IOERR/.test(message)) return new DbError('E_DB_IO', msg, message);
    if (/SQLITE/.test(message)) return new DbError(fallback, msg, message);
    return new DbError('E_DB_UNKNOWN', msg, message);
  }
}

