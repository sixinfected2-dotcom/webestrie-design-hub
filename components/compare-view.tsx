'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ThumbsUp, Check, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Variant {
  id: string;
  name: string;
  mission: string;
  desc: string;
  guidance: string;
  preview: React.ReactNode;
}

interface ComponentGroup {
  key: string;
  label: string;
  description: string;
  variants: Variant[];
}

interface VoteRecord {
  componentKey: string;
  variantId: string;
  variantName: string;
  date: string;
}

// --- Variant Previews ---

function HeroPhotoFullPreview() {
  return (
    <div className="relative h-44 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--green-mid)] via-[var(--bg-3)] to-[var(--bg-2)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <h3 className="font-heading text-xl text-[var(--ink)]">Arboriculture d'Estrie</h3>
        <p className="font-accent text-sm text-[var(--terracotta)]">30+ ans d'expertise</p>
        <span className="mt-3 rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs text-white">Demander une estimation</span>
      </div>
    </div>
  );
}

function HeroSplitFormPreview() {
  return (
    <div className="grid h-44 grid-cols-2 gap-2 overflow-hidden rounded-xl">
      <div className="flex flex-col justify-center bg-[var(--bg-2)] p-4">
        <h3 className="font-heading text-sm text-[var(--ink)]">Estimation gratuite</h3>
        <p className="text-[10px] text-[var(--terracotta)]">Réponse sous 24h</p>
        <div className="mt-2 space-y-1.5">
          <div className="h-5 rounded border border-[var(--border)] bg-[var(--bg)]" />
          <div className="h-5 rounded border border-[var(--border)] bg-[var(--bg)]" />
          <div className="h-7 rounded bg-[var(--amber)]" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-[var(--ink)] to-[var(--green-mid)] p-4">
        <div className="mt-4 space-y-2">
          <div className="h-2 w-3/4 rounded bg-white/30" />
          <div className="h-2 w-1/2 rounded bg-white/20" />
          <div className="h-2 w-2/3 rounded bg-white/20" />
        </div>
      </div>
    </div>
  );
}

function HeroCTAFirstPreview() {
  return (
    <div className="flex h-44 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-[var(--bg-2)]">
      <span className="rounded-full bg-[var(--amber)] px-6 py-2 text-xs font-bold text-white animate-pulse">Demander une estimation →</span>
      <h3 className="font-heading text-lg text-[var(--ink)]">Service rapide en Estrie</h3>
      <p className="text-xs text-[var(--terracotta)]">Cliquez ci-dessus pour commencer</p>
    </div>
  );
}

function CTACreamPreview() {
  return (
    <div className="rounded-xl bg-[var(--bg-2)] py-8 text-center">
      <div className="font-heading text-lg text-[var(--ink)]">Besoin d'une estimation?</div>
      <div className="text-xs text-[var(--terracotta)]">Consultation gratuite en Estrie</div>
      <span className="mt-3 inline-block rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs text-white">Demander maintenant</span>
    </div>
  );
}

function CTAForestPulsePreview() {
  return (
    <div className="rounded-xl bg-[var(--ink)] py-8 text-center">
      <div className="font-heading text-lg text-white">Prêt à commencer?</div>
      <div className="text-xs text-[var(--bg-2)]/80">Expertise arboricole depuis 30+ ans</div>
      <span className="mt-3 inline-block rounded-full bg-[var(--amber)] px-4 py-1.5 text-xs text-white animate-pulse">Demander maintenant</span>
    </div>
  );
}

function CTAAmberGradientPreview() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-[var(--amber)] to-[var(--amber-light)] py-8 text-center">
      <div className="font-heading text-lg text-white">Consultation gratuite</div>
      <div className="text-xs text-white/80">Estimation sans engagement</div>
      <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[var(--amber)]">Commencer →</span>
    </div>
  );
}

function CardBentoPreview() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2 row-span-2 rounded-xl bg-[var(--bg-2)] p-4">
        <div className="font-heading text-sm text-[var(--ink)]">Élagage structural</div>
        <div className="mt-1 text-[10px] text-[var(--terracotta)]">Technique professionnelle pour la santé de vos arbres</div>
        <div className="mt-3 h-12 rounded-lg bg-gradient-to-br from-[var(--bg-3)] to-[var(--bg)]" />
      </div>
      <div className="rounded-xl bg-[var(--bg-3)] p-3">
        <div className="text-xs font-semibold text-[var(--ink)]">Abattage</div>
        <div className="text-[9px] text-[var(--terracotta)]">Sécuritaire</div>
      </div>
      <div className="rounded-xl bg-[var(--bg-3)] p-3">
        <div className="text-xs font-semibold text-[var(--ink)]">Plantation</div>
        <div className="text-[9px] text-[var(--terracotta)]">Essences locales</div>
      </div>
    </div>
  );
}

function CardCleanGridPreview() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {['Élagage', 'Abattage', 'Plantation', 'Émondage'].map((label) => (
        <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3">
          <div className="text-xs font-semibold text-[var(--ink)]">{label}</div>
          <div className="text-[9px] text-[var(--terracotta)]">Service professionnel</div>
        </div>
      ))}
    </div>
  );
}

function CardStampPreview() {
  return (
    <div className="space-y-2">
      {['Élagage structural', 'Abattage sécuritaire', 'Plantation'].map((label, i) => (
        <div key={label} className={cn('rounded-lg border-2 p-3', i === 0 ? 'border-[var(--ink)] bg-[var(--bg)]' : 'border-dashed border-[var(--border)] bg-[var(--bg-2)]')}>
          <div className={cn('font-heading', i === 0 ? 'text-sm text-[var(--ink)]' : 'text-xs text-[var(--terracotta)]')}>{label}</div>
          {i === 0 && <div className="text-[9px] text-[var(--terracotta)]">30+ ans d'expérience</div>}
        </div>
      ))}
    </div>
  );
}

// --- Component Groups ---

const componentGroups: ComponentGroup[] = [
  {
    key: 'hero',
    label: 'Hero',
    description: 'Section d\'en-tête de page — première impression visuelle',
    variants: [
      {
        id: 'hero-photo-full',
        name: 'Photo Full + Overlay',
        mission: 'M29.1',
        desc: 'Hero pleine largeur avec photo 4K et overlay sage-editorial. Texte centré sur l\'overlay.',
        guidance: 'Idéal pour les pages d\'accueil qui veulent créer un impact visuel fort dès la première seconde.',
        preview: <HeroPhotoFullPreview />,
      },
      {
        id: 'hero-split-form',
        name: 'Split 60/40 + Form',
        mission: 'M34',
        desc: 'Hero divisé 60% contenu / 40% formulaire intégré. Conversion-first.',
        guidance: 'Parfait pour les pages de conversion (estimation, contact) où l\'action prime sur l\'esthétique.',
        preview: <HeroSplitFormPreview />,
      },
      {
        id: 'hero-cta-first',
        name: 'CTA-first',
        mission: 'M28.4',
        desc: 'CTA ambre pulse dès le hero, minimalisme radical. Le bouton est la star.',
        guidance: 'À utiliser sur les pages secondaires où la clarté de l\'action est plus importante que le contenu.',
        preview: <HeroCTAFirstPreview />,
      },
    ],
  },
  {
    key: 'cta',
    label: 'CTA',
    description: 'Sections d\'appel à l\'action — conversion et engagement',
    variants: [
      {
        id: 'cta-cream',
        name: 'Cream harmonisé',
        mission: 'M30.3',
        desc: 'CTA sur fond cream (#F5EFE4) avec texte forest. Doux, harmonieux, non-agressif.',
        guidance: 'Quand l\'utilisateur préfère un rendu doux et que le vert n\'est pas désiré.',
        preview: <CTACreamPreview />,
      },
      {
        id: 'cta-forest-pulse',
        name: 'Forest pulse',
        mission: 'M28.4',
        desc: 'CTA sur fond forest foncé avec bouton ambre pulse. Contraste élevé, énergie visuelle.',
        guidance: 'Pour attirer l\'attention sur une action prioritaire. À éviter si trop de sections sombres sur la page.',
        preview: <CTAForestPulsePreview />,
      },
      {
        id: 'cta-amber-gradient',
        name: 'Amber gradient',
        mission: '—',
        desc: 'CTA sur gradient ambre → ambre-light. Chaleureux, invitant, premium.',
        guidance: 'Alternative premium au forest pulse. Pour les pages où l\'on veut créer une sensation chaleureuse.',
        preview: <CTAAmberGradientPreview />,
      },
    ],
  },
  {
    key: 'cards',
    label: 'Cards',
    description: 'Cartes de contenu — services, galeries, expertises',
    variants: [
      {
        id: 'card-bento',
        name: 'Bento asymétrique',
        mission: 'M31',
        desc: 'Grille bento asymétrique avec tailles variables. Crée un rythme visuel dynamique.',
        guidance: 'Idéal pour les galeries et les sections services avec un élément principal et des secondaires.',
        preview: <CardBentoPreview />,
      },
      {
        id: 'card-clean-grid',
        name: 'Clean grid',
        mission: 'M31 sketch A',
        desc: 'Grille uniforme simple. Prévisible, claire, facile à scanner.',
        guidance: 'Quand la clarté et la symétrie priment. Bon pour les listes de services équivalents.',
        preview: <CardCleanGridPreview />,
      },
      {
        id: 'card-stamp',
        name: 'Stamp typographique',
        mission: 'M31 sketch C3',
        desc: 'Cartes typographiques avec hiérarchie visuelle forte. Style éditorial magazine.',
        guidance: 'Pour les sections où le texte et la hiérarchie sont plus importants que les images.',
        preview: <CardStampPreview />,
      },
    ],
  },
];

const STORAGE_KEY = 'hub-compare-votes';

export function CompareClient() {
  const searchParams = useSearchParams();
  const selectedKey = searchParams.get('component');
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      setVotes(stored);
    } catch {
      setVotes([]);
    }
  }, []);

  const getPreferredVariant = useCallback((componentKey: string): string | null => {
    const componentVotes = votes.filter((v) => v.componentKey === componentKey);
    if (componentVotes.length === 0) return null;
    const latest = componentVotes[componentVotes.length - 1];
    return latest.variantId;
  }, [votes]);

  const handleVote = useCallback((componentKey: string, variant: Variant) => {
    const record: VoteRecord = {
      componentKey,
      variantId: variant.id,
      variantName: variant.name,
      date: new Date().toISOString(),
    };
    const updated = [...votes, record];
    setVotes(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }, [votes]);

  // No component selected → show grid of available components
  if (!selectedKey) {
    return (
      <div className="space-y-8">
        <div className="animate-fade-up">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--terracotta)] transition-colors hover:text-[var(--amber)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux composants
          </Link>
          <h1 className="mt-4 font-heading text-3xl text-[var(--ink)]">
            Comparateur de <span className="font-accent text-[var(--terracotta)]">variantes</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--terracotta)]">
            Comparez 2-3 variantes d'un même composant côte à côte. Votez pour votre préférée et gardez l'historique des décisions.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {componentGroups.map((group, i) => (
            <Link
              key={group.key}
              href={`/components/compare?component=${group.key}`}
              className="block animate-fade-up"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              <Card className="card-hover h-full p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-[var(--amber)] px-3 py-1 text-xs font-semibold text-white">
                    {group.variants.length} variantes
                  </span>
                </div>
                <h3 className="font-heading text-xl text-[var(--ink)]">{group.label}</h3>
                <p className="mt-1 text-sm text-[var(--terracotta)]">{group.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[var(--amber)]">
                  Comparer maintenant <ArrowLeft className="h-3 w-3 rotate-180" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* History */}
        {mounted && votes.length > 0 && (
          <div className="animate-fade-up">
            <div className="section-divider mb-6" />
            <h2 className="mb-4 flex items-center gap-2 font-heading text-xl text-[var(--ink)]">
              <History className="h-4 w-4 text-[var(--amber)]" />
              Historique des décisions ({votes.length})
            </h2>
            <div className="space-y-2">
              {votes.slice().reverse().map((vote, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-3"
                >
                  <ThumbsUp className="h-4 w-4 shrink-0 text-[var(--green-mid)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--ink)]">
                      <span className="font-semibold">{vote.variantName}</span>
                      <span className="text-[var(--terracotta)]"> — {componentGroups.find((g) => g.key === vote.componentKey)?.label || vote.componentKey}</span>
                    </p>
                  </div>
                  <span className="text-xs text-[var(--terracotta)]">
                    {new Date(vote.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Component selected → show comparison
  const group = componentGroups.find((g) => g.key === selectedKey);

  if (!group) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--terracotta)]">Composant introuvable.</p>
        <Link href="/components/compare" className="mt-4 inline-block text-sm text-[var(--amber)] hover:underline">
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  const preferredId = getPreferredVariant(group.key);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-up">
        <Link
          href="/components/compare"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--terracotta)] transition-colors hover:text-[var(--amber)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Tous les composants
        </Link>
        <h1 className="mt-4 font-heading text-3xl text-[var(--ink)]">
          Comparateur — <span className="font-accent text-[var(--terracotta)]">{group.label}</span>
        </h1>
        <p className="mt-2 text-sm text-[var(--terracotta)]">{group.description}</p>
      </div>

      {/* Component selector */}
      <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {componentGroups.map((g) => (
          <Link
            key={g.key}
            href={`/components/compare?component=${g.key}`}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-all',
              g.key === selectedKey
                ? 'border-[var(--amber)] bg-[var(--amber)] text-white'
                : 'border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] hover:border-[var(--amber)]'
            )}
          >
            {g.label}
          </Link>
        ))}
      </div>

      {/* Variants side by side */}
      <div className={cn(
        'grid gap-5 animate-fade-up',
        group.variants.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
      )} style={{ animationDelay: '0.15s' }}>
        {group.variants.map((variant, i) => {
          const isPreferred = preferredId === variant.id;
          return (
            <Card
              key={variant.id}
              className={cn(
                'flex flex-col overflow-hidden transition-all duration-300',
                isPreferred ? 'border-[var(--green-mid)] ring-2 ring-[rgba(94,158,64,0.20)]' : 'border-[var(--border)]'
              )}
              style={{ animationDelay: `${0.15 + i * 0.05}s` }}
            >
              {/* Preview */}
              <div className="bg-[var(--bg-2)] p-6">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--terracotta)]">
                  Aperçu live
                </div>
                {variant.preview}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-lg text-[var(--ink)]">{variant.name}</h3>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--terracotta)] whitespace-nowrap">
                    {variant.mission}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--terracotta)]">{variant.desc}</p>

                {/* Guidance */}
                <div className="mt-3 rounded-lg bg-[var(--bg-2)] p-3">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[var(--amber)]">
                    Quand l'utiliser
                  </div>
                  <p className="text-xs text-[var(--ink)] leading-relaxed">{variant.guidance}</p>
                </div>

                {/* Vote button */}
                <button
                  onClick={() => handleVote(group.key, variant)}
                  className={cn(
                    'mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98]',
                    isPreferred
                      ? 'bg-[var(--green-mid)] text-white'
                      : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--green-mid)] hover:bg-[rgba(94,158,64,0.06)]'
                  )}
                >
                  {isPreferred ? (
                    <><Check className="h-4 w-4" /> Préféré</>
                  ) : (
                    <><ThumbsUp className="h-4 w-4" /> Préféré</>
                  )}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Decision history for this component */}
      {mounted && (
        <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="section-divider mb-6" />
          <h2 className="mb-4 flex items-center gap-2 font-heading text-xl text-[var(--ink)]">
            <History className="h-4 w-4 text-[var(--amber)]" />
            Historique des décisions
          </h2>
          {votes.filter((v) => v.componentKey === group.key).length === 0 ? (
            <p className="text-sm text-[var(--terracotta)]">Aucun vote enregistré pour ce composant. Votez ci-dessus pour commencer.</p>
          ) : (
            <div className="space-y-2">
              {votes.filter((v) => v.componentKey === group.key).slice().reverse().map((vote, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-3"
                >
                  <ThumbsUp className="h-4 w-4 shrink-0 text-[var(--green-mid)]" />
                  <span className="flex-1 text-sm text-[var(--ink)]">
                    <span className="font-semibold">{vote.variantName}</span> préféré
                  </span>
                  <span className="text-xs text-[var(--terracotta)]">
                    {new Date(vote.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* All votes */}
          {votes.length > 0 && (
            <>
              <h3 className="mb-3 mt-6 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">
                Toutes les décisions
              </h3>
              <div className="space-y-2">
                {votes.slice().reverse().map((vote, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 shrink-0 text-[var(--green-mid)]" />
                    <span className="flex-1 text-sm text-[var(--ink)]">
                      <span className="font-semibold">{vote.variantName}</span>
                      <span className="text-[var(--terracotta)]"> — {componentGroups.find((g) => g.key === vote.componentKey)?.label || vote.componentKey}</span>
                    </span>
                    <span className="text-xs text-[var(--terracotta)]">
                      {new Date(vote.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}