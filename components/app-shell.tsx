'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, Moon, Sun, Search, ChevronRight } from 'lucide-react';
import { hubData } from '@/lib/data';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import type { ThemeKey } from '@/lib/types';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/components', label: 'Composants', icon: '🧩' },
  { href: '/templates', label: 'Modèles', icon: '📋' },
  { href: '/activity', label: 'Activité', icon: '📡' },
  { href: '/tools', label: 'Outils', icon: '⚙' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode, themeKey, setThemeKey } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/components') return pathname.startsWith('/components');
    if (href === '/templates') return pathname.startsWith('/templates');
    if (href === '/tools') return pathname.startsWith('/tools');
    if (href === '/activity') return pathname.startsWith('/activity');
    return pathname.startsWith(href);
  };

  const isClientActive = (slug: string) => {
    return pathname.startsWith(`/clients/${slug}`) || pathname.startsWith(`/tokens/${slug}`) || pathname.startsWith(`/audit/${slug}`) || pathname.startsWith(`/performance/${slug}`) || pathname.startsWith(`/portal/${slug}`);
  };

  const themeEntries = Object.entries(hubData.themes) as [ThemeKey, (typeof hubData.themes)[ThemeKey]][];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-[260px] border-r border-[var(--border)] bg-[var(--bg-2)] transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-[60px] items-center gap-2 border-b border-[var(--border)] px-4">
          <img src={hubData.agency.logo} alt="WebEstrie" className="h-7 w-7 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="font-heading text-base text-[var(--ink)]">
            WebEstrie <span className="font-accent text-sm text-[var(--terracotta)]">design system</span>
          </span>
        </div>

        <nav className="flex h-[calc(100%-60px)] flex-col gap-4 overflow-y-auto p-3">
          {/* Navigation */}
          <div>
            <div className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
              Vue d'ensemble
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all',
                  isActive(item.href)
                    ? 'bg-[rgba(201,122,16,0.10)] font-semibold text-[var(--ink)]'
                    : 'text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]'
                )}
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Clients */}
          <div>
            <div className="mb-2 px-3 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
              Clients ({hubData.clients.length})
            </div>
            {hubData.clients.map((c) => (
              <div key={c.slug}>
                <Link
                  href={`/clients/${c.slug}`}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all',
                    isClientActive(c.slug)
                      ? 'bg-[rgba(201,122,16,0.10)] font-semibold text-[var(--ink)]'
                      : 'text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]'
                  )}
                >
                  <img src={c.logo} alt={c.name} className="h-6 w-6 rounded object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="rounded-full bg-[var(--bg-3)] px-1.5 py-0.5 text-xs font-semibold text-[var(--terracotta)]">
                    {c.missions.length}
                  </span>
                </Link>
                {isClientActive(c.slug) && (
                  <div className="ml-3 mt-0.5 flex flex-col gap-0.5">
                    <Link href={`/clients/${c.slug}`} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]">
                      <ChevronRight className="h-3 w-3" /> Détails
                    </Link>
                    <Link href={`/clients/${c.slug}/missions/M34`} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]">
                      <ChevronRight className="h-3 w-3" /> Time Machine
                    </Link>
                    <Link href={`/tokens/${c.slug}`} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]">
                      <ChevronRight className="h-3 w-3" /> Tokens
                    </Link>
                    <Link href={`/audit/${c.slug}`} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]">
                      <ChevronRight className="h-3 w-3" /> Audit
                    </Link>
                    <Link href={`/performance/${c.slug}`} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]">
                      <ChevronRight className="h-3 w-3" /> Performance
                    </Link>
                    <Link href={`/portal/${c.slug}`} className="flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-[var(--ink)] hover:bg-[rgba(201,122,16,0.06)]">
                      <ChevronRight className="h-3 w-3" /> Portail
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto px-3 py-2 text-xs text-[var(--terracotta)]">
            v{hubData.version} · {hubData.lastUpdated}
          </div>
        </nav>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-[60px] shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg)] px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] transition-all hover:border-[var(--amber)] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] transition-all hover:border-[var(--amber)] lg:flex"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--terracotta)]" />
            <input
              type="text"
              placeholder="Rechercher mission, sketch, page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--bg-2)] pl-9 pr-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)] focus:ring-2 focus:ring-[rgba(201,122,16,0.12)]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 text-xs text-[var(--ink)] transition-all hover:border-[var(--amber)]"
              >
                <span className="h-3 w-3 rounded-full border border-[var(--border)]" style={{ background: hubData.themes[themeKey].bg2 }} />
                <span>{hubData.themes[themeKey].name}</span>
                <span className="text-xs">▾</span>
              </button>
              {themeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setThemeDropdownOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-md)]">
                    {themeEntries.map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => { setThemeKey(key); setThemeDropdownOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--bg-2)]"
                      >
                        <div className="flex gap-0.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.bg }} />
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.ink }} />
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.amber }} />
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.greenMid }} />
                        </div>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] transition-all hover:border-[var(--amber)] hover:scale-105"
              title="Mode sombre/clair"
            >
              {darkMode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}