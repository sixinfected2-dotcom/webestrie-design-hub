import { ExternalLink } from 'lucide-react';
import { hubData } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--ink)]">Outils & liens</h1>
        <p className="text-sm text-[var(--terracotta)]">Accès rapide aux outils externes du workflow</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {hubData.tools.map((t) => (
          <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer">
            <Card className="card-hover p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg text-[var(--ink)]">{t.name}</h3>
                    <Badge variant="default">Tool</Badge>
                  </div>
                  <p className="text-sm text-[var(--terracotta)]">{t.desc}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-[var(--terracotta)]" />
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}