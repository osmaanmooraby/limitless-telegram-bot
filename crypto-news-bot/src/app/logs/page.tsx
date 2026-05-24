/**
 * Logs — /logs
 * View all automation run logs with filtering.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface Log {
  id: string;
  type: string;
  status: string;
  message: string;
  details: string | null;
  runAt: string;
}

const LOG_ICONS: Record<string, string> = {
  success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️',
};
const LOG_COLORS: Record<string, string> = {
  success: 'text-green-400', error: 'text-red-400', warning: 'text-yellow-400', info: 'text-slate-400',
};
const TYPE_COLORS: Record<string, string> = {
  fetch: 'text-sky-400', generate: 'text-purple-400', post: 'text-green-400',
  scheduler: 'text-amber-400', image: 'text-pink-400', system: 'text-slate-400',
};

export default function LogsPage() {
  const [logs, setLogs]       = useState<Log[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [type, setType]       = useState('all');
  const [status, setStatus]   = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '30' });
    if (type   !== 'all') params.set('type',   type);
    if (status !== 'all') params.set('status', status);

    const res  = await fetch(`/api/logs?${params}`);
    const data = await res.json();
    setLogs(data.logs ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, type, status]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  async function clearOldLogs() {
    if (!confirm('Delete logs older than 30 days?')) return;
    await fetch('/api/logs', { method: 'DELETE' });
    await fetchLogs();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Automation Logs</h2>
          <p className="text-slate-400 text-sm mt-1">
            {total} log entr{total !== 1 ? 'ies' : 'y'} — full audit trail
          </p>
        </div>
        <button
          onClick={clearOldLogs}
          className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-colors"
        >
          🗑 Clear old logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <span className="text-xs text-slate-400">Type:</span>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            {['all', 'fetch', 'generate', 'post', 'image', 'scheduler', 'system'].map((t) => (
              <option key={t} value={t} className="bg-slate-800">{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            {['all', 'success', 'error', 'warning', 'info'].map((s) => (
              <option key={s} value={s} className="bg-slate-800">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading logs…</div>
      ) : logs.length === 0 ? (
        <div className="glass-card px-6 py-12 text-center text-slate-500">
          No logs found for the selected filters.
        </div>
      ) : (
        <div className="glass-card divide-y divide-slate-700/50 overflow-hidden">
          {logs.map((log) => {
            const parsedDetails = log.details ? (() => {
              try { return JSON.parse(log.details); } catch { return null; }
            })() : null;

            return (
              <div key={log.id}>
                <div
                  className="px-5 py-3 flex items-center gap-3 text-sm cursor-pointer hover:bg-slate-700/20 transition-colors"
                  onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                >
                  {/* Icon */}
                  <span className="text-base shrink-0">{LOG_ICONS[log.status] ?? 'ℹ️'}</span>

                  {/* Type */}
                  <span className={`text-xs uppercase font-mono w-20 shrink-0 ${TYPE_COLORS[log.type] ?? 'text-slate-400'}`}>
                    {log.type}
                  </span>

                  {/* Message */}
                  <span className={`flex-1 ${LOG_COLORS[log.status] ?? 'text-slate-300'}`}>
                    {log.message}
                  </span>

                  {/* Time */}
                  <span className="text-xs text-slate-600 shrink-0">
                    {new Date(log.runAt).toLocaleString('en-GB', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}
                  </span>

                  {/* Expand indicator */}
                  {parsedDetails && (
                    <span className="text-xs text-slate-600">
                      {expanded === log.id ? '▲' : '▼'}
                    </span>
                  )}
                </div>

                {/* Expanded details */}
                {expanded === log.id && parsedDetails && (
                  <div className="px-5 pb-3 ml-12">
                    <pre className="bg-slate-900/60 rounded-lg p-3 text-xs text-slate-300 overflow-x-auto border border-slate-700/50">
                      {JSON.stringify(parsedDetails, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 30 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 glass-card hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            ← Previous
          </button>
          <span>Page {page} of {Math.ceil(total / 30)}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 30)}
            className="px-4 py-2 glass-card hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
