import { Suspense } from 'react';
import { CompareClient } from '@/components/compare-view';

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-[var(--terracotta)]">Chargement...</div>}>
      <CompareClient />
    </Suspense>
  );
}