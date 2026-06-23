import type { Metadata } from 'next';
import { Inter, Gloock, Lora } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/app-shell';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const gloock = Gloock({
  variable: '--font-gloock',
  subsets: ['latin'],
  weight: '400',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  style: 'italic',
  weight: '400',
});

export const metadata: Metadata = {
  title: 'WebEstrie Design System Hub',
  description: 'Hub central de design system — SaaS multi-clients',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=JSON.parse(localStorage.getItem('hub-prefs')||'{}');if(p.darkMode==='dark'){document.documentElement.classList.add('dark');}if(p.theme){var t=${JSON.stringify({
              'sage-editorial': { bg: '#FDFAF5', bg2: '#F5EFE4', bg3: '#EFE9DC', ink: '#1C3A18', terracotta: '#7A4F2D', amber: '#C97A10', amberLight: '#E89B45', greenMid: '#5E9E40', border: '#e8e0d1' },
              'ocean-breeze': { bg: '#F0F7FA', bg2: '#E1EFF6', bg3: '#D3E6F2', ink: '#0D3B66', terracotta: '#6B7F8C', amber: '#E8A02C', amberLight: '#F0C463', greenMid: '#3A9D8E', border: '#C5D9E8' },
              'sunset-warm': { bg: '#FFF8F2', bg2: '#FDEEE2', bg3: '#FAE2D0', ink: '#7A2E1F', terracotta: '#B85C38', amber: '#D48016', amberLight: '#E8A53D', greenMid: '#8BAA47', border: '#EDD5C0' },
            })}[p.theme];if(t){var r=document.documentElement.style;r.setProperty('--bg',t.bg);r.setProperty('--bg-2',t.bg2);r.setProperty('--bg-3',t.bg3);r.setProperty('--ink',t.ink);r.setProperty('--terracotta',t.terracotta);r.setProperty('--amber',t.amber);r.setProperty('--amber-light',t.amberLight);r.setProperty('--green-mid',t.greenMid);r.setProperty('--border',t.border);}}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${gloock.variable} ${lora.variable} antialiased`}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}