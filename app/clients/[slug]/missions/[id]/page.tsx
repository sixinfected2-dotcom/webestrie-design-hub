import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, GitCommit, ExternalLink, Check, X, Circle, Clock } from 'lucide-react';
import { hubData, getClient } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SketchStatus, MissionStatus } from '@/lib/types';

export function generateStaticParams() {
  const params: { slug: string; id: string }[] = [];
  for (const client of hubData.clients) {
    for (const mission of client.missions) {
      params.push({ slug: client.slug, id: mission.id });
    }
  }
  return params;
}

const sketchStatusConfig: Record<SketchStatus, { color: string; bg: string; border: string; label: string; icon: React.ReactNode }> = {
  selected: { color: 'text-[var(--green-mid)]', bg: 'bg-[var(--green-mid)]', border: 'border-[var(--green-mid)]', label: 'Sélectionné', icon: <Star className="h-4 w-4" /> },
  implemented: { color: 'text-[var(--green-mid)]', bg: 'bg-[var(--green-mid)]', border: 'border-[var(--green-mid)]', label: 'Implémenté', icon: <Check className="h-4 w-4" /> },
  rejected: { color: 'text-[#b43c3c]', bg: 'bg-[#b43c3c]', border: 'border-[#b43c3c]', label: 'Rejeté', icon: <X className="h-4 w-4" /> },
  explored: { color: 'text-[var(--amber)]', bg: 'bg-[var(--amber)]', border: 'border-[var(--amber)]', label: 'Exploré', icon: <Circle className="h-3 w-3 fill-current" /> },
  archive: { color: 'text-[var(--terracotta)]', bg: 'bg-[var(--border)]', border: 'border-[var(--border)]', label: 'Archive', icon: <Clock className="h-4 w-4" /> },
};

const missionStatusVariant: Record<MissionStatus, 'live' | 'progress' | 'archive' | 'rejected'> = {
  live: 'live',
  'in-progress': 'progress',
  archive: 'archive',
  rejected: 'rejected',
};

const lineColorByStatus: Record<SketchStatus, string> = {
  selected: 'bg-[var(--green-mid)]',
  implemented: 'bg-[var(--green-mid)]',
  explored: 'bg-[var(--amber)]',
  rejected: 'bg-[#b43c3c]',
  archive: 'bg-[var(--border)]',
};

const subMissionStatusColor: Record<string, { color: string; bg: string; border: string; label: string }> = {
  live: { color: 'text-[var(--green-mid)]', bg: 'bg-[var(--green-mid)]', border: 'border-[var(--green-mid)]', label: 'Live' },
  'in-progress': { color: 'text-[var(--amber)]', bg: 'bg-[var(--amber)]', border: 'border-[var(--amber)]', label: 'En cours' },
  archive: { color: 'text-[var(--terracotta)]', bg: 'bg-[var(--border)]', border: 'border-[var(--border)]', label: 'Archive' },
};

export default async function TimeMachinePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const client = getClient(slug);
  if (!client) notFound();
  const mission = client.missions.find((m) => m.id === id);
  if (!mission) notFound();

  const hasSketches = mission.sketches && mission.sketches.length > 0;
  const hasSubMissions = mission.subMissions && mission.subMissions.length > 0;
  const nodes = hasSketches ? mission.sketches! : hasSubMissions ? mission.subMissions! : [];
  const winner = hasSketches ? mission.sketches!.find((s) => s.status === 'selected' || s.status === 'implemented') : null;

  return (
    <div className="space-y-8">
      {/* Retour link */}
      <Link
        href={`/clients/${client.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--terracotta)] transition-colors hover:text-[var(--amber)] animate-fade-in"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au client
      </Link>

      {/* Mission header */}
      <div className="animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-heading text-4xl text-[var(--amber)]">M{mission.num}</span>
          <h1 className="font-heading text-2xl text-[var(--ink)]">{mission.title}</h1>
          <Badge variant={missionStatusVariant[mission.status]}>{mission.tag}</Badge>
          {mission.meta && (
            <span className="ml-auto text-sm text-[var(--terracotta)]">{mission.meta}</span>
          )}
        </div>
        {mission.phase && (
          <p className="mt-2 text-sm text-[var(--terracotta)]">
            Phase {mission.phase} · {client.name}
          </p>
        )}
        {mission.liveUrl && (
          <a
            href={mission.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--amber)] hover:underline"
          >
            Voir live <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="section-divider" />

      {/* Timeline */}
      <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="mb-6 font-heading text-xl text-[var(--ink)]">
          {hasSketches ? 'Évolution des sketches' : hasSubMissions ? 'Sous-missions' : 'Mission'}
        </h2>

        {nodes.length === 0 ? (
          <p className="text-sm text-[var(--terracotta)]">
            Aucun sketch ni sous-mission documenté pour cette mission.
          </p>
        ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-full items-start gap-0" style={{ minWidth: `${Math.max(nodes.length * 140, 600)}px` }}>
            {nodes.map((node, i) => {
              const isSketch = hasSketches;
              const status = isSketch ? (node as { status: SketchStatus }).status : (node as { status: string }).status;
              const config = isSketch
                ? sketchStatusConfig[status as SketchStatus]
                : subMissionStatusColor[status as string] || subMissionStatusColor.archive;
              const isWinner = isSketch && (node as { status: SketchStatus }).status === 'selected';
              const nodeId = (node as { id: string }).id;
              const nodeName = (node as { name: string }).name;
              const nodeDesc = (node as { desc: string }).desc;

              return (
                <div key={nodeId} className="relative flex flex-1 flex-col items-center text-center" style={{ minWidth: '120px' }}>
                  {/* Connector line */}
                  {i < nodes.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-1/2 top-6 h-0.5 w-full',
                        isSketch ? lineColorByStatus[(node as { status: SketchStatus }).status] : 'bg-[var(--border)]'
                      )}
                    />
                  )}

                  {/* Node circle */}
                  <div
                    className={cn(
                      'z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all hover:scale-110',
                      config.border,
                      config.bg,
                      isWinner && 'ring-4 ring-[rgba(94,158,64,0.25)] animate-badge-bounce'
                    )}
                  >
                    {isWinner ? (
                      <Star className="h-5 w-5 fill-white text-white" />
                    ) : isSketch ? (
                      sketchStatusConfig[(node as { status: SketchStatus }).status].icon
                    ) : (
                      <span className="text-xs font-heading text-white">{nodeId}</span>
                    )}
                  </div>

                  {/* Node info */}
                  <div className="mt-3 w-full px-1">
                    <div className="font-heading text-sm text-[var(--ink)]">{nodeId}</div>
                    <div className="mt-0.5 text-xs font-medium text-[var(--ink)] truncate">{nodeName}</div>
                    <div className={cn('mt-1 text-[10px] font-semibold uppercase tracking-wider', config.color)}>
                      {config.label}
                    </div>
                  </div>

                  {/* Preview placeholder */}
                  <div className="sketch-preview-bg mt-2 h-16 w-full max-w-[100px] rounded-lg">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs text-[var(--terracotta)] opacity-50">{nodeId}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Winner node at the end */}
            {winner && (
              <div className="relative flex min-w-[140px] flex-1 flex-col items-center text-center">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--green-mid)] bg-[var(--green-mid)] ring-4 ring-[rgba(94,158,64,0.25)] animate-badge-bounce">
                  <Star className="h-5 w-5 fill-white text-white" />
                </div>
                <div className="mt-3 px-1">
                  <div className="font-heading text-sm text-[var(--green-mid)]">Gagnant</div>
                  <div className="mt-0.5 text-xs font-medium text-[var(--ink)] truncate">{winner.name}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--green-mid)]">
                    Sélectionné
                  </div>
                </div>
                <Card className="mt-2 h-16 w-full max-w-[100px] border-[var(--green-mid)] bg-[rgba(94,158,64,0.06)]">
                  <div className="flex h-full items-center justify-center">
                    <Star className="h-5 w-5 text-[var(--green-mid)]" />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      <div className="section-divider" />

      {/* Details cards */}
      <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="mb-4 font-heading text-xl text-[var(--ink)]">Détails</h2>
        {hasSketches ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {mission.sketches!.map((s) => {
              const config = sketchStatusConfig[s.status];
              return (
                <Card
                  key={s.id}
                  className={cn(
                    'card-hover p-5',
                    s.featured && 'border-[var(--green-mid)] bg-[rgba(94,158,64,0.04)]'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2',
                        config.border,
                        config.bg
                      )}
                    >
                      {s.status === 'selected' ? (
                        <Star className="h-4 w-4 fill-white text-white" />
                      ) : (
                        config.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg text-[var(--ink)]">{s.id}</span>
                        <span className={cn('text-xs font-semibold uppercase tracking-wider', config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--ink)]">{s.name}</h4>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--terracotta)]">{s.desc}</p>
                  {s.status === 'rejected' && (
                    <div className="mt-2 text-xs text-[#b43c3c]">
                      ⚠️ Ce sketch a été rejeté — ne correspond pas au concept visé.
                    </div>
                  )}
                  {s.status === 'selected' && (
                    <div className="mt-2 text-xs text-[var(--green-mid)]">
                      ⭐ Sketch sélectionné pour implémentation.
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : hasSubMissions ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {mission.subMissions!.map((sm) => {
              const config = subMissionStatusColor[sm.status] || subMissionStatusColor.archive;
              return (
                <Card key={sm.id} className="card-hover p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border-2',
                        config.border,
                        config.bg
                      )}
                    >
                      <span className="text-xs font-heading text-white">{sm.id}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-lg text-[var(--ink)]">{sm.id}</span>
                        <span className={cn('text-xs font-semibold uppercase tracking-wider', config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--ink)]">{sm.name}</h4>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-[var(--terracotta)]">{sm.desc}</p>
                  {sm.commit && (
                    <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--border)] pt-2 text-xs text-[var(--terracotta)]">
                      <GitCommit className="h-3 w-3" />
                      <code>{sm.commit.slice(0, 7)}</code>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--terracotta)]">Aucun sketch ni sous-mission documenté pour cette mission.</p>
        )}
      </div>

      {/* Commits */}
      {mission.commits && mission.commits.length > 0 && (
        <>
          <div className="section-divider" />
          <div className="animate-fade-up">
            <h2 className="mb-4 font-heading text-xl text-[var(--ink)]">Commits</h2>
            <div className="flex flex-wrap gap-2">
              {mission.commits.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 py-1.5 text-xs text-[var(--terracotta)]"
                >
                  <GitCommit className="h-3 w-3" />
                  <code>{c.slice(0, 7)}</code>
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Notes */}
      {mission.notes && (
        <>
          <div className="section-divider" />
          <div className="animate-fade-up rounded-lg bg-[rgba(180,60,60,0.06)] p-4 text-sm text-[var(--terracotta)]">
            ⚠️ {mission.notes}
          </div>
        </>
      )}
    </div>
  );
}