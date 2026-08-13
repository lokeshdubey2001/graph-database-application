import type { Metadata } from 'next';
import './globals.css';
import { HeaderNav } from '@/components/HeaderNav';

export const metadata: Metadata = {
  title: {
    default: 'DevGraph: Developer Knowledge & Skill Explorer',
    template: '%s | DevGraph',
  },
  description:
    'Explore developer skills, projects, and technology relationships powered by a CognoDB graph database.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HeaderNav />
        <main className="responsive-main-padding" style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
