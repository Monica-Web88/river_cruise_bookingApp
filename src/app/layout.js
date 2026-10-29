import { Fraunces, Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import './globals.css';
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Alderwater River Cruises | Small-ship voyages on Europe’s and Asia’s great rivers',
    template: '%s | Alderwater River Cruises',
  },
  description:
    'Browse river cruises on the Danube, Rhine, Seine, Douro, Rhône and Mekong. Filter by river, month, price and duration, explore day-by-day itineraries and request a personalised quote.',
  openGraph: {
    type: 'website',
    siteName: 'Alderwater River Cruises',
    title: 'Alderwater River Cruises',
    description: 'Small-ship voyages on Europe’s and Asia’s great rivers.',
  },
};
export const viewport = {
  themeColor: '#FAF6EE',
  width: 'device-width',
  initialScale: 1,
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-mist-700 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
