// components/ClientClerkProvider.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function ClientClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Do NOT call server-only helpers here (auth(), prisma, cookies, etc.)
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default ClientClerkProvider;
