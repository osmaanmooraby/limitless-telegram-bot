/**
 * Root layout — wraps every page with the sidebar and top nav.
 */

import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title:       'Crypto News Bot — Admin Dashboard',
  description: 'Daily crypto news automation and social media publishing dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0f1117] text-slate-200 flex">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <Sidebar />

        {/* ── Main content ────────────────────────────────────────────── */}
        <main className="flex-1 ml-[240px] min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur border-b border-slate-800 px-6 py-3 flex items-center justify-between">
            <h1 className="text-sm font-medium text-slate-400">
              🪙 Crypto News Automation
            </h1>
            <span className="text-xs text-slate-600">
              {new Date().toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </header>

          {/* Page content */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
