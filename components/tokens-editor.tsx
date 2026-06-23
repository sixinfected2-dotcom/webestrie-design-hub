'use client';

import { useState, useCallback, useEffect } from 'react';
import { Copy, Check, Download, Palette } from 'lucide-react';
import { hubData } from '@/lib/data';
import type { ThemeKey } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tokenGroups = [
  { key: 'bg', label: 'Background' },
  { key: 'bg2', label: 'Background 2' },
  { key: 'bg3', label: 'Background 3' },
  { key: 'ink', label: 'Ink' },
  { key: 'terracotta', label: 'Terracotta' },
  { key: 'amber', label: 'Amber' },
  { key: 'amberLight', label: 'Amber Light' },
  { key: 'greenMid', label: 'Green Mid' },
  { key: 'border', label: 'Border' },
];

const typographyTokens = [
  { name: 'font-heading', value: "'Gloock', serif", desc: 'Titres' },
  { name: 'font-accent', value: "'Lora', Georgia, serif", desc: 'Accents italiques' },
  { name: 'font-sans', value: "'Inter', system-ui, sans-serif", desc: 'Corps de texte' },
];

const spacingTokens = [
  { name: 'xs', value: '0.5rem (8px)' },
  { name: 'sm', value: '0.75rem (12px)' },
  { name: 'md', value: '1rem (16px)' },
  { name: 'lg', value: '1.5rem (24px)' },
  { name: 'xl', value: '2rem (32px)' },
  { name: '2xl', value: '3rem (48px)' },
];

const radiusTokens = [
  { name: 'sm', value: '8px' },
  { name: 'card', value: '16px' },
  { name: 'full', value: '9999px' },
];

const shadowTokens = [
  { name: 'sm', value: '0 2px 8px rgba(28,58,24,0.06)' },
  { name: 'md', value: '0 8px 24px rgba(28,58,24,0.10)' },
  { name: 'lg', value: '0 16px 40px rgba(28,58,24,0.12)' },
];

export function TokensEditor({ clientSlug }: { clientSlug: string }) {
  const client = hubData.clients.find((c) => c.slug === clientSlug);
  if (!client) return <div>Client introuvable</div>;

  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(client.palette);
  const [colors, setColors] = useState(hubData.themes[client.palette]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  useEffect(() => {
    setColors(hubData.themes[currentTheme]);
  }, [currentTheme]);

  const updateColor = (key: string, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = useCallback(async (text: string, tokenName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(tokenName);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {}
  }, []);

  const generateConfig = () => {
    const themeKey = currentTheme;
    return `import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        bg: '${colors.bg}',
        'bg-2': '${colors.bg2}',
        'bg-3': '${colors.bg3}',
        ink: '${colors.ink}',
        terracotta: '${colors.terracotta}',
        amber: '${colors.amber}',
        'amber-light': '${colors.amberLight}',
        'green-mid': '${colors.greenMid}',
        border: '${colors.border}',
      },
      fontFamily: {
        heading: ['Gloock', 'serif'],
        accent: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        card: '16px',
      },
      boxShadow: {
        sm: '${shadowTokens[0].value}',
        md: '${shadowTokens[1].value}',
        lg: '${shadowTokens[2].value}',
      },
    },
  },
}

export default config`;
  };

  const copyFullConfig = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generateConfig());
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    } catch {}
  }, [colors, currentTheme]);

  const themeEntries = Object.entries(hubData.themes) as [ThemeKey, typeof colors][];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-[var(--ink)]">Design Tokens — {client.name}</h1>
          <p className="text-sm text-[var(--terracotta)]">Éditeur de tokens avec export Tailwind config</p>
        </div>
        <Button onClick={copyFullConfig} className="gap-2">
          {copiedConfig ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {copiedConfig ? 'Copié!' : 'Exporter tailwind.config.ts'}
        </Button>
      </div>

      {/* Theme switcher */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-heading text-xl text-[var(--ink)]">
          <Palette className="h-5 w-5" /> Palettes disponibles
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {themeEntries.map(([key, t]) => (
            <Card
              key={key}
              className={cn(
                'card-hover cursor-pointer p-4',
                currentTheme === key && 'border-[var(--amber)] ring-2 ring-[var(--amber)]'
              )}
              onClick={() => setCurrentTheme(key)}
            >
              <div className="flex gap-1.5">
                <span className="h-6 w-6 rounded-full border border-[var(--border)]" style={{ background: t.bg }} />
                <span className="h-6 w-6 rounded-full" style={{ background: t.ink }} />
                <span className="h-6 w-6 rounded-full" style={{ background: t.amber }} />
                <span className="h-6 w-6 rounded-full" style={{ background: t.greenMid }} />
                <span className="h-6 w-6 rounded-full" style={{ background: t.terracotta }} />
              </div>
              <h4 className="mt-2 text-sm font-semibold text-[var(--ink)]">{t.name}</h4>
              <p className="text-xs text-[var(--terracotta)]">
                {currentTheme === key ? '✓ Actif' : 'Cliquez pour appliquer'}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Color tokens */}
      <div>
        <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Couleurs</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tokenGroups.map((tok) => (
            <Card key={tok.key} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">{tok.label}</span>
                <button
                  onClick={() => copyToClipboard(colors[tok.key as keyof typeof colors], tok.key)}
                  className="text-[var(--terracotta)] hover:text-[var(--amber)]"
                >
                  {copiedToken === tok.key ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--border)]">
                  <input
                    type="color"
                    value={colors[tok.key as keyof typeof colors]}
                    onChange={(e) => updateColor(tok.key, e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="h-full w-full" style={{ background: colors[tok.key as keyof typeof colors] }} />
                </div>
                <div>
                  <code className="text-xs text-[var(--ink)]">{colors[tok.key as keyof typeof colors]}</code>
                  <div className="text-[10px] text-[var(--terracotta)]">--{tok.key}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Typographie</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {typographyTokens.map((t) => (
            <Card key={t.name} className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">{t.desc}</span>
                <button onClick={() => copyToClipboard(t.value, t.name)} className="text-[var(--terracotta)] hover:text-[var(--amber)]">
                  {copiedToken === t.name ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="text-2xl text-[var(--ink)]" style={{ fontFamily: t.value }}>
                {t.desc === 'Titres' ? 'Aa' : t.desc === 'Accents italiques' ? 'Aa' : 'Aa'}
              </div>
              <code className="text-xs text-[var(--terracotta)]">{t.value}</code>
            </Card>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Spacing</h2>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {spacingTokens.map((s) => (
            <Card key={s.name} className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">{s.name}</span>
                <button onClick={() => copyToClipboard(s.value, s.name)} className="text-[var(--terracotta)] hover:text-[var(--amber)]">
                  {copiedToken === s.name ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <code className="text-xs text-[var(--terracotta)]">{s.value}</code>
              <div className="mt-1.5 h-1.5 rounded-full bg-[var(--amber)]" style={{ width: `calc(${s.name === 'xs' ? '0.5' : s.name === 'sm' ? '0.75' : s.name === 'md' ? '1' : s.name === 'lg' ? '1.5' : s.name === 'xl' ? '2' : '3'}rem * 2)` }} />
            </Card>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Border Radius</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {radiusTokens.map((r) => (
            <Card key={r.name} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">{r.name}</span>
                <button onClick={() => copyToClipboard(r.value, r.name)} className="text-[var(--terracotta)] hover:text-[var(--amber)]">
                  {copiedToken === r.name ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="mt-2 h-12 bg-[var(--amber)] opacity-80" style={{ borderRadius: r.value }} />
              <code className="mt-1 block text-xs text-[var(--terracotta)]">{r.value}</code>
            </Card>
          ))}
        </div>
      </div>

      {/* Shadows */}
      <div>
        <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Shadows</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {shadowTokens.map((s) => (
            <Card key={s.name} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">{s.name}</span>
                <button onClick={() => copyToClipboard(s.value, s.name)} className="text-[var(--terracotta)] hover:text-[var(--amber)]">
                  {copiedToken === s.name ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="mt-3 h-16 rounded-lg bg-[var(--bg-2)]" style={{ boxShadow: s.value }} />
              <code className="mt-2 block text-[10px] text-[var(--terracotta)]">{s.value}</code>
            </Card>
          ))}
        </div>
      </div>

      {/* Config preview */}
      <div>
        <h2 className="mb-3 font-heading text-xl text-[var(--ink)]">Export Tailwind Config</h2>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--terracotta)]">tailwind.config.ts</span>
            <Button size="sm" variant="outline" onClick={copyFullConfig} className="gap-1.5">
              {copiedConfig ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedConfig ? 'Copié!' : 'Copier'}
            </Button>
          </div>
          <pre className="max-h-80 overflow-auto bg-[var(--bg-2)] p-4 text-xs text-[var(--ink)]">
            <code>{generateConfig()}</code>
          </pre>
        </Card>
      </div>
    </div>
  );
}