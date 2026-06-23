// === Design System Hub v4.0 — Type Definitions ===

export type PhaseStatus = 'done' | 'in-progress' | 'pending';
export type MissionStatus = 'live' | 'in-progress' | 'archive' | 'rejected';
export type SketchStatus = 'selected' | 'implemented' | 'rejected' | 'explored' | 'archive';
export type PageStatus = 'live' | 'in-progress' | 'pending';
export type ThemeKey = 'sage-editorial' | 'ocean-breeze' | 'sunset-warm';

export interface Theme {
  name: string;
  bg: string;
  bg2: string;
  bg3: string;
  ink: string;
  terracotta: string;
  amber: string;
  amberLight: string;
  greenMid: string;
  border: string;
}

export interface Phase {
  id: string;
  label: string;
  status: PhaseStatus;
  desc: string;
}

export interface Sketch {
  id: string;
  name: string;
  desc: string;
  status: SketchStatus;
  featured?: boolean;
}

export interface SubMission {
  id: string;
  name: string;
  desc: string;
  status: 'live' | 'archive' | 'in-progress';
  commit?: string;
}

export interface Mission {
  id: string;
  num: number;
  title: string;
  phase: string;
  status: MissionStatus;
  tag: string;
  meta?: string;
  sketches?: Sketch[];
  subMissions?: SubMission[];
  commits?: string[];
  liveUrl?: string;
  notes?: string;
  components?: string[];
}

export interface ClientPage {
  path: string;
  name: string;
  status: PageStatus;
  mission: string;
}

export interface Client {
  slug: string;
  name: string;
  logo: string;
  domain: string;
  industry: string;
  region: string;
  years: string;
  palette: ThemeKey;
  tech: string[];
  phases: Phase[];
  missions: Mission[];
  pages: ClientPage[];
  portalPassword?: string;
}

export interface PerformanceEntry {
  id: string;
  date: string;
  lcp: number;
  cls: number;
  lighthouse: number;
  inp: number;
  missionId?: string;
  notes?: string;
}

export interface PerformanceBudget {
  lcp: number;
  cls: number;
  lighthouse: number;
  inp: number;
}

export interface Tool {
  name: string;
  url: string;
  desc: string;
  icon: string;
}

export type TemplateCategory =
  | 'hero'
  | 'gallery'
  | 'form'
  | 'CTA'
  | 'harmonization'
  | 'stats'
  | 'component'
  | 'structure';

export interface MissionTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  basedOn: string;
  keyDecisions: string[];
  steps: string[];
}

export interface SessionLogEntry {
  date: string;
  description: string;
}

export interface HubState {
  lastUpdated: string;
  missionOverrides: Record<string, { status: string }>;
  pageOverrides: Record<string, { status: string }>;
  sessionLogs: SessionLogEntry[];
}

export interface HubData {
  version: string;
  lastUpdated: string;
  agency: {
    name: string;
    logo: string;
    logoAnimated: string;
  };
  clients: Client[];
  tools: Tool[];
  themes: Record<ThemeKey, Theme>;
  templates: MissionTemplate[];
}