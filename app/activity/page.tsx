import { getActivities } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCommit, Wrench, Sparkles, Search, Rocket, Palette, Zap } from 'lucide-react';
import type { ActivityEntry } from '@/lib/types';

const typeConfig: Record<ActivityEntry['type'], { icon: typeof GitCommit; label: string; color: string }> = {
  commit: { icon: GitCommit, label: 'Commit', color: 'text-blue-500' },
  fix: { icon: Wrench, label: 'Fix', color: 'text-orange-500' },
  feature: { icon: Sparkles, label: 'Feature', color: 'text-purple-500' },
  audit: { icon: Search, label: 'Audit', color: 'text-cyan-500' },
  deploy: { icon: Rocket, label: 'Deploy', color: 'text-green-500' },
  design: { icon: Palette, label: 'Design', color: 'text-pink-500' },
  perf: { icon: Zap, label: 'Perf', color: 'text-amber-500' },
};

function groupByDate(activities: ActivityEntry[]): Record<string, ActivityEntry[]> {
  return activities.reduce((acc, act) => {
    if (!acc[act.date]) acc[act.date] = [];
    acc[act.date].push(act);
    return acc;
  }, {} as Record<string, ActivityEntry[]>);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ActivityPage() {
  const activities = getActivities();
  const grouped = groupByDate(activities);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--ink)]">Activité</h1>
        <p className="text-sm text-[var(--terracotta)]">
          Historique des commits, fixes et modifications — {activities.length} entrées
        </p>
      </div>

      <div className="space-y-8">
        {dates.map((date) => (
          <div key={date}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border)]" />
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--terracotta)]">
                {formatDate(date)}
              </span>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>

            <div className="space-y-3">
              {grouped[date].map((act) => {
                const cfg = typeConfig[act.type];
                const Icon = cfg.icon;
                return (
                  <Card key={act.id} className="card-hover p-4">
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant="default" className={cfg.color}>
                            {cfg.label}
                          </Badge>
                          {act.commit && (
                            <a
                              href={`https://github.com/sixinfected2-dotcom/C-T-Arbro-Website/commit/${act.commit}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-[var(--terracotta)] hover:underline"
                            >
                              {act.commit.slice(0, 7)}
                            </a>
                          )}
                          {act.files && (
                            <span className="text-xs text-[var(--terracotta)] opacity-60">
                              {act.files} fichier{act.files > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-sm text-[var(--ink)] mb-1">
                          {act.title}
                        </h3>
                        <p className="text-sm text-[var(--terracotta)] leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}