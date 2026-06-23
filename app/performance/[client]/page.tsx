import { hubData } from '@/lib/data';
import { readPerformanceData, samplePerformanceData } from '@/lib/performance-state';
import { PerformanceTracker } from '@/components/performance-tracker';

export function generateStaticParams() {
  return hubData.clients.map((c) => ({ client: c.slug }));
}

export default async function PerformancePage({ params }: { params: Promise<{ client: string }> }) {
  void params;
  const clientSlug = 'ct-arbro';

  let entries = await readPerformanceData(clientSlug);
  if (entries.length === 0) {
    entries = samplePerformanceData;
  }

  return <PerformanceTracker clientSlug={clientSlug} initialEntries={entries} />;
}