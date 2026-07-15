# CLAUDE.md — Design System Hub

> @AGENTS.md dans ~/Documents/agent-os-vault/ pour les règles partagées.
> @CLAUDE.md dans ~/Documents/agent-os-vault/CLAUDE.md pour les conventions Claude Code génériques.

## Projet

- Design system hub pour WebEstrie — tokens, sketches, portal clients
- Repo: sixinfected2-dotcom/webestrie-design-hub
- Path local: ~/Desktop/design-system-hub-v4
- Vault: `~/Documents/agent-os-vault/05-Projects/design-hub/`
- SHARED.md: `~/Documents/agent-os-vault/05-Projects/design-hub/SHARED.md`
- Roadmap: `~/Documents/agent-os-vault/05-Projects/design-hub-roadmap.md`
- Vercel: https://design-system-hub-v4.vercel.app

## Avant de travailler

1. Lis `~/Documents/agent-os-vault/05-Projects/design-hub/SHARED.md` — savoir ce que Hermes a fait
2. Lis `~/Documents/agent-os-vault/05-Projects/design-hub-roadmap.md` — état d'avancement
3. Check la branche: `git branch --show-current`

## Après ton travail

Update le vault (obligatoire). Respecte les signatures — les primitives sortent sur `die` si le compte d'arguments est faux.

```bash
API=~/Documents/agent-os-vault/00-System/bin/api
export VAULT_AGENT=claude

# Résumé narratif dans SHARED.md (remplace le body, garde le frontmatter)
bash $API/set-shared-context.sh design-hub "<résumé court: ce que tu as fait, fichiers, branche, commit>"

# Message à Hermes si besoin de feedback/instructions
# send.sh <to-agent> <type> <message> [ref] — TROIS arguments minimum
bash $API/send.sh hermes retour "Design Hub — <résumé court>"
```

## Stack

- Next.js 16 (App Router, RSC par défaut)
- Tailwind CSS v4 (CSS variables)
- TypeScript strict
- shadcn/ui
- lucide-react
- Vercel (déploiement)

## Pages (12)

- Dashboard — stats + client cards
- Client detail — phases timeline, missions, sketches
- Design tokens editor — export Tailwind
- Component library — live previews
- Page audit checklist — localStorage
- Time Machine — historique versions
- Templates — templates réutilisables
- Client Portal — accès client
- A/B Comparator — comparaison designs
- Performance Tracker — métriques
- Activity Feed — événements
- Auto-Update — sync data

## Règles spécifiques

1. **Design-system only** — Ce hub gère les tokens, sketches, et le portal. Pas de logique business client ici.
2. **Pas de fake data** — Données réelles seulement.
3. **Design** — Minimaliste Apple/Claude. Clean, blanc, accent subtil.
4. **No emojis** — lucide-react uniquement.

## Anti-slop

- JAMAIS de color swap pour "casser un pattern" → restructurer le layout
- JAMAIS de "use client" sans interactivité → Server Components