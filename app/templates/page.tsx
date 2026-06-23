'use client';

import { useState } from 'react';
import { ChevronDown, Check, Sparkles, Layers, Rocket } from 'lucide-react';
import { hubData } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TemplateCategory } from '@/lib/types';

const categoryBadgeVariant: Record<TemplateCategory, 'default' | 'live' | 'progress' | 'archive' | 'done' | 'pending' | 'rejected'> = {
  hero: 'default',
  gallery: 'progress',
  form: 'pending',
  CTA: 'rejected',
  harmonization: 'done',
  stats: 'live',
  component: 'archive',
  structure: 'default',
};

const categoryIcon: Record<TemplateCategory, string> = {
  hero: '🖼',
  gallery: '🖼',
  form: '📝',
  CTA: '🎯',
  harmonization: '🎨',
  stats: '📊',
  component: '🧩',
  structure: '🏗',
};

export default function TemplatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const templates = hubData.templates;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-up">
        <span className="inline-block rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
          Patterns réutilisables
        </span>
        <h1 className="mt-4 font-heading text-3xl text-[var(--ink)]">
          Modèles de <span className="font-accent text-[var(--terracotta)]">mission</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--terracotta)]">
          Templates dérivés des missions C&T Arbro. Chaque modèle encapsule les décisions clés et les étapes pour reproduire un pattern éprouvé.
        </p>
      </div>

      {/* Template grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl, i) => {
          const isExpanded = expandedId === tpl.id;
          return (
            <Card
              key={tpl.id}
              className="card-hover flex h-full flex-col p-5 animate-fade-up"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{categoryIcon[tpl.category]}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-base text-[var(--ink)]">{tpl.name}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge variant={categoryBadgeVariant[tpl.category]}>{tpl.category}</Badge>
                    <span className="rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--terracotta)]">
                      Basé sur {tpl.basedOn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-[var(--terracotta)]">{tpl.description}</p>

              {/* Expandable section */}
              {isExpanded && (
                <div className="animate-fade-in mt-4 space-y-4 border-t border-[var(--border)] pt-4">
                  {/* Key decisions */}
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">
                      Décisions clés
                    </h4>
                    <ul className="space-y-1.5">
                      {tpl.keyDecisions.map((d, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[var(--green-mid)] mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Steps checklist */}
                  <div>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">
                      Étapes pour reproduire
                    </h4>
                    <ol className="space-y-1.5">
                      {tpl.steps.map((s, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--bg-2)] text-[9px] font-bold text-[var(--terracotta)]">
                            {j + 1}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Reference */}
                  <div className="text-xs text-[var(--terracotta)] border-t border-[var(--border)] pt-2">
                    <Sparkles className="inline h-3 w-3 mr-1" />
                    Référence: Mission {tpl.basedOn}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-3">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : tpl.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-[var(--terracotta)] transition-colors hover:text-[var(--amber)]"
                >
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')} />
                  {isExpanded ? 'Réduire' : 'Détails'}
                </button>
                <button
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--amber)] px-3 py-1.5 text-xs font-medium text-white transition-all hover:brightness-110"
                  onClick={() => {
                    // Non-functional placeholder — would create a new mission from template
                  }}
                >
                  <Rocket className="h-3 w-3" />
                  Utiliser
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}