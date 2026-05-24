/**
 * Sidebar navigation component.
 * Uses Next.js Link with active state detection.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/',          label: 'Dashboard',   icon: '📊' },
  { href: '/posts',     label: 'Posts Queue', icon: '📝' },
  { href: '/articles',  label: 'Articles',    icon: '📰' },
  { href: '/logs',      label: 'Logs',        icon: '📋' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[240px] bg-[#0d1117] border-r border-slate-800 flex flex-col z-40"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg">
            🪙
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Crypto News</p>
            <p className="text-xs text-slate-500 mt-0.5">Automation Bot</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Platform legend */}
      <div className="px-5 py-4 border-t border-slate-800">
        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
          Platforms
        </p>
        <ul className="space-y-1.5 text-xs text-slate-400">
          <li className="flex items-center gap-2"><span>✖️</span> X / Twitter <span className="ml-auto text-green-400 text-[10px]">auto</span></li>
          <li className="flex items-center gap-2"><span>📘</span> Facebook Page <span className="ml-auto text-green-400 text-[10px]">auto</span></li>
          <li className="flex items-center gap-2"><span>💼</span> LinkedIn <span className="ml-auto text-green-400 text-[10px]">auto</span></li>
          <li className="flex items-center gap-2"><span>💬</span> WhatsApp <span className="ml-auto text-purple-400 text-[10px]">manual</span></li>
          <li className="flex items-center gap-2"><span>👤</span> FB Profile <span className="ml-auto text-purple-400 text-[10px]">manual</span></li>
        </ul>
      </div>
    </aside>
  );
}
