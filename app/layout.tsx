import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './hoodgate.css';
import './motion.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  icons: { icon: '/icon.svg' },
  // Browser translation must not rewrite server-rendered text before hydration.
  other: { google: 'notranslate' },
  title: 'HoodGate — the machine economy on Robinhood',
  description:
    'Discover services and configure payment offers on Robinhood Chain.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" className="dark notranslate">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
