import { NextRequest, NextResponse } from 'next/server';
import { readHubState, writeHubState } from '@/lib/hub-state';
import { getDefaultHubState } from '@/lib/data';
import type { HubState } from '@/lib/types';

export async function GET() {
  const state = await readHubState();
  return NextResponse.json(state);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const current = await readHubState();

    const updated: HubState = {
      lastUpdated: new Date().toISOString(),
      missionOverrides: { ...current.missionOverrides },
      pageOverrides: { ...current.pageOverrides },
      sessionLogs: [...current.sessionLogs],
    };

    // Apply mission status updates
    if (body.missionUpdates && Array.isArray(body.missionUpdates)) {
      for (const update of body.missionUpdates) {
        if (update.id && update.status) {
          updated.missionOverrides[update.id] = { status: update.status };
        }
      }
    }

    // Apply page status updates
    if (body.pageUpdates && Array.isArray(body.pageUpdates)) {
      for (const update of body.pageUpdates) {
        if (update.path && update.status) {
          updated.pageOverrides[update.path] = { status: update.status };
        }
      }
    }

    // Add session log entry
    if (body.sessionLog) {
      updated.sessionLogs.push({
        date: body.sessionLog.date || new Date().toISOString(),
        description: body.sessionLog.description || '',
      });
    }

    await writeHubState(updated);

    return NextResponse.json({ success: true, state: updated });
  } catch {
    const fallback = getDefaultHubState();
    return NextResponse.json({ success: false, error: 'Invalid request body', state: fallback }, { status: 400 });
  }
}