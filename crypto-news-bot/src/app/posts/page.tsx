/**
 * Posts Queue — /posts
 *
 * Approval dashboard for all generated posts.
 * Admins can:
 *   - Review the full generated caption
 *   - View the image prompt
 *   - Approve (auto-platforms) or copy content (manual platforms)
 *   - Reject a post
 *   - Publish immediately
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  platform: string;
  content: string;
  imagePrompt: string | null;
  imageUrl: string | null;
  status: string;
  postId: string | null;
  errorMessage: string | null;
  createdAt: string;
  postedAt: string | null;
  article: { id: string; title: string; url: string };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLATFORMS = ['all', 'x', 'facebook_page', 'linkedin', 'whatsapp', 'facebook_profile'];
const STATUSES  = ['all', 'pending', 'approved', 'posted', 'failed', 'rejected', 'manual'];

const PLATFORM_ICONS: Record<string, string> = {
  x: '✖️', facebook_page: '📘', linkedin: '💼', whatsapp: '💬', facebook_profile: '👤',
};
const PLATFORM_LABELS: Record<string, string> = {
  x: 'X / Twitter', facebook_page: 'Facebook Page', linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp', facebook_profile: 'Facebook Profile',
};
const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-pending', approved: 'badge-approved', posted: 'badge-posted',
  failed: 'badge-failed', rejected: 'badge-rejected', manual: 'badge-manual',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function PostsPage() {
  const [posts, setPosts]           = useState<Post[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [status, setStatus]         = useState('all');
  const [platform, setPlatform]     = useState('all');
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState<string | null>(null);
  const [copiedId, setCopiedId]     = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (status   !== 'all') params.set('status',   status);
    if (platform !== 'all') params.set('platform', platform);

    const res  = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, status, platform]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function doAction(id: string, action: 'approve' | 'reject' | 'publish') {
    setActionId(id);
    try {
      await fetch(`/api/posts/${id}/${action}`, { method: 'POST' });
      await fetchPosts();
    } finally {
      setActionId(null);
    }
  }

  async function copyContent(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Posts Queue</h2>
        <p className="text-slate-400 text-sm mt-1">
          {total} post{total !== 1 ? 's' : ''} — review, approve, and publish
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            {STATUSES.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
          </select>
        </div>

        {/* Platform filter */}
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <span className="text-xs text-slate-400">Platform:</span>
          <select
            value={platform}
            onChange={(e) => { setPlatform(e.target.value); setPage(1); }}
            className="bg-transparent text-slate-200 text-sm focus:outline-none cursor-pointer"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p} className="bg-slate-800">
                {p === 'all' ? 'All platforms' : PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading posts…</div>
      ) : posts.length === 0 ? (
        <div className="glass-card px-6 py-12 text-center text-slate-500">
          No posts match the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isManual   = ['whatsapp', 'facebook_profile'].includes(post.platform);
            const isExpanded = expandedId === post.id;

            return (
              <div key={post.id} className="glass-card overflow-hidden">
                {/* Post header */}
                <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-700/50">
                  <span className="text-xl">{PLATFORM_ICONS[post.platform]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 truncate">
                      {post.article?.title}
                    </p>
                    <p className="text-sm font-medium text-slate-200 mt-0.5">
                      {PLATFORM_LABELS[post.platform]}
                      {isManual && (
                        <span className="ml-2 text-xs text-purple-400">⚠️ Manual post</span>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[post.status] ?? ''}`}>
                      {post.status}
                    </span>

                    {/* Expand / collapse */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : post.id)}
                      className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded border border-slate-700 hover:border-slate-500 transition-colors"
                    >
                      {isExpanded ? '▲ Hide' : '▼ View'}
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 py-4 space-y-4">
                    {/* Generated caption */}
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                        Generated Caption
                      </p>
                      <pre className="bg-slate-900/60 rounded-lg p-4 text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed border border-slate-700/50">
                        {post.content}
                      </pre>
                    </div>

                    {/* Image */}
                    {post.imageUrl && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                          Generated Image
                        </p>
                        <img
                          src={post.imageUrl}
                          alt="Generated"
                          className="rounded-lg max-h-48 object-cover border border-slate-700/50"
                        />
                      </div>
                    )}

                    {/* Image prompt */}
                    {post.imagePrompt && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                          Image Prompt
                        </p>
                        <p className="text-xs text-slate-400 bg-slate-900/40 rounded-lg p-3 border border-slate-700/50">
                          {post.imagePrompt}
                        </p>
                      </div>
                    )}

                    {/* Error message */}
                    {post.errorMessage && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-300">
                        ❌ {post.errorMessage}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {/* Copy button (always visible) */}
                      <button
                        onClick={() => copyContent(post.id, post.content)}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
                      >
                        {copiedId === post.id ? '✅ Copied!' : '📋 Copy Content'}
                      </button>

                      {/* Approve (for auto platforms in pending/failed) */}
                      {!isManual && ['pending', 'failed'].includes(post.status) && (
                        <button
                          disabled={actionId === post.id}
                          onClick={() => doAction(post.id, 'approve')}
                          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm text-white transition-colors"
                        >
                          👍 Approve
                        </button>
                      )}

                      {/* Publish now (auto platforms that are approved) */}
                      {!isManual && ['approved', 'pending'].includes(post.status) && (
                        <button
                          disabled={actionId === post.id}
                          onClick={() => doAction(post.id, 'publish')}
                          className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-sm text-white transition-colors"
                        >
                          {actionId === post.id ? '⏳ Publishing…' : '🚀 Publish Now'}
                        </button>
                      )}

                      {/* Reject */}
                      {!['rejected', 'posted'].includes(post.status) && (
                        <button
                          disabled={actionId === post.id}
                          onClick={() => doAction(post.id, 'reject')}
                          className="px-4 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 disabled:opacity-50 text-sm text-red-300 transition-colors"
                        >
                          ✗ Reject
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 glass-card hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            ← Previous
          </button>
          <span>Page {page} of {Math.ceil(total / 10)}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 10)}
            className="px-4 py-2 glass-card hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
