import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId, userMediaId, type, title, message, link } =
      await req.json();

    const notification = await prisma.notification.create({
      data: {
        userId,
        userMediaId,
        type,
        title,
        message,
        link,
        read: false,
      },
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Failed to create notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
