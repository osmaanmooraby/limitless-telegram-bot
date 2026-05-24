/**
 * Logger
 *
 * Writes structured logs to both the console and the SQLite database.
 * Every automation step (fetch, rewrite, post, scheduler) creates a log
 * entry so you can audit exactly what happened and when.
 */

import db from './db';

export type LogType = 'fetch' | 'generate' | 'post' | 'scheduler' | 'image' | 'system';
export type LogStatus = 'success' | 'error' | 'warning' | 'info';

/**
 * Writes a log entry to the database and prints it to stdout.
 * @param type    Category of the log (fetch, generate, post, etc.)
 * @param status  Outcome severity
 * @param message Human-readable summary
 * @param details Optional extra context (will be JSON-stringified)
 */
export async function logEntry(
  type: LogType,
  status: LogStatus,
  message: string,
  details?: Record<string, unknown>,
): Promise<void> {
  const timestamp = new Date().toISOString();
  const icon = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[status];

  // Console output
  console.log(`[${timestamp}] ${icon} [${type.toUpperCase()}] ${message}`);
  if (details) {
    console.log('  Details:', JSON.stringify(details, null, 2));
  }

  // DB write — silently ignore DB errors so logging never crashes the app
  try {
    await db.log.create({
      data: {
        type,
        status,
        message,
        details: details ? JSON.stringify(details) : undefined,
      },
    });
  } catch (err) {
    console.error('[logger] Failed to write log to DB:', err);
  }
}

/**
 * Convenience wrappers for common log levels.
 */
export const log = {
  info:    (type: LogType, msg: string, d?: Record<string, unknown>) => logEntry(type, 'info', msg, d),
  success: (type: LogType, msg: string, d?: Record<string, unknown>) => logEntry(type, 'success', msg, d),
  warn:    (type: LogType, msg: string, d?: Record<string, unknown>) => logEntry(type, 'warning', msg, d),
  error:   (type: LogType, msg: string, d?: Record<string, unknown>) => logEntry(type, 'error', msg, d),
};
