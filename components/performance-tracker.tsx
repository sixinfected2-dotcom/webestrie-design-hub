'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Check, TrendingUp, TrendingDown, Minus, Target, Calendar } from 'lucide-react';
import { getClient } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ClientLogo } from '@/components/client-logo';
import type { PerformanceEntry, PerformanceBudget } from '@/lib/types';

interface PerformanceTrackerProps {
  clientSlug: string;
  initialEntries: PerformanceEntry[];
}

const budget: PerformanceBudget = {
  lcp: 2.5,
  cls: 0.1,
  lighthouse: 90,
  inp: 200,
};

type ScoreColor = 'green' | 'amber' | 'red';

function getScoreColor(value: number, type: 'lcp' | 'cls' | 'lighthouse' | 'inp'): ScoreColor {
  if (type === 'lighthouse') {
    if (value > 90) return 'green';
    if (value >= 50) return 'amber';
    return 'red';
  }
  // For LCP, CLS, INP — lower is better
  if (value <= budget[type] * 0.8) return 'green';
  if (value <= budget[type]) return 'amber';
  return 'red';
}

const colorClasses: Record<ScoreColor, { text: string; bg: string; border: string }> = {
  green: { text: 'text-[var(--green-mid)]', bg: 'bg-[rgba(94,158,64,0.08)]', border: 'border-[var(--green-mid)]' },
  amber: { text: 'text-[var(--amber)]', bg: 'bg-[rgba(201,122,16,0.08)]', border: 'border-[var(--amber)]' },
  red: { text: 'text-[#b43c3c]', bg: 'bg-[rgba(180,60,60,0.08)]', border: 'border-[#b43c3c]' },
};

function getTrend(current: number, previous: number | undefined, lowerIsBetter: boolean): { icon: React.ReactNode; color: string } {
  if (previous === undefined) return { icon: <Minus className="h-3 w-3" />, color: 'text-[var(--terracotta)]' };
  if (current === previous) return { icon: <Minus className="h-3 w-3" />, color: 'text-[var(--terracotta)]' };
  const improved = lowerIsBetter ? current < previous : current > previous;
  if (improved) return { icon: <TrendingUp className="h-3 w-3" />, color: 'text-[var(--green-mid)]' };
  return { icon: <TrendingDown className="h-3 w-3" />, color: 'text-[#b43c3c]' };
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function ScoreCard({ label, value, unit, type, previousValue }: {
  label: string;
  value: number;
  unit: string;
  type: 'lcp' | 'cls' | 'lighthouse' | 'inp';
  previousValue?: number;
}) {
  const color = getScoreColor(value, type);
  const cc = colorClasses[color];
  const lowerIsBetter = type !== 'lighthouse';
  const trend = getTrend(value, previousValue, lowerIsBetter);

  return (
    <div className={cn('rounded-xl border p-4', cc.border, cc.bg)}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={cn('font-heading text-3xl', cc.text)}>{value}</span>
        <span className="text-sm text-[var(--terracotta)]">{unit}</span>
        <span className={cn('ml-auto flex items-center gap-0.5 text-xs', trend.color)}>
          {trend.icon}
        </span>
      </div>
    </div>
  );
}

export function PerformanceTracker({ clientSlug, initialEntries }: PerformanceTrackerProps) {
  const client = getClient(clientSlug);
  const [entries, setEntries] = useState<PerformanceEntry[]>(initialEntries);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    lcp: '',
    cls: '',
    lighthouse: '',
    inp: '',
    missionId: '',
    notes: '',
  });

  if (!client) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--terracotta)]">Client introuvable.</p>
      </div>
    );
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sortedEntries[0];
  const previous = sortedEntries[1];

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: clientSlug,
          date: formData.date,
          lcp: parseFloat(formData.lcp) || 0,
          cls: parseFloat(formData.cls) || 0,
          lighthouse: parseInt(formData.lighthouse) || 0,
          inp: parseInt(formData.inp) || 0,
          missionId: formData.missionId || undefined,
          notes: formData.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
        setShowForm(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          lcp: '',
          cls: '',
          lighthouse: '',
          inp: '',
          missionId: '',
          notes: '',
        });
      }
    } catch {}
    setSaving(false);
  }, [clientSlug, formData]);

  const budgetChecks = [
    { label: 'LCP', target: `< ${budget.lcp}s`, value: latest?.lcp, pass: (latest?.lcp ?? 999) < budget.lcp, display: `${latest?.lcp}s` },
    { label: 'CLS', target: `< ${budget.cls}`, value: latest?.cls, pass: (latest?.cls ?? 999) < budget.cls, display: `${latest?.cls}` },
    { label: 'Lighthouse', target: `> ${budget.lighthouse}`, value: latest?.lighthouse, pass: (latest?.lighthouse ?? 0) > budget.lighthouse, display: `${latest?.lighthouse}` },
    { label: 'INP', target: `< ${budget.inp}ms`, value: latest?.inp, pass: (latest?.inp ?? 999) < budget.inp, display: `${latest?.inp}ms` },
  ];

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href={`/clients/${client.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--terracotta)] transition-colors hover:text-[var(--amber)] animate-fade-in"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au client
      </Link>

      {/* Client header (smaller) */}
      <div className="flex items-center gap-3 animate-fade-up">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-[var(--shadow-sm)] overflow-hidden">
          <ClientLogo src={client.logo} alt={client.name} />
        </div>
        <div>
          <h1 className="font-heading text-xl text-[var(--ink)]">{client.name}</h1>
          <p className="text-xs text-[var(--terracotta)]">Suivi de performance · {client.domain}</p>
        </div>
      </div>

      {/* Current scores */}
      {latest && (
        <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="mb-4 font-heading text-lg text-[var(--ink)]">Scores actuels — {formatDate(latest.date)}</h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <ScoreCard label="LCP" value={latest.lcp} unit="s" type="lcp" previousValue={previous?.lcp} />
            <ScoreCard label="CLS" value={latest.cls} unit="" type="cls" previousValue={previous?.cls} />
            <ScoreCard label="Lighthouse" value={latest.lighthouse} unit="/100" type="lighthouse" previousValue={previous?.lighthouse} />
            <ScoreCard label="INP" value={latest.inp} unit="ms" type="inp" previousValue={previous?.inp} />
          </div>
        </div>
      )}

      {/* Budget targets */}
      <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-[var(--amber)]" />
            <h2 className="font-heading text-base text-[var(--ink)]">Objectifs de performance</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {budgetChecks.map((check) => (
              <div
                key={check.label}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3',
                  check.pass ? 'border-[var(--green-mid)] bg-[rgba(94,158,64,0.06)]' : 'border-[var(--amber)] bg-[rgba(201,122,16,0.06)]'
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white',
                    check.pass ? 'bg-[var(--green-mid)]' : 'bg-[var(--amber)]'
                  )}
                >
                  {check.pass ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs">!</span>}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">{check.label}</div>
                  <div className="text-[10px] text-[var(--terracotta)]">{check.target}</div>
                </div>
                <span className={cn('ml-auto text-sm font-heading', check.pass ? 'text-[var(--green-mid)]' : 'text-[var(--amber)]')}>
                  {check.display}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add score button + form */}
      <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-[var(--amber)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Ajouter un score
          </button>
        ) : (
          <Card className="p-5 animate-scale-in">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-base text-[var(--ink)]">Nouvelle entrée de performance</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--terracotta)] hover:text-[var(--ink)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">Mission associée</label>
                <input
                  type="text"
                  placeholder="ex: M34"
                  value={formData.missionId}
                  onChange={(e) => setFormData({ ...formData, missionId: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">LCP (secondes)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="ex: 2.3"
                  value={formData.lcp}
                  onChange={(e) => setFormData({ ...formData, lcp: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">CLS</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="ex: 0.08"
                  value={formData.cls}
                  onChange={(e) => setFormData({ ...formData, cls: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">Lighthouse (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="ex: 89"
                  value={formData.lighthouse}
                  onChange={(e) => setFormData({ ...formData, lighthouse: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">INP (ms)</label>
                <input
                  type="number"
                  placeholder="ex: 210"
                  value={formData.inp}
                  onChange={(e) => setFormData({ ...formData, inp: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-[var(--terracotta)]">Notes</label>
                <input
                  type="text"
                  placeholder="Contexte de la mesure..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-4 py-2 text-sm text-[var(--ink)] transition-all hover:border-[var(--terracotta)]"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.lcp || !formData.lighthouse}
                className="rounded-lg bg-[var(--green-mid)] px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Score history timeline */}
      <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
        <h2 className="mb-4 font-heading text-lg text-[var(--ink)]">Historique des scores</h2>
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[var(--border)]" />
          <div className="space-y-4">
            {sortedEntries.map((entry, i) => {
              const prev = sortedEntries[i + 1];
              const isLatest = i === 0;
              return (
                <div key={entry.id} className="relative flex gap-4">
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                      isLatest ? 'border-[var(--amber)] bg-[var(--amber)]' : 'border-[var(--border)] bg-[var(--bg)]'
                    )}
                  >
                    {isLatest ? (
                      <span className="text-[10px] font-bold text-white">●</span>
                    ) : (
                      <Calendar className="h-3.5 w-3.5 text-[var(--terracotta)]" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--ink)]">{formatDate(entry.date)}</span>
                      {isLatest && (
                        <span className="rounded-full bg-[var(--amber)] px-2 py-0.5 text-[10px] font-semibold text-white">Actuel</span>
                      )}
                      {entry.missionId && (
                        <span className="rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--terracotta)]">
                          {entry.missionId}
                        </span>
                      )}
                    </div>
                    {/* Scores row */}
                    <div className="mt-2 flex flex-wrap gap-3 text-xs">
                      <ScoreMini label="LCP" value={`${entry.lcp}s`} color={getScoreColor(entry.lcp, 'lcp')} prev={prev ? `${prev.lcp}s` : undefined} improved={prev ? entry.lcp < prev.lcp : undefined} />
                      <ScoreMini label="CLS" value={`${entry.cls}`} color={getScoreColor(entry.cls, 'cls')} prev={prev ? `${prev.cls}` : undefined} improved={prev ? entry.cls < prev.cls : undefined} />
                      <ScoreMini label="LH" value={`${entry.lighthouse}`} color={getScoreColor(entry.lighthouse, 'lighthouse')} prev={prev ? `${prev.lighthouse}` : undefined} improved={prev ? entry.lighthouse > prev.lighthouse : undefined} />
                      <ScoreMini label="INP" value={`${entry.inp}ms`} color={getScoreColor(entry.inp, 'inp')} prev={prev ? `${prev.inp}ms` : undefined} improved={prev ? entry.inp < prev.inp : undefined} />
                    </div>
                    {entry.notes && (
                      <p className="mt-2 text-xs text-[var(--terracotta)] italic">{entry.notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreMini({ label, value, color, prev, improved }: {
  label: string;
  value: string;
  color: ScoreColor;
  prev?: string;
  improved?: boolean;
}) {
  const cc = colorClasses[color];
  return (
    <div className={cn('flex items-center gap-1.5 rounded-lg border px-2 py-1', cc.border, cc.bg)}>
      <span className="text-[10px] font-semibold uppercase text-[var(--terracotta)]">{label}</span>
      <span className={cn('font-heading text-sm', cc.text)}>{value}</span>
      {prev && improved !== undefined && (
        <span className={cn('flex items-center', improved ? 'text-[var(--green-mid)]' : 'text-[#b43c3c]')}>
          {improved ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        </span>
      )}
    </div>
  );
}