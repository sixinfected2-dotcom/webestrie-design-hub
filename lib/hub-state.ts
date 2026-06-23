import { promises as fs } from 'fs';
import path from 'path';
import { getDefaultHubState } from './data';
import type { HubState } from './types';

const STATE_FILE = path.join(process.cwd(), 'data', 'hub-state.json');

export async function readHubState(): Promise<HubState> {
  try {
    const raw = await fs.readFile(STATE_FILE, 'utf-8');
    return JSON.parse(raw) as HubState;
  } catch {
    return getDefaultHubState();
  }
}

export async function writeHubState(state: HubState): Promise<void> {
  const dir = path.dirname(STATE_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

export function getMissionEffectiveStatus(
  defaultStatus: string,
  missionId: string,
  state: HubState | null,
): string {
  if (state?.missionOverrides?.[missionId]?.status) {
    return state.missionOverrides[missionId].status;
  }
  return defaultStatus;
}

export function getPageEffectiveStatus(
  defaultStatus: string,
  pagePath: string,
  state: HubState | null,
): string {
  if (state?.pageOverrides?.[pagePath]?.status) {
    return state.pageOverrides[pagePath].status;
  }
  return defaultStatus;
}