/**
 * GET /api/logs
 * Returns recent automation logs.
 *
 * Query params:
 *   type   (fetch | generate | post | scheduler | image | system | all)
 *   status (success | error | warning | info | all)
 *   page   (default 1)
 *   limit  (default 50)
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const type   = searchParams.get('type');
    const status = searchParams.get('status');
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit  = Math.min(200, parseInt(searchParams.get('limit') ?? '50'));

    const where: Record<string, unknown> = {};
    if (type   && type   !== 'all') where.type   = type;
    if (status && status !== 'all') where.status = status;

    const [logs, total] = await Promise.all([
      db.log.findMany({
        where,
        orderBy: { runAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
      }),
      db.log.count({ where }),
    ]);

    return NextResponse.json({ logs, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

/**
 * DELETE /api/logs
 * Clears logs older than 30 days (cleanup utility).
 */
export async function DELETE() {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const result = await db.log.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}
