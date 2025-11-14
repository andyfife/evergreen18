// components/AppSidebarServer.tsx  (NO 'use client')

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { AppSidebar } from '@/components/AppSidebarClient';

export default async function AppSidebarServer(
  props: Omit<React.ComponentProps<typeof AppSidebar>, 'isAdmin' | 'isSignedIn' | 'unreadCount'>
) {
  const { userId } = await auth();

  // Adjust this to your schema: if you store Clerk ID as `clerkId`, query by that.
  const me = userId
    ? await prisma.user.findUnique({
        where: { id: userId }, // or { clerkId: userId }
        select: { role: true },
      })
    : null;

  // Get unread notification count
  const unreadCount = userId
    ? await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      })
    : 0;

  const isSignedIn = Boolean(userId);
  const isAdmin = me?.role === UserRole.ADMIN;

  // Put spread BEFORE explicit props to avoid the overwrite warning.
  return <AppSidebar {...props} isSignedIn={isSignedIn} isAdmin={isAdmin} unreadCount={unreadCount} />;
}
