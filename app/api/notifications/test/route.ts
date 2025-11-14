import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// Test endpoint to create a notification manually
export async function POST() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'test',
        title: 'Test Notification',
        message: 'This is a test notification created manually.',
        link: '/user/videos',
        read: false,
      },
    });

    console.log('[TEST] Created notification:', notification);

    return NextResponse.json({
      success: true,
      notification,
      message: 'Test notification created. Check your notifications!'
    });
  } catch (error) {
    console.error('[TEST] Failed to create notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification', details: error },
      { status: 500 }
    );
  }
}

// Get all notifications for current user (for debugging)
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length
    });
  } catch (error) {
    console.error('[TEST] Failed to fetch notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
