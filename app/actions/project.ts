'use server';

import { contactSchema } from '@/schemas/project';
import z from 'zod';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export async function createProject(unsafeData: z.infer<typeof contactSchema>) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const data = contactSchema.safeParse(unsafeData);

  if (!data.success) return { success: false };

  // Save to DB

  try {
    await prisma.contact.create({ data: data.data });
    return {
      success: true,
      message: "Thank you for your feedback! We'll get back to you soon.",
      errors: { name: '', email: '', comment: '', userId: '' },
    };
  } catch (err) {
    console.error('submitContactForm error:', err);
    return { success: false, message: 'Failed to process form' };
  }
}
