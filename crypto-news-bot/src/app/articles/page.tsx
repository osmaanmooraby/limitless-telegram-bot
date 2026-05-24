/**
 * Articles — /articles
 * Lists all articles fetched from Cointelegraph RSS.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface Article {
  id: string;
  title: string;
  url: string;
  description: string;
  author: string | null;
  category: string | null;
  imageUrl: string | null;
  publishedAt: string;
  isProcessed: boolean;
  posts: { id: string; platform: string; status: string }[];
}

const STATUS_BADGE: Record<string, string> = {
  pending:  'badge-pending', approved: 'badge-approved', posted: 'badge-posted',
  failed:   'badge-failed',  rejected: 'badge-rejected', manual: 'badge-manual',
};
const PLATFORM_ICONS: Record<string, string> = {
  x: '✖️', facebook_page: '📘', linkedin: '💼', whatsapp: '💬', facebook_profile: '👤',
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    const res  = await fetch(`/api/articles?page=${page}&limit=15`);
    const data = await res.json();
    setArticles(data.articles ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Articles</h2>
        <p className="text-slate-400 text-sm mt-1">
          {total} article{total !== 1 ? 's' : ''} fetched from Cointelegraph RSS
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading articles…</div>
      ) : articles.length === 0 ? (
        <div className="glass-card px-6 py-12 text-center text-slate-500">
          No articles yet. Run the automation to fetch the first batch.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="glass-card px-5 py-4 flex gap-4 items-start">
              {/* Thumbnail */}
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg shrink-0 border border-slate-700/50"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-700/40 flex items-center justify-center text-2xl shrink-0">
                  📰
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-100 hover:text-amber-400 text-sm leading-snug transition-colors"
                  >
                    {article.title}
                  </a>
                  {article.isProcessed ? (
                    <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full shrink-0">
                      ✓ Processed
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 bg-slate-700/40 border border-slate-700 px-2 py-0.5 rounded-full shrink-0">
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {article.description}
                </p>

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-slate-500">
                    {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {article.category && (
                    <span className="text-xs text-slate-500">
                      {article.category}
                    </span>
                  )}
                  {article.author && (
                    <span className="text-xs text-slate-500">by {article.author}</span>
                  )}
                </div>

                {/* Post status chips */}
                {article.posts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {article.posts.map((post) => (
                      <span
                        key={post.id}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[post.status] ?? ''}`}
                      >
                        {PLATFORM_ICONS[post.platform]} {post.status}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 glass-card hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            ← Previous
          </button>
          <span>Page {page} of {Math.ceil(total / 15)}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 15)}
            className="px-4 py-2 glass-card hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
