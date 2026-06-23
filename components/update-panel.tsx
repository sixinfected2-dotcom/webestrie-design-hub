'use client';

import { useState, useEffect } from 'react';
import { Settings, X, Check, Plus, Clock, GitCommit } from 'lucide-react';
import { hubData } from '@/lib/data';
import { cn } from '@/lib/utils';
import type { HubState, SessionLogEntry } from '@/lib/types';

export function UpdatePanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<HubState | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newLog, setNewLog] = useState('');
  const [selectedMission, setSelectedMission] = useState('');
  const [selectedPage, setSelectedPage] = useState('');

  useEffect(() => {
    if (open && !state) {
      fetch('/api/update-stats')
        .then((r) => r.json())
        .then((data) => setState(data))
        .catch(() => setState(null));
    }
  }, [open, state]);

  const allMissions = hubData.clients.flatMap((c) =>
    c.missions.map((m) => ({ id: m.id, label: `M${m.num} · ${m.title}`, client: c.name, status: m.status }))
  );
  const allPages = hubData.clients.flatMap((c) =>
    c.pages.map((p) => ({ path: p.path, label: `${c.name} · ${p.name}`, status: p.status }))
  );

  const handleMissionLive = async () => {
    if (!selectedMission) return;
    setLoading(true);
    const res = await fetch('/api/update-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        missionUpdates: [{ id: selectedMission, status: 'live' }],
      }),
    });
    const data = await res.json();
    if (data.state) setState(data.state);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePageLive = async () => {
    if (!selectedPage) return;
    setLoading(true);
    const res = await fetch('/api/update-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageUpdates: [{ path: selectedPage, status: 'live' }],
      }),
    });
    const data = await res.json();
    if (data.state) setState(data.state);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddLog = async () => {
    if (!newLog.trim()) return;
    setLoading(true);
    const res = await fetch('/api/update-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionLog: {
          date: new Date().toISOString(),
          description: newLog.trim(),
        },
      }),
    });
    const data = await res.json();
    if (data.state) setState(data.state);
    setNewLog('');
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('fr-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <>
      {/* Gear icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-2)] text-[var(--ink)] transition-all hover:border-[var(--amber)] hover:scale-105"
        title="Mettre à jour les stats"
      >
        <Settings className={cn('h-4 w-4 transition-transform', open && 'rotate-90')} />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative z-50 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-lg)] animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-[var(--amber)]" />
                <h3 className="font-heading text-lg text-[var(--ink)]">Mise à jour dashboard</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-[var(--terracotta)] hover:text-[var(--ink)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
              {/* Last updated */}
              {state && (
                <div className="flex items-center gap-2 text-xs text-[var(--terracotta)]">
                  <Clock className="h-3 w-3" />
                  Dernière mise à jour: {formatTimestamp(state.lastUpdated)}
                </div>
              )}

              {saved && (
                <div className="flex items-center gap-2 rounded-lg bg-[rgba(94,158,64,0.12)] p-2 text-xs text-[var(--green-mid)] animate-fade-in">
                  <Check className="h-3.5 w-3.5" />
                  Modification enregistrée
                </div>
              )}

              {/* Mission live */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">
                  Marquer une mission "live"
                </h4>
                <div className="flex gap-2">
                  <select
                    value={selectedMission}
                    onChange={(e) => setSelectedMission(e.target.value)}
                    className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--amber)]"
                  >
                    <option value="">Sélectionner une mission...</option>
                    {allMissions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.status})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleMissionLive}
                    disabled={!selectedMission || loading}
                    className="rounded-lg bg-[var(--green-mid)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  >
                    Live
                  </button>
                </div>
              </div>

              {/* Page live */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">
                  Marquer une page "live"
                </h4>
                <div className="flex gap-2">
                  <select
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--amber)]"
                  >
                    <option value="">Sélectionner une page...</option>
                    {allPages.map((p) => (
                      <option key={p.path} value={p.path}>
                        {p.label} ({p.status})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handlePageLive}
                    disabled={!selectedPage || loading}
                    className="rounded-lg bg-[var(--green-mid)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  >
                    Live
                  </button>
                </div>
              </div>

              {/* Session log */}
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">
                  Nouvelle entrée de session
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Description de la session..."
                    value={newLog}
                    onChange={(e) => setNewLog(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                    className="h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] px-3 text-sm text-[var(--ink)] placeholder:text-[var(--terracotta)] focus:outline-none focus:border-[var(--amber)]"
                  />
                  <button
                    onClick={handleAddLog}
                    disabled={!newLog.trim() || loading}
                    className="flex items-center gap-1 rounded-lg bg-[var(--amber)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                    Ajouter
                  </button>
                </div>
              </div>

              {/* Session logs */}
              {state && state.sessionLogs.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--amber)]">
                    Sessions ({state.sessionLogs.length})
                  </h4>
                  <div className="space-y-2">
                    {state.sessionLogs.slice().reverse().map((log, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-3"
                      >
                        <div className="flex items-center gap-2 text-xs text-[var(--terracotta)]">
                          <GitCommit className="h-3 w-3" />
                          {formatTimestamp(log.date)}
                        </div>
                        <p className="mt-1 text-sm text-[var(--ink)]">{log.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}