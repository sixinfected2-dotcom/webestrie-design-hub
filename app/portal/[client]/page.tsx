import { hubData } from '@/lib/data';
import { PortalView } from '@/components/portal-view';

export function generateStaticParams() {
  return hubData.clients.map((c) => ({ client: c.slug }));
}

export default function PortalPage({ params }: { params: Promise<{ client: string }> }) {
  void params;
  return <PortalView clientSlug="ct-arbro" />;
}