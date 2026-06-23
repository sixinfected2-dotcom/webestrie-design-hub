import type { HubData, HubState } from './types';

export const hubData: HubData = {
  version: '4.1.0',
  lastUpdated: '2026-06-23',
  agency: {
    name: 'WebEstrie',
    logo: '/assets/logo-webestrie.png',
    logoAnimated: '/assets/logo-webestrie-animated.gif',
  },
  clients: [
    {
      slug: 'ct-arbro',
      name: 'C&T Arbro',
      logo: '/assets/logo-ct-arbro.png',
      domain: 'ctarbro.ca',
      industry: 'Arboriculture',
      region: 'Estrie',
      years: '30+ ans',
      palette: 'sage-editorial',
      tech: ['Next.js 16', 'Tailwind v4', 'Vercel', 'ScrollReveal'],
      phases: [
        { id: 'E', label: 'Phase E', status: 'done', desc: 'Dark mode off, base stable' },
        { id: 'F0', label: 'F.0 Accueil', status: 'done', desc: 'M29.1-3 live' },
        { id: 'F1', label: 'F.1 Territoire', status: 'done', desc: 'M30.1-3 live' },
        { id: 'F2', label: 'F.2 Galerie', status: 'done', desc: 'M31.1 live' },
        { id: 'F3', label: 'F.3 Avis', status: 'in-progress', desc: 'M33 E7 implémenté, E9 rejeté' },
        { id: 'F4', label: 'F.4 Estimation', status: 'in-progress', desc: 'M34.1-3 live, perfectionnement en cours' },
        { id: 'F5', label: 'F.5+ Pages', status: 'pending', desc: 'Apropos, garanties, etc.' },
      ],
      missions: [
        {
          id: 'M34',
          num: 34,
          title: '/estimation redesign',
          phase: 'F4',
          status: 'in-progress',
          tag: 'En cours',
          meta: '5 sketches · B choisi · fusion /contact',
          sketches: [
            { id: 'A', name: 'Split form 60/40', desc: 'Hero + 5 étapes + form 60% + sidebar forest 40%', status: 'explored' },
            { id: 'B', name: 'Form first', desc: 'Formulaire dès le hero, split 50/50 + sidebar forest. Le plus pro.', status: 'selected', featured: true },
            { id: 'C', name: 'Magazine 3 actes', desc: 'Hero + 3 étapes éditoriales + sidebar forest + form pleine largeur', status: 'explored' },
            { id: 'D', name: 'Sticky CTA + scroll', desc: 'Form ancré + bouton sticky bottom right + scroll horizontal', status: 'explored' },
            { id: 'E', name: 'Dual panel 55/45', desc: 'Form 55% + sidebar forest 45% (urgence, coords, inclus, zones)', status: 'explored' },
          ],
          commits: ['9b84093', '57fef0c', '04b20d0', 'be74d2e'],
          liveUrl: 'https://ctarbro.ca/estimation',
        },
        {
          id: 'M33',
          num: 33,
          title: '/avis refonte',
          phase: 'F3',
          status: 'in-progress',
          tag: 'E9 rejeté',
          meta: 'Vrais avis Google à scraper',
          sketches: [
            { id: 'E7', name: 'Centered zen', desc: 'Hero minimal + 3 vrais avis + 2 CTA Google/Facebook + divider animé', status: 'implemented' },
            { id: 'E8', name: 'Centered stats', desc: 'Variante avec stats centrées', status: 'explored' },
            { id: 'E9', name: 'Centered stats v2', desc: 'REJETÉ — ne ressemble pas au concept, faux avis', status: 'rejected' },
          ],
          notes: 'URL Google reviews: search?q=ct+arbro#lrd=0x2d461fa980456b79:0x170f891c6a844580. JAMAIS de faux avis.',
          liveUrl: 'https://ctarbro.ca/avis',
        },
        {
          id: 'M32',
          num: 32,
          title: '/galerie v2 exploration',
          phase: 'F2',
          status: 'archive',
          tag: 'Archive',
          meta: '5 versions · M31 retenu à la place',
          sketches: [
            { id: 'v1', name: 'Stack 3 photos', desc: 'Photos empilées rotation 1.5°', status: 'archive' },
            { id: 'v2', name: 'Curated features', desc: 'Sélection avec focus', status: 'archive' },
            { id: 'v3', name: 'Bento vignettes', desc: 'Bento avec vignettes', status: 'archive' },
          ],
        },
        {
          id: 'M31',
          num: 31,
          title: '/galerie C2-pro-animé',
          phase: 'F2',
          status: 'live',
          tag: 'Live',
          meta: '11 sketches · C2-pro-animé final · 8 animations CSS',
          sketches: [
            { id: 'A', name: 'Clean grid', desc: 'Grid simple', status: 'explored' },
            { id: 'B', name: 'Curated features', desc: 'Features avec focus', status: 'explored' },
            { id: 'C', name: 'Bento villes', desc: 'Tri par ville', status: 'explored' },
            { id: 'C1', name: 'Cards éditoriales', desc: 'Par technique, cards', status: 'explored' },
            { id: 'C2', name: 'Bento asymétrique', desc: 'Par technique, bento', status: 'explored' },
            { id: 'C3', name: 'Stamp typographique', desc: 'Par technique, stamp', status: 'explored' },
            { id: 'C2-pro', name: 'Premium pro', desc: 'Push qualité C2', status: 'explored' },
            { id: 'C2-elegant', name: 'Élégant', desc: 'Push élégant C2', status: 'explored' },
            { id: 'C2-pro-anime', name: 'Animé', desc: '8 animations CSS + IntersectionObserver', status: 'explored' },
            { id: 'C2-pro-anime-final', name: 'Animé final', desc: 'Version finale sélectionnée', status: 'selected', featured: true },
          ],
          commits: ['89e090e', 'eb98e70'],
          liveUrl: 'https://ctarbro.ca/galerie',
          components: ['ScrollReveal.tsx (43 lignes, IntersectionObserver réutilisable)'],
        },
        {
          id: 'M30',
          num: 30,
          title: '/territoire refonte',
          phase: 'F1',
          status: 'live',
          tag: 'Live',
          meta: '3 sous-missions · L\'essentiel + CTA cream',
          subMissions: [
            { id: '30.1', name: 'Bande stats retirée', desc: 'Bande stats /territoire retirée. Page plus épurée.', status: 'live' },
            { id: '30.2', name: 'A · L\'essentiel', desc: 'Expertise : 3 paragraphes → 1 + encadré 3 bullets. Retrait DarkCTASection.', status: 'live' },
            { id: '30.3', name: 'CTA final cream', desc: 'Forest → cream #F5EFE4. Directive user \'le vert j\'aime pas\'.', status: 'live' },
          ],
          liveUrl: 'https://ctarbro.ca/territoire',
        },
        {
          id: 'M29',
          num: 29,
          title: '/accueil harmonisation',
          phase: 'F0',
          status: 'live',
          tag: 'Live',
          meta: '3 sous-missions · sage-editorial unifié',
          subMissions: [
            { id: '29.1', name: 'HomeHero photo FULL', desc: 'Hero accueil photo 4K + overlay sage-editorial. Concept E validé.', status: 'live', commit: '104e8f7' },
            { id: '29.2', name: 'BentoBump \'30+\' harmonisé', desc: 'Case \'30+ années\' forest+amber → cream+forest+terracotta.', status: 'live', commit: 'af3f814' },
            { id: '29.3', name: '\'Nos expertises\' cream', desc: 'bg-white → bg-[#F5EFE4] pour harmoniser.', status: 'live', commit: 'ef3a1be' },
          ],
          liveUrl: 'https://ctarbro.ca/',
        },
        {
          id: 'M28',
          num: 28,
          title: 'Refonte 5 heros + hotfix',
          phase: 'E',
          status: 'live',
          tag: 'Live',
          meta: '6 sous-missions · tous live sur ctarbro.ca',
          subMissions: [
            { id: '28.1', name: '/territoire — B-clean', desc: '6 pins Estrie + stamp 50 retiré (M28.6).', status: 'archive' },
            { id: '28.2', name: '/galerie — Stack 3 photos', desc: 'Photos empilées rotation 1.5°.', status: 'archive' },
            { id: '28.3', name: '/avis — 3 quote cards', desc: 'Cards flottantes rotées, blur backdrop.', status: 'archive' },
            { id: '28.4', name: '/contact — CTA-first', desc: 'CTA ambre pulse + form preview.', status: 'archive' },
            { id: '28.5', name: '/estimation — 30+ ans', desc: 'Forest visual 3-layer + stamp 30+.', status: 'archive' },
            { id: '28.6', name: 'Stamp 50 retiré', desc: 'Hotfix 1 fichier, -17L. Leçon Vercel double-deploy.', status: 'archive' },
          ],
        },
        {
          id: 'M27',
          num: 27,
          title: 'Sage-editorial (5 pages + PageHero)',
          phase: 'E',
          status: 'archive',
          tag: 'Archive',
          meta: '5 pages harmonisées vers palette sage',
          commits: ['7fd4814'],
        },
        {
          id: 'M26',
          num: 26,
          title: 'Audit 5 constats',
          phase: 'E',
          status: 'archive',
          tag: 'Archive',
          meta: 'Favicon, smooth-scroll, bento, FAQ, doublon fix',
          commits: ['ce70af3'],
        },
        {
          id: 'M25',
          num: 25,
          title: '5 retouches post-M24',
          phase: 'E',
          status: 'archive',
          tag: 'Archive',
          meta: 'Sur /services',
          commits: ['866f0b7'],
        },
        {
          id: 'M24',
          num: 24,
          title: 'Sage Editorial /services',
          phase: 'E',
          status: 'archive',
          tag: 'Gold',
          meta: 'Process + FAQ + CTA. Gold standard M28.',
          commits: ['21bcaf9'],
        },
        {
          id: 'M21a',
          num: 21,
          title: 'Dark CTA sections',
          phase: 'E',
          status: 'archive',
          tag: 'Archive',
          meta: 'Phase 4 approved',
        },
      ],
      pages: [
        { path: '/', name: 'Accueil', status: 'live', mission: 'M29' },
        { path: '/services', name: '/services', status: 'live', mission: 'Gold' },
        { path: '/territoire', name: '/territoire', status: 'live', mission: 'M30' },
        { path: '/galerie', name: '/galerie', status: 'live', mission: 'M31.1' },
        { path: '/avis', name: '/avis', status: 'in-progress', mission: 'M33' },
        { path: '/contact', name: '/contact', status: 'live', mission: 'M28.4' },
        { path: '/estimation', name: '/estimation', status: 'in-progress', mission: 'M34' },
        { path: '/apropos', name: '/apropos', status: 'pending', mission: 'F.x' },
        { path: '/garanties', name: '/garanties', status: 'pending', mission: 'F.x' },
      ],
    },
  ],
  tools: [
    { name: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', desc: 'Deploys, logs, env vars · project prj_hrXAGAHknBnOMtW3biqdjfJtTbZp', icon: '▲' },
    { name: 'GitHub Repo', url: 'https://github.com/sixinfected2-dotcom/C-T-Arbro-Website', desc: 'Commits, branches, PRs · repoId 1212899726', icon: '⊙' },
    { name: 'DECISIONS.md', url: 'file:///Users/gee0x8/Documents/Claude%20Code%20/01-Inbox%20%F0%9F%93%A5/C-T-Arbro/DECISIONS.md', desc: 'Toutes les décisions depuis M24', icon: '📝' },
    { name: 'Vault Hermes', url: 'file:///Users/gee0x8/Documents/hermes-vaults/', desc: 'Mémoire long-terme agent Hermes', icon: '🏛️' },
  ],
  themes: {
    'sage-editorial': {
      name: 'Sage Editorial',
      bg: '#FDFAF5',
      bg2: '#F5EFE4',
      bg3: '#EFE9DC',
      ink: '#1C3A18',
      terracotta: '#7A4F2D',
      amber: '#C97A10',
      amberLight: '#E89B45',
      greenMid: '#5E9E40',
      border: '#e8e0d1',
    },
    'ocean-breeze': {
      name: 'Ocean Breeze',
      bg: '#F0F7FA',
      bg2: '#E1EFF6',
      bg3: '#D3E6F2',
      ink: '#0D3B66',
      terracotta: '#6B7F8C',
      amber: '#E8A02C',
      amberLight: '#F0C463',
      greenMid: '#3A9D8E',
      border: '#C5D9E8',
    },
    'sunset-warm': {
      name: 'Sunset Warm',
      bg: '#FFF8F2',
      bg2: '#FDEEE2',
      bg3: '#FAE2D0',
      ink: '#7A2E1F',
      terracotta: '#B85C38',
      amber: '#D48016',
      amberLight: '#E8A53D',
      greenMid: '#8BAA47',
      border: '#EDD5C0',
    },
  },
  templates: [
    {
      id: 'tpl-1',
      name: 'Hero Photo Full + Overlay',
      category: 'hero',
      description: 'Hero pleine largeur avec photo 4K et overlay sage-editorial. Concept validé, paragraphe hero rédigé.',
      basedOn: 'M29.1',
      keyDecisions: [
        'Photo 4K plein écran plutôt que split',
        'Overlay sage-editorial pour lisibilité',
        'Texte hero centré sur l\'overlay',
      ],
      steps: [
        'Sélectionner photo 4K landscape',
        'Appliquer overlay linear-gradient sage-editorial',
        'Rédiger copy hero (titre + sous-titre)',
        'Tester en mobile (overlay opacité adaptée)',
      ],
    },
    {
      id: 'tpl-2',
      name: 'Bento Stats Harmonisé',
      category: 'stats',
      description: 'Bento grid avec statistiques harmonisé vers la palette cream + forest + terracotta au lieu de forest + amber.',
      basedOn: 'M29.2',
      keyDecisions: [
        'Passage de forest+amber à cream+forest+terracotta',
        'Case "30+ années" remaniée visuellement',
        'Harmonisation avec sections adjacentes',
      ],
      steps: [
        'Identifier les cases bento à harmoniser',
        'Remplacer les couleurs forest+amber par cream+forest',
        'Vérifier le contraste WCAG',
        'Tester la cohérence avec sections voisines',
      ],
    },
    {
      id: 'tpl-3',
      name: 'Cream Section Harmonization',
      category: 'harmonization',
      description: 'Remplacement de bg-white par bg-cream (#F5EFE4) pour harmoniser visuellement les sections adjacentes.',
      basedOn: 'M29.3',
      keyDecisions: [
        'bg-white → bg-[#F5EFE4] systématique',
        'Harmonisation du rythme visuel entre sections',
      ],
      steps: [
        'Identifier les sections bg-white à harmoniser',
        'Remplacer par bg-cream',
        'Vérifier la transition visuelle entre sections',
        'Valider en mobile et desktop',
      ],
    },
    {
      id: 'tpl-4',
      name: 'Bento Asymétrique + Animations',
      category: 'gallery',
      description: 'Bento grid asymétrique trié par technique avec 8 animations CSS déclenchées au scroll via IntersectionObserver.',
      basedOn: 'M31',
      keyDecisions: [
        'Bento asymétrique plutôt que grid uniforme',
        'Tri par technique arboricole',
        '8 animations CSS (fade, slide, scale, rotate...)',
        'ScrollReveal.tsx — composant IntersectionObserver réutilisable',
        'Version finale: C2-pro-anime-final',
      ],
      steps: [
        'Créer la structure bento asymétrique',
        'Implémenter ScrollReveal.tsx (IntersectionObserver)',
        'Ajouter 8 keyframes CSS (fade-up, slide-right, scale-in...)',
        'Assigner animations aux éléments au scroll',
        'Tester performance (respect prefers-reduced-motion)',
      ],
    },
    {
      id: 'tpl-5',
      name: 'Sketch Exploration Process',
      category: 'form',
      description: 'Processus d\'exploration de 5 sketches pour une page. Chaque sketch est exploré, puis un seul est sélectionné et implémenté.',
      basedOn: 'M34',
      keyDecisions: [
        '5 sketches minimum par mission critique',
        'Sélection basée sur professionnalisme et clarté',
        'Fusion possible avec pages existantes',
        'Chaque sketch documenté (id, nom, description, statut)',
      ],
      steps: [
        'Définir les objectifs de la page',
        'Produire 5 sketches distincts (A, B, C, D, E)',
        'Évaluer chaque sketch (explored → selected/rejected)',
        'Implémenter le sketch sélectionné',
        'Documenter les commits et l\'URL live',
      ],
    },
    {
      id: 'tpl-6',
      name: 'CTA Color Refinement',
      category: 'CTA',
      description: 'Raffinement couleur CTA : passage de forest à cream suite à directive utilisateur "le vert j\'aime pas".',
      basedOn: 'M30.3',
      keyDecisions: [
        'Écoute de la préférence utilisateur (anti-vert)',
        'Forest → cream #F5EFE4 pour CTA',
        'Maintien du contraste et de la lisibilité',
      ],
      steps: [
        'Identifier le CTA à raffiner',
        'Tester alternative cream',
        'Valider avec l\'utilisateur',
        'Implémenter et déployer',
      ],
    },
    {
      id: 'tpl-7',
      name: 'Phase Timeline Component',
      category: 'component',
      description: 'Timeline horizontale de phases avec nuds colorés par statut (done=in-progress=pending) et ligne de progression.',
      basedOn: 'M28',
      keyDecisions: [
        'Timeline horizontale responsive',
        'Nuds circulaires colorés par statut',
        'Ligne de progression entre nuds',
        'Icônes lucide-react (Check, Circle, Clock)',
      ],
      steps: [
        'Définir les phases et leurs statuts',
        'Créer la structure flex horizontale',
        'Styler les nuds selon le statut',
        'Ajouter les connecteurs entre nuds',
        'Rendre responsive (overflow-x-auto sur mobile)',
      ],
    },
    {
      id: 'tpl-8',
      name: 'Multi-Sub-Mission Pattern',
      category: 'structure',
      description: 'Pattern de mission avec sous-missions multiples, chacune avec son propre statut, commit et description.',
      basedOn: 'M30/M29',
      keyDecisions: [
        'Décomposition en sous-missions granulaires',
        'Statut individuel par sous-mission',
        'Commit hash par sous-mission',
        'Page parent agrégeant les sous-missions',
      ],
      steps: [
        'Identifier les sous-tâches d\'une mission',
        'Créer un SubMission[] avec id, name, desc, status',
        'Assigner un commit par sous-mission',
        'Lier à la page parent dans client.pages',
      ],
    },
  ],
};

// === Helper functions ===

export function getClient(slug: string) {
  return hubData.clients.find((c) => c.slug === slug);
}

export function getStats() {
  const clients = hubData.clients;
  const allMissions = clients.flatMap((c) => c.missions || []);
  const liveMissions = allMissions.filter((m) => m.status === 'live');
  const inProgress = allMissions.filter((m) => m.status === 'in-progress');
  const allPages = clients.flatMap((c) => c.pages || []);
  const livePages = allPages.filter((p) => p.status === 'live');
  const allSketches = allMissions.flatMap((m) => m.sketches || []);
  return {
    clients: clients.length,
    missions: allMissions.length,
    liveMissions: liveMissions.length,
    inProgress: inProgress.length,
    pages: allPages.length,
    livePages: livePages.length,
    sketches: allSketches.length,
  };
}

export function getRecentMissions(limit = 5) {
  return hubData.clients
    .flatMap((c) => (c.missions || []).map((m) => ({ ...m, clientName: c.name, clientSlug: c.slug })))
    .sort((a, b) => b.num - a.num)
    .slice(0, limit);
}

export function getMission(clientSlug: string, missionId: string) {
  const client = getClient(clientSlug);
  if (!client) return null;
  const mission = client.missions.find((m) => m.id === missionId);
  if (!mission) return null;
  return { client, mission };
}

export function getTemplates() {
  return hubData.templates;
}

export function getDefaultHubState(): HubState {
  return {
    lastUpdated: new Date().toISOString(),
    missionOverrides: {},
    pageOverrides: {},
    sessionLogs: [],
  };
}