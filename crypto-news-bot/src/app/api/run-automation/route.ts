/**
 * POST /api/run-automation
 * Triggers a manual run of the full automation pipeline from the dashboard.
 * Returns the result immediately (no streaming — waits for completion).
 *
 * ⚠️  This can take 30-60 seconds depending on AI + image generation speed.
 *      In production, consider queuing this as a background job.
 */

import { NextResponse } from 'next/server';
import { runDailyAutomation } from '@/lib/automation';
import { logEntry } from '@/lib/logger';

// Use Edge or Node runtime — Node required for Prisma + file system
export const runtime = 'nodejs';
// Increase timeout for AI calls
export const maxDuration = 120; // seconds (Next.js Pro / Vercel)

export async function POST() {
  try {
    await logEntry('system', 'info', 'Manual automation run triggered from dashboard');
    const result = await runDailyAutomation();
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
