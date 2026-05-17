
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KuzuTakip - Kuzu Doğum ve Aşı Takip Sistemi',
  description: 'Doğan kuzularınızı kaydedin ve aşı takvimlerini kolayca yönetin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
