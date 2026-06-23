import { hubData } from '@/lib/data';
import { TokensEditor } from '@/components/tokens-editor';

export function generateStaticParams() {
  return hubData.clients.map((c) => ({ client: c.slug }));
}

export default function TokensPage({ params }: { params: Promise<{ client: string }> }) {
  void params;
  return <TokensEditor clientSlug="ct-arbro" />;
}