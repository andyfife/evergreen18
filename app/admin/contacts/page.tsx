import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { AdminContactsTable } from '@/components/AdminContactsTable';
import { UserRole } from '@prisma/client';
import { getContacts } from '@/lib/getContacts';
import { prisma } from '@/lib/db';
import { Suspense } from 'react';

async function AdminContactsContent() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const me = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!me || me.role !== UserRole.ADMIN) redirect('/');

  const contactsRaw = await getContacts();

  const contacts = contactsRaw.map((c) => ({
    id: c.id,
    name: c.name ?? '',
    email: c.email ?? '',
    comment: c.comment ?? '',
    userId: c.userId ?? null,
    createdAt: c.createdAt.toISOString(),
  }));

  return <AdminContactsTable data={contacts} />;
}

export default function AdminContactsPage() {
  return (
    <Suspense fallback={<div>Loading contacts...</div>}>
      <AdminContactsContent />
    </Suspense>
  );
}
