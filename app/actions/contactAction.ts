'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email format'),
  comment: z.string().min(1, 'Comment is required'),
  userId: z.string().optional(),
});

export type ContactActionState = {
  success: boolean;
  message?: string;
  // store one message per field (simple)
  errors?: Record<'name' | 'email' | 'comment' | 'userId', string>;
};

export async function submitContactForm(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const { userId } = await auth();
  if (!userId) return redirect('/');
  // receives FormData automatically (per docs)
  const data = Object.fromEntries(formData) as Record<string, unknown>;

  const parsed = ContactFormSchema.safeParse({
    name: data.name ?? '',
    email: data.email ?? '',
    comment: data.comment ?? '',
    userId: (data.userId as string) || undefined,
  });

  if (!parsed.success) {
    // build a simple string-per-field map from zod issues
    const fieldErrors: Record<'name' | 'email' | 'comment' | 'userId', string> =
      {
        name: '',
        email: '',
        comment: '',
        userId: '',
      };
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;
      if (key) fieldErrors[key] = issue.message;
    }
    return {
      success: false,
      message: 'Validation failed',
      errors: fieldErrors,
    };
  }

  try {
    await prisma.contact.create({ data: parsed.data });
    return {
      success: true,
      message: 'Thank you for your feedback!',
      errors: { name: '', email: '', comment: '', userId: '' },
    };
  } catch (err) {
    console.error('submitContactForm error:', err);
    return { success: false, message: 'Failed to process form' };
  }
}
