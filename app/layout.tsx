// app/layout.tsx
import { Suspense } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ClientClerkProvider } from '@/components/ClientClerkProvider';
import TanstackProvider from '@/providers/TanstackProvider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { DM_Sans } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { Header } from '@/components/Header';
import AppSidebarServer from '@/components/AppSidebarServer';
import Footer from '@/components/Footer';
import InviteHandler from '@/components/friends/InviteHandler';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'recorded history',
  description: 'tales told',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL || 'https://sabrina.typto.io'
  ),
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'recorded history',
    description: 'tales told',
    url: 'https://sabrina.typto.io/',
    siteName: 'tales told',
    images: [
      {
        url: 'https://milkywayfiasco.sfo2.cdn.digitaloceanspaces.com/sabrina/images/hist-mandarin.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable} suppressHydrationWarning>
      <body className={dmSans.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientClerkProvider>
            <TanstackProvider>
              <SidebarProvider>
                <Suspense
                  fallback={<aside className="p-4">Loading nav...</aside>}
                >
                  <AppSidebarServer />
                </Suspense>

                <SidebarInset>
                  <Header />
                  <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                  </main>
                  <Footer />
                  <Toaster />
                  <InviteHandler />
                </SidebarInset>
              </SidebarProvider>
            </TanstackProvider>
          </ClientClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}
