'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ComponentDef {
  id: string;
  name: string;
  category: string;
  desc: string;
  clients: string[];
  code: string;
  preview: React.ReactNode;
}

const components: ComponentDef[] = [
  {
    id: 'hero-photo-overlay',
    name: 'Hero avec photo + overlay',
    category: 'Heroes',
    desc: 'Hero full-width avec photo 4K et overlay sage-editorial. Concept E validé M29.',
    clients: ['C&T Arbro'],
    code: `<section className="relative h-[60vh] overflow-hidden">
  <img src="/hero-4k.jpg" className="absolute inset-0 h-full w-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-b from-[#FDFAF5]/30 to-[#FDFAF5]/90" />
  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
    <h1 className="font-heading text-5xl text-[#1C3A18]">Arboriculture d'Estrie</h1>
    <p className="font-accent text-xl text-[#7A4F2D]">30+ ans d'expertise</p>
    <button className="mt-6 rounded-full bg-[#C97A10] px-8 py-3 text-white">
      Demander un estimation
    </button>
  </div>
</section>`,
    preview: (
      <div className="relative h-40 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--green-mid)] via-[var(--bg-3)] to-[var(--bg-2)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <h3 className="font-heading text-2xl text-[var(--ink)]">Arboriculture d'Estrie</h3>
          <p className="font-accent text-sm text-[var(--terracotta)]">30+ ans d'expertise</p>
          <span className="mt-2 rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs text-white">Demander une estimation</span>
        </div>
      </div>
    ),
  },
  {
    id: 'bento-cards',
    name: 'Bento Cards',
    category: 'Cards',
    desc: 'Grille bento asymétrique par technique. C2-pro-animé final M31.',
    clients: ['C&T Arbro'],
    code: `<div className="grid grid-cols-3 gap-4">
  <div className="col-span-2 row-span-2 rounded-2xl bg-[#F5EFE4] p-6">
    <h3 className="font-heading text-2xl">Élagage structural</h3>
    <p className="text-sm text-[#7A4F2D]">Technique professionnelle</p>
  </div>
  <div className="rounded-2xl bg-[#EFE9DC] p-4">
    <h4>Abattage</h4>
  </div>
  <div className="rounded-2xl bg-[#EFE9DC] p-4">
    <h4>Plantation</h4>
  </div>
</div>`,
    preview: (
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 row-span-2 rounded-xl bg-[var(--bg-2)] p-3">
          <div className="font-heading text-sm text-[var(--ink)]">Élagage structural</div>
          <div className="text-[10px] text-[var(--terracotta)]">Technique professionnelle</div>
        </div>
        <div className="rounded-xl bg-[var(--bg-3)] p-2 text-xs text-[var(--ink)]">Abattage</div>
        <div className="rounded-xl bg-[var(--bg-3)] p-2 text-xs text-[var(--ink)]">Plantation</div>
      </div>
    ),
  },
  {
    id: 'sage-cta',
    name: 'CTA Sage Editorial',
    category: 'CTAs',
    desc: 'Section CTA cream avec forest ink. M30.3 — Directive user "le vert j\'aime pas".',
    clients: ['C&T Arbro'],
    code: `<section className="bg-[#F5EFE4] py-16 text-center">
  <h2 className="font-heading text-4xl text-[#1C3A18]">Besoin d'un estimation?</h2>
  <p className="text-[#7A4F2D] mt-2">Consultation gratuite en Estrie</p>
  <button className="mt-6 rounded-full bg-[#C97A10] px-8 py-3 text-white">
    Demander maintenant
  </button>
</section>`,
    preview: (
      <div className="rounded-xl bg-[var(--bg-2)] py-6 text-center">
        <div className="font-heading text-lg text-[var(--ink)]">Besoin d'une estimation?</div>
        <div className="text-xs text-[var(--terracotta)]">Consultation gratuite en Estrie</div>
        <span className="mt-2 inline-block rounded-full bg-[var(--amber)] px-3 py-1 text-[10px] text-white">Demander maintenant</span>
      </div>
    ),
  },
  {
    id: 'sketch-preview-cards',
    name: 'Sketch Preview Cards',
    category: 'Cards',
    desc: 'Cartes de sketches avec exploration states (selected/rejected/explored). M34 pattern.',
    clients: ['C&T Arbro'],
    code: `<div className="grid grid-cols-3 gap-4">
  <div className="rounded-2xl border border-[#e8e0d1] bg-[#FDFAF5] p-4">
    <div className="h-28 rounded-lg bg-gradient-to-br from-[#F5EFE4] to-[#EFE9DC] mb-3" />
    <span className="text-xs bg-[rgba(201,122,16,0.10)] text-[#C97A10] px-2 py-0.5 rounded-full">
      Exploré
    </span>
    <h4 className="mt-2 font-semibold">Split form 60/40</h4>
  </div>
</div>`,
    preview: (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
        <div className="sketch-preview-bg relative h-20 overflow-hidden rounded-lg">
          <div className="absolute left-2 top-2 h-1.5 w-[40%] rounded bg-[var(--bg)] opacity-70" />
          <div className="absolute bottom-2 left-2 right-2 h-[50%] rounded bg-[var(--bg)] opacity-70" />
          <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-[var(--amber)] opacity-50" />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="rounded-full bg-[rgba(94,158,64,0.15)] px-2 py-0.5 text-[8px] font-semibold text-[var(--green-mid)]">⭐ Sélectionné</span>
        </div>
        <div className="text-xs font-semibold text-[var(--ink)]">Form first</div>
      </div>
    ),
  },
  {
    id: 'phase-timeline',
    name: 'Phase Timeline',
    category: 'Navigation',
    desc: 'Timeline horizontale avec done/in-progress/pending. M29-M34 phases.',
    clients: ['C&T Arbro'],
    code: `<div className="flex">
  <div className="flex flex-col items-center">
    <div className="h-10 w-10 rounded-full bg-[#5E9E40] text-white flex items-center justify-center">
      ✓
    </div>
    <span className="mt-2 text-xs font-semibold">F.0 Accueil</span>
  </div>
  <div className="flex flex-col items-center">
    <div className="h-10 w-10 rounded-full bg-[#C97A10] text-white animate-pulse">
      ●
    </div>
    <span className="mt-2 text-xs font-semibold">F.3 Avis</span>
  </div>
</div>`,
    preview: (
      <div className="flex gap-3 py-2">
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--green-mid)] text-xs text-white">✓</div>
          <span className="mt-1 text-[8px] font-semibold text-[var(--ink)]">F.0</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--amber)] text-xs text-white animate-pulse">●</div>
          <span className="mt-1 text-[8px] font-semibold text-[var(--ink)]">F.3</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--terracotta)] opacity-50">○</div>
          <span className="mt-1 text-[8px] font-semibold text-[var(--ink)]">F.5</span>
        </div>
      </div>
    ),
  },
  {
    id: 'mission-block',
    name: 'Mission Blocks',
    category: 'Cards',
    desc: 'Block mission avec numéro, sketches grid, commits et live URL.',
    clients: ['C&T Arbro'],
    code: `<div className="py-8">
  <div className="flex items-center gap-3 mb-4">
    <span className="font-heading text-3xl text-[#C97A10]">34</span>
    <h3 className="font-heading text-xl">/estimation redesign</h3>
    <span className="bg-[rgba(201,122,16,0.20)] text-[#C97A10] px-2 py-0.5 rounded-full text-xs">
      En cours
    </span>
  </div>
  <div className="grid grid-cols-3 gap-4">
    {/* sketch cards */}
  </div>
</div>`,
    preview: (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg text-[var(--amber)]">34</span>
          <span className="font-heading text-xs text-[var(--ink)]">/estimation redesign</span>
          <span className="rounded-full bg-[rgba(201,122,16,0.20)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--amber)]">En cours</span>
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          <div className="h-8 rounded bg-[var(--bg-2)]" />
          <div className="h-8 rounded bg-[var(--bg-3)]" />
          <div className="h-8 rounded bg-[var(--bg-2)]" />
        </div>
      </div>
    ),
  },
  {
    id: 'contact-form',
    name: 'Formulaire de contact',
    category: 'Forms',
    desc: 'Form first hero, split 50/50 + sidebar forest. M34-B choisi.',
    clients: ['C&T Arbro'],
    code: `<form className="grid grid-cols-2 gap-4">
  <input placeholder="Nom complet" className="rounded-lg border border-[#e8e0d1] px-4 py-2" />
  <input placeholder="Courriel" className="rounded-lg border border-[#e8e0d1] px-4 py-2" />
  <input placeholder="Téléphone" className="rounded-lg border border-[#e8e0d1] px-4 py-2" />
  <select className="rounded-lg border border-[#e8e0d1] px-4 py-2">
    <option>Type de service</option>
  </select>
  <textarea placeholder="Description" className="col-span-2 rounded-lg border px-4 py-2" />
  <button className="col-span-2 rounded-lg bg-[#C97A10] text-white py-3">
    Envoyer
  </button>
</form>`,
    preview: (
      <div className="grid grid-cols-2 gap-1.5">
        <input disabled placeholder="Nom complet" className="rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1 text-[10px] text-[var(--ink)]" />
        <input disabled placeholder="Courriel" className="rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1 text-[10px] text-[var(--ink)]" />
        <input disabled placeholder="Téléphone" className="rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1 text-[10px] text-[var(--ink)]" />
        <select disabled className="rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1 text-[10px] text-[var(--ink)]">
          <option>Service</option>
        </select>
        <textarea disabled placeholder="Description" className="col-span-2 rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-2 py-1 text-[10px] text-[var(--ink)]" rows={2} />
        <span className="col-span-2 rounded-md bg-[var(--amber)] py-1.5 text-center text-[10px] text-white">Envoyer</span>
      </div>
    ),
  },
  {
    id: 'footer-sage',
    name: 'Footer Sage Editorial',
    category: 'Footers',
    desc: 'Footer avec coords, liens et logo. Palette sage-editorial.',
    clients: ['C&T Arbro'],
    code: `<footer className="bg-[#F5EFE4] border-t border-[#e8e0d1] py-12">
  <div className="grid grid-cols-4 gap-8">
    <div>
      <img src="/logo.png" className="h-12" />
      <p className="text-sm text-[#7A4F2D] mt-2">Arboriculture d'Estrie depuis 30+ ans</p>
    </div>
    <div>
      <h4 className="font-heading text-lg">Services</h4>
      <ul className="text-sm text-[#7A4F2D]">
        <li>Élagage</li>
        <li>Abattage</li>
      </ul>
    </div>
  </div>
</footer>`,
    preview: (
      <div className="rounded-lg bg-[var(--bg-2)] p-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs font-heading text-[var(--ink)]">C&T Arbro</div>
            <div className="text-[8px] text-[var(--terracotta)]">30+ ans d'expertise</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[var(--ink)]">Services</div>
            <div className="text-[8px] text-[var(--terracotta)]">Élagage · Abattage</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-[var(--ink)]">Contact</div>
            <div className="text-[8px] text-[var(--terracotta)]">Estrie, QC</div>
          </div>
        </div>
      </div>
    ),
  },
];

const categories = ['Tous', 'Heroes', 'Navigation', 'CTAs', 'Cards', 'Forms', 'Footers'];

export function ComponentLibrary() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = activeCategory === 'Tous'
    ? components
    : components.filter((c) => c.category === activeCategory);

  const copyCode = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl text-[var(--ink)]">Bibliothèque de composants</h1>
        <p className="text-sm text-[var(--terracotta)]">Composants réutilisables basés sur les patterns C&T Arbro</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              activeCategory === cat
                ? 'border-[var(--amber)] bg-[var(--amber)] text-white'
                : 'border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] hover:border-[var(--amber)]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Components */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filtered.map((comp) => (
          <Card key={comp.id} className="overflow-hidden">
            {/* Header */}
            <div className="border-b border-[var(--border)] p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg text-[var(--ink)]">{comp.name}</h3>
                  <p className="text-xs text-[var(--terracotta)]">{comp.desc}</p>
                </div>
                <Badge variant="default">{comp.category}</Badge>
              </div>
              <div className="mt-2 flex gap-1.5">
                {comp.clients.map((c) => (
                  <span key={c} className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-semibold text-[var(--terracotta)]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-[var(--bg-2)] p-6">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--terracotta)]">Aperçu live</div>
              {comp.preview}
            </div>

            {/* Code */}
            <div className="border-t border-[var(--border)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--terracotta)]">Code</span>
                <button
                  onClick={() => copyCode(comp.code, comp.id)}
                  className="flex items-center gap-1 text-xs text-[var(--terracotta)] hover:text-[var(--amber)]"
                >
                  {copiedId === comp.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === comp.id ? 'Copié!' : 'Copier le code'}
                </button>
              </div>
              <pre className="max-h-48 overflow-auto bg-[var(--bg-2)] p-3 text-[10px] leading-relaxed text-[var(--ink)]">
                <code>{comp.code}</code>
              </pre>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}