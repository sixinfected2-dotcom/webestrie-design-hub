'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, Circle, Clock, Search } from 'lucide-react';
import { hubData } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PageStatus } from '@/lib/types';

interface ChecklistItem {
  id: string;
  label: string;
  category: string;
}

const checklistItems: ChecklistItem[] = [
  // SEO
  { id: 'meta-title', label: 'Meta title présent et optimisé', category: 'SEO' },
  { id: 'meta-desc', label: 'Meta description', category: 'SEO' },
  { id: 'og-image', label: 'Open Graph image', category: 'SEO' },
  { id: 'canonical', label: 'URL canonique', category: 'SEO' },
  // Accessibility
  { id: 'alt-texts', label: 'Textes alt sur toutes les images', category: 'Accessibilité' },
  { id: 'aria-labels', label: 'Labels ARIA sur éléments interactifs', category: 'Accessibilité' },
  { id: 'color-contrast', label: 'Contraste de couleurs conforme (WCAG AA)', category: 'Accessibilité' },
  { id: 'focus-states', label: 'États de focus visibles', category: 'Accessibilité' },
  // Performance
  { id: 'img-optimization', label: 'Images optimisées (WebP/AVIF)', category: 'Performance' },
  { id: 'lazy-loading', label: 'Lazy loading sur images below-the-fold', category: 'Performance' },
  { id: 'font-loading', label: 'Font loading optimisé (preload/display swap)', category: 'Performance' },
  // Content
  { id: 'h1-present', label: 'H1 présent et unique', category: 'Contenu' },
  { id: 'h2-structure', label: 'Structure H2 logique', category: 'Contenu' },
  { id: 'cta-present', label: 'CTA présent et visible', category: 'Contenu' },
  { id: 'contact-info', label: 'Informations de contact présentes', category: 'Contenu' },
  // Responsive
  { id: 'mobile-layout', label: 'Layout mobile (320-768px)', category: 'Responsive' },
  { id: 'tablet-layout', label: 'Layout tablette (768-1024px)', category: 'Responsive' },
  { id: 'desktop-layout', label: 'Layout desktop (1024px+)', category: 'Responsive' },
];

const categories = ['SEO', 'Accessibilité', 'Performance', 'Contenu', 'Responsive'];
const statusFilters: ('all' | PageStatus)[] = ['all', 'live', 'in-progress', 'pending'];

const statusLabels: Record<PageStatus, string> = {
  live: 'Live',
  'in-progress': 'En cours',
  pending: 'En attente',
};

const statusIcon: Record<PageStatus, React.ReactNode> = {
  live: <Check className="h-3.5 w-3.5 text-white" />,
  'in-progress': <Circle className="h-2.5 w-2.5 fill-current text-white" />,
  pending: <Clock className="h-3.5 w-3.5" />,
};

const statusBadgeClass: Record<PageStatus, string> = {
  live: 'bg-[var(--green-mid)] text-white',
  'in-progress': 'bg-[var(--amber)] text-white',
  pending: 'bg-[var(--bg-3)] text-[var(--terracotta)]',
};

export function AuditChecklist({ clientSlug }: { clientSlug: string }) {
  const client = hubData.clients.find((c) => c.slug === clientSlug);
  if (!client) return <div>Client introuvable</div>;

  const [filter, setFilter] = useState<'all' | PageStatus>('all');
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`audit-${clientSlug}`) || '{}');
      setChecks(stored);
    } catch {}
  }, [clientSlug]);

  // Save to localStorage
  const saveCheck = useCallback((key: string, value: boolean) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(`audit-${clientSlug}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, [clientSlug]);

  const filteredPages = filter === 'all'
    ? client.pages
    : client.pages.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--ink)]">Audit — {client.name}</h1>
        <p className="text-sm text-[var(--terracotta)]">Checklist interactive avec persistance localStorage</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              filter === f
                ? 'border-[var(--amber)] bg-[var(--amber)] text-white'
                : 'border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] hover:border-[var(--amber)]'
            )}
          >
            {f === 'all' ? `Toutes (${client.pages.length})` : `${statusLabels[f]} (${client.pages.filter((p) => p.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Page audit cards */}
      <div className="space-y-6">
        {filteredPages.map((page) => {
          const pageKey = `${page.path}`;
          const pageChecks = checklistItems.filter((item) => checks[`${pageKey}-${item.id}`]).length;
          const totalChecks = checklistItems.length;
          const progress = Math.round((pageChecks / totalChecks) * 100);

          return (
            <Card key={page.path} className="overflow-hidden">
              {/* Page header */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded', statusBadgeClass[page.status])}>
                  {statusIcon[page.status]}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg text-[var(--ink)]">{page.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--terracotta)]">
                    <code>{page.path}</code>
                    <span>·</span>
                    <span>Mission: {page.mission}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-2xl text-[var(--ink)]">{pageChecks}/{totalChecks}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--terracotta)]">checks passés</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[var(--bg-3)]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--amber)] to-[var(--amber-light)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Checklist grid */}
              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const catItems = checklistItems.filter((i) => i.category === cat);
                  const catPassed = catItems.filter((i) => checks[`${pageKey}-${i.id}`]).length;
                  return (
                    <div key={cat}>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta)]">{cat}</h4>
                        <span className="text-[10px] text-[var(--terracotta)]">{catPassed}/{catItems.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {catItems.map((item) => {
                          const checkKey = `${pageKey}-${item.id}`;
                          const isChecked = checks[checkKey] || false;
                          return (
                            <label
                              key={item.id}
                              className="flex cursor-pointer items-start gap-2 rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-2)]"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => saveCheck(checkKey, e.target.checked)}
                                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--border)] accent-[var(--green-mid)]"
                              />
                              <span className={cn('text-xs', isChecked ? 'text-[var(--ink)] line-through opacity-60' : 'text-[var(--ink)]')}>
                                {item.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}