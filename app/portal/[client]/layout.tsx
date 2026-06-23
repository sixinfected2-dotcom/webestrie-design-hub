import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portail client · WebEstrie',
  description: 'Suivi de projet en temps réel — Portail client WebEstrie',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6 py-8 lg:py-12">
        {children}
      </div>
    </div>
  );
}