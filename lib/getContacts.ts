import { cache } from 'react';
import { prisma } from '@/lib/db';

export const getContacts = cache(async () => {
  return prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      comment: true,
      userId: true,
      createdAt: true,
    },
  });
});
