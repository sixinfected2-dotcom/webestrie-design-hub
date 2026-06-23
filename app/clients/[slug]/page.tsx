import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowRight, Check, Circle, Clock } from 'lucide-react';
import { hubData, getClient } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ClientLogo } from '@/components/client-logo';
import type { PhaseStatus, MissionStatus, SketchStatus, PageStatus } from '@/lib/types';

export function generateStaticParams() {
  return hubData.clients.map((c) => ({ slug: c.slug }));
}

const phaseIcons: Record<PhaseStatus, React.ReactNode> = {
  done: <Check className="h-4 w-4 text-white" />,
  'in-progress': <Circle className="h-3 w-3 fill-current text-white" />,
  pending: <Clock className="h-4 w-4" />,
};

const missionTagVariant: Record<MissionStatus, 'live' | 'progress' | 'archive' | 'rejected'> = {
  live: 'live',
  'in-progress': 'progress',
  archive: 'archive',
  rejected: 'rejected',
};

const sketchStatusBadge: Record<SketchStatus, { variant: 'done' | 'archive' | 'rejected' | 'default'; label: string }> = {
  selected: { variant: 'done', label: '⭐ Sélectionné' },
  implemented: { variant: 'done', label: '✓ Implémenté' },
  rejected: { variant: 'rejected', label: 'Rejeté' },
  explored: { variant: 'default', label: 'Exploré' },
  archive: { variant: 'archive', label: 'Archive' },
};

const pageStatusIcon: Record<PageStatus, { icon: React.ReactNode; className: string }> = {
  live: { icon: <Check className="h-4 w-4 text-white" />, className: 'bg-[var(--green-mid)]' },
  'in-progress': { icon: <Circle className="h-3 w-3 fill-current text-white" />, className: 'bg-[var(--amber)]' },
  pending: { icon: <Clock className="h-4 w-4" />, className: 'bg-[var(--bg-3)] text-[var(--terracotta)]' },
};

export default function ClientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  void params;
  const slug = 'ct-arbro';
  const client = getClient(slug);
  if (!client) notFound();

  const missions = [...client.missions].sort((a, b) => b.num - a.num);
  const activeMissions = missions.filter((m) => m.status === 'live' || m.status === 'in-progress');
  const archiveMissions = missions.filter((m) => m.status === 'archive');
  const donePhases = client.phases.filter((p) => p.status === 'done').length;

  return (
    <div className="space-y-8">
      {/* Client header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] p-6 animate-fade-up sm:flex-row sm:items-center"
        style={{ background: 'linear-gradient(135deg, rgba(28,58,24,0.04) 0%, rgba(94,158,64,0.04) 100%)' }}>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-sm)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={client.logo} alt={client.name} className="h-full w-full object-contain" />
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-2xl text-[var(--ink)]">{client.name}</h1>
          <p className="mt-1 text-sm text-[var(--terracotta)]">{client.domain} · {client.industry} · {client.region} · {client.years}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {client.tech.map((t) => (
              <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--terracotta)]">
                {t}
              </span>
            ))}
            <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--terracotta)]">
              Palette: {client.palette}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/tokens/${client.slug}`}>
            <span className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--amber)]">
              🎨 Tokens
            </span>
          </Link>
          <Link href={`/audit/${client.slug}`}>
            <span className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--amber)]">
              ✓ Audit
            </span>
          </Link>
          <a href={`https://${client.domain}`} target="_blank" rel="noopener noreferrer">
            <span className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--ink)] transition-colors hover:border-[var(--amber)]">
              Voir live <ExternalLink className="inline h-3 w-3" />
            </span>
          </a>
        </div>
      </div>

      {/* Phases timeline */}
      <div>
        <h2 className="mb-4 font-heading text-xl text-[var(--ink)]">Phases ({donePhases}/{client.phases.length} complétées)</h2>
        <div className="flex gap-0 overflow-x-auto pb-2">
          {client.phases.map((p, i) => (
            <div key={p.id} className="relative flex min-w-[120px] flex-1 flex-col items-center text-center">
              {/* Connector line */}
              {i < client.phases.length - 1 && (
                <div className={cn(
                  'absolute left-1/2 top-5 h-0.5 w-full',
                  p.status === 'done' ? 'bg-[var(--green-mid)]' : p.status === 'in-progress' ? 'bg-[var(--amber)]' : 'bg-[var(--border)]'
                )} />
              )}
              <div className={cn(
                'z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all hover:scale-110',
                p.status === 'done' && 'border-[var(--green-mid)] bg-[var(--green-mid)]',
                p.status === 'in-progress' && 'border-[var(--amber)] bg-[var(--amber)] animate-pulse',
                p.status === 'pending' && 'border-[var(--border)] bg-[var(--bg)] opacity-50'
              )}>
                {phaseIcons[p.status]}
              </div>
              <div className="mt-2 text-xs font-semibold text-[var(--ink)]">{p.label}</div>
              <div className="mt-0.5 text-[10px] text-[var(--terracotta)]">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* Active missions */}
      <div>
        <h2 className="mb-4 font-heading text-xl text-[var(--ink)]">Missions actives</h2>
        <div className="space-y-8">
          {activeMissions.map((m) => (
            <MissionBlock key={m.id} mission={m} />
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* Pages list */}
      <div>
        <h2 className="mb-4 font-heading text-xl text-[var(--ink)]">Pages — {client.domain}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {client.pages.map((p) => {
            const st = pageStatusIcon[p.status];
            const url = `https://${client.domain}${p.path === '/' ? '' : p.path}`;
            return (
              <a key={p.path} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 transition-all hover:border-[var(--amber)] hover:bg-[var(--bg-2)] hover:translate-x-0.5">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded', st.className)}>
                  {st.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-[var(--ink)]">{p.name}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--terracotta)]">{p.mission}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="section-divider" />

      {/* Archive */}
      <div>
        <h2 className="mb-4 font-heading text-xl text-[var(--ink)]">Historique <span className="text-sm text-[var(--terracotta)]">({archiveMissions.length} missions archivées)</span></h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {archiveMissions.map((m) => (
            <Card key={m.id} className="card-hover p-4 opacity-65 transition-opacity hover:opacity-100">
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl text-[var(--terracotta)]">{m.num}</span>
                <Badge variant="archive">{m.tag}</Badge>
              </div>
              <h4 className="mt-1.5 text-sm font-semibold text-[var(--ink)]">{m.title}</h4>
              <p className="text-xs text-[var(--terracotta)]">{m.meta}</p>
              {m.commits && m.commits.length > 0 && (
                <div className="mt-2 border-t border-[var(--border)] pt-2 text-xs text-[var(--terracotta)]">
                  <code>{m.commits[0].slice(0, 7)}</code>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function MissionBlock({ mission: m }: { mission: NonNullable<ReturnType<typeof getClient>>['missions'][number] }) {
  return (
    <div id={m.id} className="animate-fade-up scroll-mt-20">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-heading text-3xl text-[var(--amber)]">{m.num}</span>
        <Link href={`/clients/ct-arbro/missions/${m.id}`} className="font-heading text-xl text-[var(--ink)] transition-colors hover:text-[var(--amber)]">
          {m.title}
        </Link>
        <Badge variant={missionTagVariant[m.status]}>{m.tag}</Badge>
        {m.meta && <span className="ml-auto text-sm text-[var(--terracotta)]">{m.meta}</span>}
      </div>

      {/* Sketches */}
      {m.sketches && m.sketches.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {m.sketches.map((s) => {
            const badge = sketchStatusBadge[s.status];
            return (
              <Card key={s.id} className={cn('card-hover p-4', s.featured && 'border-[var(--ink)]')}>
                <SketchPreview />
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-heading text-lg text-[var(--terracotta)]">{s.id}</span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
                <h4 className="mt-1.5 text-sm font-semibold text-[var(--ink)]">{s.name}</h4>
                <p className="text-xs text-[var(--terracotta)]">{s.desc}</p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Sub-missions */}
      {m.subMissions && m.subMissions.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {m.subMissions.map((sm) => (
            <Card key={sm.id} className="card-hover p-4">
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg text-[var(--terracotta)]">{sm.id}</span>
                <Badge variant={sm.status === 'live' ? 'live' : sm.status === 'in-progress' ? 'progress' : 'archive'}>
                  {sm.status === 'live' ? 'Live' : sm.status === 'archive' ? 'Archive' : 'En cours'}
                </Badge>
              </div>
              <h4 className="mt-1.5 text-sm font-semibold text-[var(--ink)]">{sm.name}</h4>
              <p className="text-xs text-[var(--terracotta)]">{sm.desc}</p>
              {sm.commit && (
                <div className="mt-2 border-t border-[var(--border)] pt-2 text-xs text-[var(--terracotta)]">
                  <code>{sm.commit.slice(0, 7)}</code>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Notes */}
      {m.notes && (
        <div className="mt-3 rounded-lg bg-[rgba(180,60,60,0.06)] p-3 text-xs text-[var(--terracotta)]">
          ⚠️ {m.notes}
        </div>
      )}

      {/* Components */}
      {m.components && (
        <div className="mt-2 text-xs text-[var(--green-mid)]">
          📦 {m.components.join(', ')}
        </div>
      )}

      {/* Footer: commits + live URL */}
      {(m.commits && m.commits.length > 0 || m.liveUrl) && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs text-[var(--terracotta)]">
          {m.commits && m.commits.length > 0 && (
            <span>{m.commits.map((c) => <code key={c} className="mr-1.5">{c.slice(0, 7)}</code>)}</span>
          )}
          {m.liveUrl && (
            <a href={m.liveUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--amber)] hover:underline">
              Voir live →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function SketchPreview() {
  return (
    <div className="sketch-preview-bg relative h-28 overflow-hidden rounded-lg">
      <div className="absolute left-3 top-3 h-2 w-[40%] rounded bg-[var(--bg)] opacity-70" />
      <div className="absolute left-3 top-7 h-1.5 w-[60%] rounded bg-[var(--bg)] opacity-70" />
      <div className="absolute bottom-3 left-3 right-3 h-[50%] rounded-lg bg-[var(--bg)] opacity-70" />
      <div className="absolute right-3 top-3 h-5 w-5 rounded-full bg-[var(--amber)] opacity-50" />
    </div>
  );
}