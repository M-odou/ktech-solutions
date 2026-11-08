import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import { SITE_URL } from '@/config/site';
import { getSettings } from '@/server/queries/content';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export async function generateMetadata(): Promise<Metadata> {
  const { company } = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${company.name} | ${company.tagline}`, template: `%s | ${company.name}` },
    description: company.description,
    applicationName: company.name,
    openGraph: { type: 'website', siteName: company.name, locale: 'fr_SN' },
    twitter: { card: 'summary_large_image' },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090C10' },
    { media: '(prefers-color-scheme: light)', color: '#F6F8F7' },
  ],
};

/**
 * Thème appliqué avant le premier affichage (aucun flash) :
 * choix enregistré > préférence du système > sombre.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" data-theme="dark" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
