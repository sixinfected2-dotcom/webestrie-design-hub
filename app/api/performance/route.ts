import { NextRequest, NextResponse } from 'next/server';
import { readPerformanceData, writePerformanceData, samplePerformanceData } from '@/lib/performance-state';
import type { PerformanceEntry } from '@/lib/types';

export async function GET(request: NextRequest) {
  const client = request.nextUrl.searchParams.get('client') || 'ct-arbro';
  let entries = await readPerformanceData(client);

  // Seed sample data if none exists
  if (entries.length === 0) {
    entries = samplePerformanceData;
    await writePerformanceData(client, entries);
  }

  return NextResponse.json({ entries });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = body.client || 'ct-arbro';

    let entries = await readPerformanceData(client);
    if (entries.length === 0) {
      entries = [...samplePerformanceData];
    }

    const newEntry: PerformanceEntry = {
      id: `pf-${Date.now()}`,
      date: body.date || new Date().toISOString().split('T')[0],
      lcp: Number(body.lcp) || 0,
      cls: Number(body.cls) || 0,
      lighthouse: Number(body.lighthouse) || 0,
      inp: Number(body.inp) || 0,
      missionId: body.missionId || undefined,
      notes: body.notes || undefined,
    };

    entries.push(newEntry);
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await writePerformanceData(client, entries);

    return NextResponse.json({ success: true, entries });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}