'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Check, ExternalLink, ArrowRight, Calendar } from 'lucide-react';
import { hubData, getClient } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ClientLogo } from '@/components/client-logo';

interface PortalViewProps {
  clientSlug: string;
}

// Friendly phase labels — strip technical prefixes
const friendlyPhaseLabels: Record<string, string> = {
  E: 'Fondations',
  F0: 'Accueil',
  F1: 'Territoire',
  F2: 'Galerie',
  F3: 'Avis',
  F4: 'Estimation',
  F5: 'Pages additionnelles',
};

function getFriendlyLabel(phaseId: string): string {
  return friendlyPhaseLabels[phaseId] || phaseId;
}

export function PortalView({ clientSlug }: PortalViewProps) {
  const client = getClient(clientSlug);
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!client?.portalPassword) {
      setAuthenticated(true);
      return;
    }
    const stored = localStorage.getItem(`portal-session-${clientSlug}`);
    if (stored === client.portalPassword) {
      setAuthenticated(true);
    }
  }, [clientSlug, client?.portalPassword]);

  if (!client) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--terracotta)]">Client introuvable.</p>
      </div>
    );
  }

  // Password gate
  if (mounted && !authenticated && client.portalPassword) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Branding */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-sm)] overflow-hidden">
              <ClientLogo src={client.logo} alt={client.name} />
            </div>
            <h1 className="font-heading text-2xl text-[var(--ink)]">{client.name}</h1>
            <p className="mt-1 text-sm text-[var(--terracotta)]">Portail client WebEstrie</p>
          </div>

          {/* Password form */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-2)] p-6">
            <div className="mb-4 flex items-center gap-2 text-[var(--ink)]">
              <Lock className="h-4 w-4 text-[var(--amber)]" />
              <span className="text-sm font-semibold">Accès sécurisé</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordInput === client.portalPassword) {
                  setAuthenticated(true);
                  localStorage.setItem(`portal-session-${clientSlug}`, client.portalPassword!);
                  setError(false);
                } else {
                  setError(true);
                }
              }}
              className="space-y-3"
            >
              <input
                type="password"
                placeholder="Mot de passe"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError(false);
                }}
                autoFocus
                className={cn(
                  'h-11 w-full rounded-xl border bg-[var(--bg)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:ring-2 transition-all',
                  error
                    ? 'border-[#b43c3c] focus:ring-[rgba(180,60,60,0.15)]'
                    : 'border-[var(--border)] focus:border-[var(--amber)] focus:ring-[rgba(201,122,16,0.12)]'
                )}
              />
              {error && (
                <p className="text-xs text-[#b43c3c] animate-fade-in">Mot de passe incorrect. Veuillez réessayer.</p>
              )}
              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-[var(--amber)] text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
              >
                Accéder au portail
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-[var(--terracotta)]">
            WebEstrie — Votre partenaire web
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!mounted) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--terracotta)]">Chargement...</p>
      </div>
    );
  }

  // Portal content
  const donePhases = client.phases.filter((p) => p.status === 'done').length;
  const phaseProgress = Math.round((donePhases / client.phases.length) * 100);
  const livePages = client.pages.filter((p) => p.status === 'live');
  const liveMissions = client.missions
    .filter((m) => m.status === 'live')
    .sort((a, b) => b.num - a.num);

  // Date approximation based on mission number
  const getMissionDateApprox = (missionNum: number): string => {
    const months: Record<number, string> = {
      34: 'juin 2026',
      33: 'juin 2026',
      31: 'mai 2026',
      30: 'mai 2026',
      29: 'avril 2026',
      28: 'mars 2026',
      27: 'février 2026',
      26: 'février 2026',
      25: 'janvier 2026',
      24: 'décembre 2025',
    };
    return months[missionNum] || '2026';
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="animate-fade-up">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[var(--shadow-sm)] overflow-hidden">
              <ClientLogo src={client.logo} alt={client.name} />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-[var(--ink)]">{client.name}</h1>
              <p className="text-sm text-[var(--terracotta)]">{client.domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--bg-2)] border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--terracotta)]">
              Portail client
            </span>
            <span className="font-heading text-sm text-[var(--ink)]">WebEstrie</span>
          </div>
        </div>
      </header>

      <div className="section-divider" />

      {/* Phase progress */}
      <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="mb-2 font-heading text-xl text-[var(--ink)]">Progression du projet</h2>
        <p className="mb-6 text-sm text-[var(--terracotta)]">
          {donePhases} étapes complétées sur {client.phases.length}
        </p>

        {/* Big progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between">
            <span className="font-heading text-4xl text-[var(--ink)]">{phaseProgress}%</span>
            <span className="text-sm text-[var(--terracotta)]">complété</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-3)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--green-mid)] to-[var(--amber)] transition-all duration-1000 ease-out"
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
        </div>

        {/* Phase chips */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {client.phases.map((phase) => (
            <div
              key={phase.id}
              className={cn(
                'rounded-xl border p-4 transition-all',
                phase.status === 'done' && 'border-[var(--green-mid)] bg-[rgba(94,158,64,0.06)]',
                phase.status === 'in-progress' && 'border-[var(--amber)] bg-[rgba(201,122,16,0.06)]',
                phase.status === 'pending' && 'border-[var(--border)] bg-[var(--bg-2)] opacity-60'
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-white',
                    phase.status === 'done' && 'bg-[var(--green-mid)]',
                    phase.status === 'in-progress' && 'bg-[var(--amber)] animate-pulse',
                    phase.status === 'pending' && 'bg-[var(--bg-3)] text-[var(--terracotta)]'
                  )}
                >
                  {phase.status === 'done' && <Check className="h-3.5 w-3.5" />}
                  {phase.status === 'in-progress' && <span className="h-2 w-2 rounded-full bg-white" />}
                  {phase.status === 'pending' && <span className="text-xs">○</span>}
                </div>
                <span className="text-xs font-semibold text-[var(--ink)]">
                  {getFriendlyLabel(phase.id)}
                </span>
              </div>
              <p className="text-xs text-[var(--terracotta)] leading-relaxed">
                {phase.status === 'done' && 'Complété'}
                {phase.status === 'in-progress' && 'En cours'}
                {phase.status === 'pending' && 'À venir'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Pages live */}
      <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="mb-2 font-heading text-xl text-[var(--ink)]">Pages en ligne</h2>
        <p className="mb-6 text-sm text-[var(--terracotta)]">
          {livePages.length} pages sont actuellement accessibles sur {client.domain}
        </p>
        <div className="space-y-2">
          {livePages.map((page) => {
            const url = `https://${client.domain}${page.path === '/' ? '' : page.path}`;
            const displayName = page.path === '/' ? 'Accueil' : page.name.replace(/^\//, '');
            return (
              <a
                key={page.path}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all hover:border-[var(--green-mid)] hover:bg-[var(--bg-2)] hover:translate-x-1"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--green-mid)]">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="flex-1 text-sm font-semibold text-[var(--ink)] capitalize">{displayName}</span>
                <span className="flex items-center gap-1 text-xs font-medium text-[var(--amber)]">
                  Visiter <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <div className="section-divider" />

      {/* Recent updates feed */}
      <section className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="mb-2 font-heading text-xl text-[var(--ink)]">Mises à jour récentes</h2>
        <p className="mb-6 text-sm text-[var(--terracotta)]">Ce que nous avons accompli récemment</p>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-[var(--border)]" />
          <div className="space-y-6">
            {liveMissions.map((mission, i) => (
              <div
                key={mission.id}
                className="relative flex gap-4 animate-fade-up"
                style={{ animationDelay: `${0.35 + i * 0.05}s` }}
              >
                {/* Dot */}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg)] border-2 border-[var(--green-mid)]">
                  <Check className="h-3.5 w-3.5 text-[var(--green-mid)]" />
                </div>
                {/* Content */}
                <div className="flex-1 pb-2">
                  <h3 className="text-sm font-semibold text-[var(--ink)]">{mission.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--terracotta)]">
                    <Calendar className="h-3 w-3" />
                    {getMissionDateApprox(mission.num)}
                  </div>
                  {mission.liveUrl && (
                    <a
                      href={mission.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--amber)] hover:underline"
                    >
                      Voir le résultat <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img
              src={hubData.agency.logo}
              alt="WebEstrie"
              className="h-7 w-7 rounded object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-heading text-sm text-[var(--ink)]">
              WebEstrie — <span className="font-accent text-[var(--terracotta)]">Votre partenaire web</span>
            </span>
          </div>
          <a
            href="mailto:info@webestrie.ca"
            className="text-sm font-medium text-[var(--amber)] hover:underline"
          >
            Contacter l'équipe
          </a>
        </div>
      </footer>
    </div>
  );
}