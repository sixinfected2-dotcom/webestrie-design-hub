import Link from 'next/link';
import { GitCompare } from 'lucide-react';
import { ComponentLibrary } from '@/components/component-library';

export default function ComponentsPage() {
  return (
    <div className="space-y-6">
      {/* Compare banner */}
      <Link
        href="/components/compare"
        className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg-2)] p-4 transition-all hover:border-[var(--amber)] hover:bg-[rgba(201,122,16,0.04)] animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--amber)] text-white">
            <GitCompare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base text-[var(--ink)]">Comparer des composants</h3>
            <p className="text-xs text-[var(--terracotta)]">Comparer 2-3 variantes côte à côte et voter pour la préférée</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-[var(--amber)]">Ouvrir →</span>
      </Link>
      <ComponentLibrary />
    </div>
  );
}