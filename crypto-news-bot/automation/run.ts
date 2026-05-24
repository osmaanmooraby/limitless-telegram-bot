/**
 * Manual Trigger Script
 *
 * Run the full automation pipeline immediately (ignores the cron schedule).
 * Useful for testing or manually triggering an extra run.
 *
 * Usage:
 *   npm run run-now
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local from the project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { runDailyAutomation } from '../src/lib/automation';

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🪙  Crypto News Bot — Manual Run');
  console.log(`  Started: ${new Date().toISOString()}`);
  console.log('═══════════════════════════════════════════════════════\n');

  const result = await runDailyAutomation();

  console.log('\n═══════════════════════════════════════════════════════');
  if (result.skipped) {
    console.log('  ⏭️  SKIPPED');
    console.log(`  Reason: ${result.skipReason}`);
  } else if (result.success) {
    console.log('  ✅ SUCCESS');
    console.log(`  Article : ${result.articleTitle}`);
    console.log(`  URL     : ${result.articleUrl}`);
    console.log(`  Posts   : ${result.postsCreated} created, ${result.postsPublished} published`);
  } else {
    console.log('  ❌ FAILED');
    console.log(`  Error: ${result.error}`);
  }
  console.log('═══════════════════════════════════════════════════════\n');

  process.exit(result.success ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
