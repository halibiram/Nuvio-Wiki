import Database from 'better-sqlite3';
import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const METRICS_KEY_NAME = 'metrics_anonymization_key';
export const DEFAULT_ADMIN_TRAFFIC_MAX_ENTRIES = 500_000;

function parseEntry(row) {
  try {
    const value = JSON.parse(row.payload_json);
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

function boundedLimit(value, fallback, maximum) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, maximum);
}

/**
 * Durable storage for privacy-safe admin telemetry and anonymous feedback.
 * Request identity is already HMAC-digested before it reaches this database.
 */
export function createAdminDataStore({
  file,
  maxTrafficEntries = DEFAULT_ADMIN_TRAFFIC_MAX_ENTRIES
} = {}) {
  if (!file) throw new Error('Admin data database file is required.');

  const databaseFile = file === ':memory:' ? file : resolve(file);
  if (databaseFile !== ':memory:') mkdirSync(dirname(databaseFile), { recursive: true });

  const db = new Database(databaseFile);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('busy_timeout = 5000');
  db.pragma('temp_store = MEMORY');
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_data_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    ) WITHOUT ROWID;

    CREATE TABLE IF NOT EXISTS admin_request_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recorded_at INTEGER NOT NULL,
      method TEXT NOT NULL,
      route TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      duration_ms REAL NOT NULL,
      client_id TEXT
    );
    CREATE INDEX IF NOT EXISTS admin_request_metrics_recorded_at
      ON admin_request_metrics (recorded_at);

    CREATE TABLE IF NOT EXISTS admin_request_metric_totals (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      requests INTEGER NOT NULL,
      successful INTEGER NOT NULL,
      client_errors INTEGER NOT NULL,
      server_errors INTEGER NOT NULL,
      total_duration_ms REAL NOT NULL,
      max_duration_ms REAL NOT NULL
    );
    INSERT OR IGNORE INTO admin_request_metric_totals (
      id, requests, successful, client_errors, server_errors,
      total_duration_ms, max_duration_ms
    ) VALUES (1, 0, 0, 0, 0, 0, 0);

    CREATE TABLE IF NOT EXISTS admin_setup_doctor_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payload_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_page_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      payload_json TEXT NOT NULL
    );
  `);

  const getMeta = db.prepare('SELECT value FROM admin_data_meta WHERE key = ?');
  const setMeta = db.prepare(`
    INSERT INTO admin_data_meta (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);

  let anonymizationKey = null;
  const storedKey = getMeta.get(METRICS_KEY_NAME)?.value;
  if (storedKey) {
    try {
      const decoded = Buffer.from(storedKey, 'base64url');
      if (decoded.length >= 16) anonymizationKey = decoded;
    } catch {
      anonymizationKey = null;
    }
  }
  if (!anonymizationKey) {
    anonymizationKey = randomBytes(32);
    setMeta.run(METRICS_KEY_NAME, anonymizationKey.toString('base64url'));
  }

  const trafficLimit = boundedLimit(
    maxTrafficEntries,
    DEFAULT_ADMIN_TRAFFIC_MAX_ENTRIES,
    10_000_000
  );

  const selectRequestMetrics = db.prepare(`
    SELECT recorded_at, method, route, status_code, duration_ms, client_id
    FROM admin_request_metrics
    ORDER BY id ASC
  `);
  const insertRequestMetric = db.prepare(`
    INSERT INTO admin_request_metrics (
      recorded_at, method, route, status_code, duration_ms, client_id
    ) VALUES (
      @timestamp, @method, @route, @statusCode, @durationMs, @clientId
    )
  `);
  const countRequestMetrics = db.prepare(
    'SELECT COUNT(*) AS count FROM admin_request_metrics'
  );
  const deleteOldestRequestMetrics = db.prepare(`
    DELETE FROM admin_request_metrics
    WHERE id IN (
      SELECT id FROM admin_request_metrics ORDER BY id ASC LIMIT ?
    )
  `);
  const selectRequestMetricTotals = db.prepare(`
    SELECT requests, successful, client_errors, server_errors,
      total_duration_ms, max_duration_ms
    FROM admin_request_metric_totals
    WHERE id = 1
  `);
  const updateRequestMetricTotals = db.prepare(`
    UPDATE admin_request_metric_totals
    SET requests = requests + 1,
      successful = successful + @successful,
      client_errors = client_errors + @clientErrors,
      server_errors = server_errors + @serverErrors,
      total_duration_ms = total_duration_ms + @durationMs,
      max_duration_ms = MAX(max_duration_ms, @durationMs)
    WHERE id = 1
  `);
  const seedRequestMetricTotals = db.prepare(`
    UPDATE admin_request_metric_totals
    SET requests = @requests,
      successful = @successful,
      client_errors = @clientErrors,
      server_errors = @serverErrors,
      total_duration_ms = @totalDurationMs,
      max_duration_ms = @maxDurationMs
    WHERE id = 1
  `);
  const aggregateRequestMetrics = db.prepare(`
    SELECT COUNT(*) AS requests,
      SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) AS successful,
      SUM(CASE WHEN status_code >= 400 AND status_code < 500 THEN 1 ELSE 0 END) AS clientErrors,
      SUM(CASE WHEN status_code >= 500 THEN 1 ELSE 0 END) AS serverErrors,
      COALESCE(SUM(duration_ms), 0) AS totalDurationMs,
      COALESCE(MAX(duration_ms), 0) AS maxDurationMs
    FROM admin_request_metrics
  `);
  let requestMetricCount = countRequestMetrics.get().count;
  if (selectRequestMetricTotals.get().requests === 0 && requestMetricCount > 0) {
    seedRequestMetricTotals.run(aggregateRequestMetrics.get());
  }
  if (requestMetricCount > trafficLimit) {
    deleteOldestRequestMetrics.run(requestMetricCount - trafficLimit);
    requestMetricCount = trafficLimit;
  }
  const persistRequestMetric = db.transaction((entry) => {
    if (requestMetricCount >= trafficLimit) {
      requestMetricCount -= deleteOldestRequestMetrics.run(1).changes;
    }
    insertRequestMetric.run(entry);
    const statusCode = Number(entry.statusCode);
    updateRequestMetricTotals.run({
      durationMs: Number(entry.durationMs),
      successful: statusCode < 400 ? 1 : 0,
      clientErrors: statusCode >= 400 && statusCode < 500 ? 1 : 0,
      serverErrors: statusCode >= 500 ? 1 : 0
    });
    requestMetricCount += 1;
  });

  function createFeedbackRepository(table, fallbackLimit, maximumLimit) {
    const select = db.prepare(`
      SELECT payload_json
      FROM (
        SELECT id, payload_json FROM ${table} ORDER BY id DESC LIMIT ?
      )
      ORDER BY id ASC
    `);
    const insert = db.prepare(`INSERT INTO ${table} (payload_json) VALUES (?)`);
    const prune = db.prepare(`
      DELETE FROM ${table}
      WHERE id NOT IN (SELECT id FROM ${table} ORDER BY id DESC LIMIT ?)
    `);
    const record = db.transaction((entry, limit) => {
      insert.run(JSON.stringify(entry));
      prune.run(boundedLimit(limit, fallbackLimit, maximumLimit));
    });

    return {
      load(limit) {
        return select.all(boundedLimit(limit, fallbackLimit, maximumLimit))
          .map(parseEntry)
          .filter(Boolean);
      },
      record
    };
  }

  const setupDoctorFeedback = createFeedbackRepository(
    'admin_setup_doctor_feedback',
    100,
    1_000
  );
  const pageFeedback = createFeedbackRepository('admin_page_feedback', 500, 5_000);

  return Object.freeze({
    databaseFile,
    trafficRetentionLimit: trafficLimit,
    anonymizationKey: Buffer.from(anonymizationKey),
    loadRequestMetrics() {
      return selectRequestMetrics.all().map((row) => ({
        timestamp: row.recorded_at,
        method: row.method,
        route: row.route,
        statusCode: row.status_code,
        durationMs: row.duration_ms,
        clientId: row.client_id
      }));
    },
    loadRequestMetricTotals() {
      const totals = selectRequestMetricTotals.get();
      return {
        requests: totals.requests,
        successful: totals.successful,
        clientErrors: totals.client_errors,
        serverErrors: totals.server_errors,
        totalDurationMs: totals.total_duration_ms,
        maxDurationMs: totals.max_duration_ms
      };
    },
    recordRequestMetric(entry) {
      persistRequestMetric(entry);
    },
    loadSetupDoctorFeedback(limit) {
      return setupDoctorFeedback.load(limit);
    },
    recordSetupDoctorFeedback(entry, limit) {
      setupDoctorFeedback.record(entry, limit);
    },
    loadPageFeedback(limit) {
      return pageFeedback.load(limit);
    },
    recordPageFeedback(entry, limit) {
      pageFeedback.record(entry, limit);
    },
    close() {
      db.close();
    }
  });
}
