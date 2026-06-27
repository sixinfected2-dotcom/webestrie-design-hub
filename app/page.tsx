import Link from 'next/link';
import { ArrowRight, ExternalLink, Clock, GitCommit, Activity } from 'lucide-react';
import { hubData, getStats, getRecentMissions, getActivities } from '@/lib/data';
import { readHubState } from '@/lib/hub-state';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ClientLogo } from '@/components/client-logo';
import { UpdatePanel } from '@/components/update-panel';

export default async function DashboardPage() {
  const stats = getStats();
  const recentMissions = getRecentMissions(6);
  const recentActivities = getActivities(5);
  const clients = hubData.clients;
  const hubState = await readHubState();

  const statCards = [
    { label: 'Clients', value: stats.clients, icon: '🏢' },
    { label: 'Pages live', value: stats.livePages, icon: '✓' },
    { label: 'Missions', value: stats.missions, icon: '🎯' },
    { label: 'Sketches', value: stats.sketches, icon: '🎨' },
    { label: 'En cours', value: stats.inProgress, icon: '●' },
  ];

  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('fr-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero + Update button */}
      <div className="relative text-center py-6">
        <div className="absolute right-0 top-0">
          <UpdatePanel />
        </div>
        <span className="inline-block animate-fade-up rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
          WebEstrie Design System
        </span>
        <h1 className="mt-4 font-heading text-4xl leading-tight text-[var(--ink)] animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Hub central<br />
          <span className="font-accent text-[var(--terracotta)]">de design</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--terracotta)] animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Dashboard SaaS multi-clients. Missions, sketches, pages live et outils — tout au même endroit.
        </p>
        {/* Last updated */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--terracotta)] animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Clock className="h-3 w-3" />
          Dernière mise à jour: {formatTimestamp(hubState.lastUpdated)}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-stretch justify-center gap-0 rounded-2xl border-y border-[var(--border)] py-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'flex flex-1 min-w-[110px] flex-col items-center px-4',
              i < statCards.length - 1 && 'border-r border-[var(--border)]'
            )}
          >
            <div className="font-heading text-3xl text-[var(--ink)]">{s.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-[var(--terracotta)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Session logs */}
      {hubState.sessionLogs.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
          <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Journal des sessions</h2>
          <div className="space-y-2">
            {hubState.sessionLogs.slice().reverse().slice(0, 5).map((log, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-3">
                <GitCommit className="h-4 w-4 shrink-0 text-[var(--terracotta)]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--ink)]">{log.description}</p>
                  <span className="text-xs text-[var(--terracotta)]">{formatTimestamp(log.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client cards */}
      <div>
        <h2 className="mb-4 font-heading text-2xl text-[var(--ink)]">Clients</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => {
            const liveCount = c.missions.filter((m) => m.status === 'live').length;
            const inProgressCount = c.missions.filter((m) => m.status === 'in-progress').length;
            const donePhases = c.phases.filter((p) => p.status === 'done').length;
            const phaseProgress = Math.round((donePhases / c.phases.length) * 100);

            return (
              <Link key={c.slug} href={`/clients/${c.slug}`}>
                <Card className="card-hover group h-full overflow-hidden p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[var(--shadow-sm)]">
                      <ClientLogo src={c.logo} alt={c.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-lg text-[var(--ink)]">{c.name}</h3>
                      <p className="truncate text-xs text-[var(--terracotta)]">{c.domain} · {c.industry}</p>
                    </div>
                  </div>

                  {/* Phase progress */}
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-[var(--terracotta)]">Phases</span>
                      <span className="font-semibold text-[var(--ink)]">{donePhases}/{c.phases.length}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-3)]">
                      <div className="h-full rounded-full bg-[var(--green-mid)] transition-all duration-500" style={{ width: `${phaseProgress}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.tech.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--terracotta)]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                    <div className="flex gap-3 text-xs">
                      <span className="font-semibold text-[var(--green-mid)]">{liveCount} live</span>
                      {inProgressCount > 0 && <span className="font-semibold text-[var(--amber)]">{inProgressCount} en cours</span>}
                    </div>
                    <span className="text-[var(--amber)] transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent missions + Tools */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent missions */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-heading text-2xl text-[var(--ink)]">Missions récentes</h2>
          <div className="space-y-3">
            {recentMissions.map((m) => {
              const statusVariant = m.status === 'live' ? 'live' : m.status === 'in-progress' ? 'progress' : m.status === 'rejected' ? 'rejected' : 'archive';
              return (
                <Link key={m.id} href={`/clients/${m.clientSlug}/missions/${m.id}`}>
                  <Card className="card-hover flex items-center gap-4 p-4">
                    <div className="font-heading text-2xl text-[var(--amber)]">{m.num}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-heading text-base text-[var(--ink)]">{m.title}</h4>
                        <Badge variant={statusVariant}>{m.tag}</Badge>
                      </div>
                      <p className="truncate text-xs text-[var(--terracotta)]">{m.clientName} · {m.meta}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--amber)]" />
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick tools */}
        <div>
          <h2 className="mb-4 font-heading text-2xl text-[var(--ink)]">Outils rapides</h2>
          <div className="space-y-3">
            {hubData.tools.map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer">
                <Card className="card-hover flex items-center gap-3 p-4">
                  <span className="text-xl">{t.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-[var(--ink)]">{t.name}</h4>
                    <p className="truncate text-xs text-[var(--terracotta)]">{t.desc}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-[var(--terracotta)]" />
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity feed */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-2xl text-[var(--ink)]">Activité récente</h2>
          <Link href="/activity" className="flex items-center gap-1 text-xs text-[var(--terracotta)] hover:underline">
            Voir tout <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentActivities.map((act) => (
            <Card key={act.id} className="card-hover flex items-center gap-3 p-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)]">
                <GitCommit className="h-3.5 w-3.5 text-[var(--amber)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium text-[var(--ink)]">{act.title}</h4>
                <p className="truncate text-xs text-[var(--terracotta)]">
                  {act.date} · {act.type}
                  {act.commit && ` · ${act.commit.slice(0, 7)}`}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}