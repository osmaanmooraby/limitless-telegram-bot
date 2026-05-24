/**
 * Dashboard — Overview page
 *
 * Shows:
 *  - Key stats (articles, posts by status)
 *  - "Run Now" button to trigger automation manually
 *  - Recent posts needing approval
 *  - Last 5 log entries
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stats {
  articles:  { total: number };
  posts:     { total: number; pending: number; approved: number; posted: number; failed: number; manual: number };
  platforms: Record<string, number>;
  alerts:    { recentErrors: number };
}

interface RecentPost {
  id: string; platform: string; status: string; content: string;
  article: { title: string; url: string };
  createdAt: string;
}

interface LogEntry {
  id: string; type: string; status: string; message: string; runAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  pending:  'badge-pending',
  approved: 'badge-approved',
  posted:   'badge-posted',
  failed:   'badge-failed',
  rejected: 'badge-rejected',
  manual:   'badge-manual',
};

const PLATFORM_ICONS: Record<string, string> = {
  x: '✖️', facebook_page: '📘', linkedin: '💼', whatsapp: '💬', facebook_profile: '👤',
};

const LOG_ICONS: Record<string, string> = {
  success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats]               = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts]   = useState<RecentPost[]>([]);
  const [recentLogs, setRecentLogs]     = useState<LogEntry[]>([]);
  const [running, setRunning]           = useState(false);
  const [runResult, setRunResult]       = useState<string | null>(null);
  const [loading, setLoading]           = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, postsRes, logsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/posts?limit=6&status=pending'),
        fetch('/api/logs?limit=5'),
      ]);
      setStats(await statsRes.json());
      const postsData = await postsRes.json();
      setRecentPosts(postsData.posts ?? []);
      const logsData = await logsRes.json();
      setRecentLogs(logsData.logs ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function runNow() {
    setRunning(true);
    setRunResult(null);
    try {
      const res = await fetch('/api/run-automation', { method: 'POST' });
      const data = await res.json();
      if (data.skipped) {
        setRunResult(`⏭️ Skipped: ${data.skipReason}`);
      } else if (data.success) {
        setRunResult(`✅ Done — "${data.articleTitle}" — ${data.postsCreated} posts created`);
      } else {
        setRunResult(`❌ Failed: ${data.error}`);
      }
      await fetchData();
    } catch (e) {
      setRunResult('❌ Network error — check console');
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 animate-pulse text-lg">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Overview</h2>
          <p className="text-slate-400 text-sm mt-1">
            Daily crypto news automation — admin control centre
          </p>
        </div>

        {/* Run Now button */}
        <button
          onClick={runNow}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20"
        >
          {running ? (
            <><span className="animate-spin">⏳</span> Running…</>
          ) : (
            <><span>▶</span> Run Now</>
          )}
        </button>
      </div>

      {/* Run result banner */}
      {runResult && (
        <div className="glass-card px-5 py-3 text-sm text-slate-200">
          {runResult}
        </div>
      )}

      {/* ── Stats cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Articles Fetched"  value={stats?.articles.total ?? 0}   icon="📰" color="text-sky-400" />
        <StatCard label="Posts Pending"     value={stats?.posts.pending ?? 0}    icon="⏳" color="text-yellow-400" />
        <StatCard label="Posts Published"   value={stats?.posts.posted ?? 0}     icon="✅" color="text-green-400" />
        <StatCard label="Manual (copy)"     value={stats?.posts.manual ?? 0}     icon="📋" color="text-purple-400" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Approved"    value={stats?.posts.approved ?? 0}  icon="👍" color="text-blue-400" />
        <StatCard label="Failed"      value={stats?.posts.failed ?? 0}    icon="❌" color="text-red-400" />
        <StatCard label="24h Errors"  value={stats?.alerts.recentErrors ?? 0} icon="⚠️" color="text-orange-400" />
      </div>

      {/* ── Platform published counts ────────────────────────────────────── */}
      {stats?.platforms && Object.keys(stats.platforms).length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Published per Platform
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.platforms).map(([p, count]) => (
              <div key={p} className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
                <span>{PLATFORM_ICONS[p] ?? '🌐'}</span>
                <span className="text-slate-300 capitalize">{p.replace(/_/g, ' ')}</span>
                <span className="text-green-400 font-bold ml-1">{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Pending posts ────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Posts Awaiting Approval
          </h3>
          <a href="/posts" className="text-xs text-amber-400 hover:text-amber-300">
            View all →
          </a>
        </div>

        {recentPosts.length === 0 ? (
          <div className="glass-card px-5 py-6 text-center text-slate-500 text-sm">
            No posts pending approval 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="glass-card px-5 py-4 flex items-start gap-4">
                <span className="text-xl mt-0.5">{PLATFORM_ICONS[post.platform] ?? '🌐'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-1 truncate">
                    {post.article?.title}
                  </p>
                  <p className="text-sm text-slate-200 line-clamp-2">
                    {post.content.slice(0, 160)}…
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[post.status]}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent logs ──────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Recent Logs
          </h3>
          <a href="/logs" className="text-xs text-amber-400 hover:text-amber-300">
            View all →
          </a>
        </div>

        <div className="glass-card divide-y divide-slate-700/50">
          {recentLogs.length === 0 ? (
            <p className="px-5 py-4 text-slate-500 text-sm">No logs yet.</p>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                <span>{LOG_ICONS[log.status] ?? 'ℹ️'}</span>
                <span className="text-slate-400 text-xs w-20 shrink-0 uppercase">{log.type}</span>
                <span className="text-slate-200 flex-1">{log.message}</span>
                <span className="text-xs text-slate-600 shrink-0">
                  {new Date(log.runAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

// ─── Stat card sub-component ──────────────────────────────────────────────────

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="glass-card px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}
