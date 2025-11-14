// app/actions/getUserRole.ts
'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getUserRole() {
  const { userId } = await auth();
  if (!userId) return (redirect('/'));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role ?? null;
}
