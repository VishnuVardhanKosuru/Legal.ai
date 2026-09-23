import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: 'Legal.ai — AI Legal Document Assistant',
  description:
    'A high-precision GenAI assistant built on Google Gemini to summarize, compare, analyze risks, and navigate complex legal documents responsibly.',
  keywords: ['legal AI', 'contract analysis', 'document comparison', 'Gemini AI', 'legal assistant'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
