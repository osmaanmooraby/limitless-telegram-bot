/**
 * Daily Automation Scheduler
 *
 * Runs the crypto news automation pipeline on a cron schedule.
 * Default: every day at 09:00 AM (server local time).
 *
 * Usage:
 *   npm run scheduler
 *
 * The process stays alive and runs the job on schedule.
 * Use PM2 or a systemd service in production to keep it running.
 *
 * Override the schedule via environment variable:
 *   CRON_SCHEDULE="0 9 * * *"   → daily at 9 AM
 *   CRON_SCHEDULE="0 */6 * * *" → every 6 hours
 */

// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config({ path: require('path').resolve(__dirname, '../.env.local') });

import cron from 'node-cron';
import { runDailyAutomation } from '../src/lib/automation';

// ─── Config ───────────────────────────────────────────────────────────────────

// Default: 09:00 every day
const SCHEDULE = process.env.CRON_SCHEDULE ?? '0 9 * * *';
const TIMEZONE = process.env.CRON_TIMEZONE ?? 'Europe/London';

// ─── Validation ───────────────────────────────────────────────────────────────

if (!cron.validate(SCHEDULE)) {
  console.error(`❌ Invalid cron expression: "${SCHEDULE}"`);
  console.error('   Please set a valid CRON_SCHEDULE in your .env.local file.');
  process.exit(1);
}

// ─── Register job ─────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════');
console.log('  🪙  Crypto News Bot — Daily Scheduler');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Schedule : ${SCHEDULE} (${TIMEZONE})`);
console.log(`  Started  : ${new Date().toISOString()}`);
console.log('═══════════════════════════════════════════════════════');

cron.schedule(
  SCHEDULE,
  async () => {
    console.log(`\n[${new Date().toISOString()}] ⏰ Cron fired — running daily automation…\n`);

    const result = await runDailyAutomation();

    if (result.skipped) {
      console.log(`\n[${new Date().toISOString()}] ⏭️  Skipped: ${result.skipReason}`);
    } else if (result.success) {
      console.log(`\n[${new Date().toISOString()}] ✅ Done — ${result.postsCreated} posts created, ${result.postsPublished} published`);
    } else {
      console.error(`\n[${new Date().toISOString()}] ❌ Automation failed: ${result.error}`);
    }
  },
  { timezone: TIMEZONE },
);

console.log('\n  Scheduler is running. Press Ctrl+C to stop.\n');

// Keep process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down scheduler gracefully.');
  process.exit(0);
});
