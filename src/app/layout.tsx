import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Legal.ai | AI Legal Assistant',
  description: 'A GenAI-powered solution that makes legal information and basic legal assistance more accessible by helping users understand, compare, and navigate legal documents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
