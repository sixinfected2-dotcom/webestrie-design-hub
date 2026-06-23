import { hubData } from '@/lib/data';
import { AuditChecklist } from '@/components/audit-checklist';

export function generateStaticParams() {
  return hubData.clients.map((c) => ({ client: c.slug }));
}

export default function AuditPage({ params }: { params: Promise<{ client: string }> }) {
  void params;
  return <AuditChecklist clientSlug="ct-arbro" />;
}