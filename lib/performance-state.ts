import { promises as fs } from 'fs';
import path from 'path';
import type { PerformanceEntry } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function getFilePath(client: string): string {
  return path.join(DATA_DIR, `performance-${client}.json`);
}

export async function readPerformanceData(client: string): Promise<PerformanceEntry[]> {
  try {
    const raw = await fs.readFile(getFilePath(client), 'utf-8');
    return JSON.parse(raw) as PerformanceEntry[];
  } catch {
    return [];
  }
}

export async function writePerformanceData(client: string, entries: PerformanceEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(getFilePath(client), JSON.stringify(entries, null, 2), 'utf-8');
}

export const defaultBudget = {
  lcp: 2.5,
  cls: 0.1,
  lighthouse: 90,
  inp: 200,
};

// Sample data for C&T Arbro
export const samplePerformanceData: PerformanceEntry[] = [
  {
    id: 'pf-1',
    date: '2026-04-15',
    lcp: 4.2,
    cls: 0.18,
    lighthouse: 72,
    inp: 340,
    missionId: 'M24',
    notes: 'État initial avant refonte',
  },
  {
    id: 'pf-2',
    date: '2026-05-20',
    lcp: 3.1,
    cls: 0.12,
    lighthouse: 81,
    inp: 280,
    missionId: 'M29',
    notes: 'Après harmonisation accueil',
  },
  {
    id: 'pf-3',
    date: '2026-06-15',
    lcp: 2.3,
    cls: 0.08,
    lighthouse: 89,
    inp: 210,
    missionId: 'M34',
    notes: 'Après /estimation redesign',
  },
];