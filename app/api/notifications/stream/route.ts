// app/api/notifications/stream/route.ts
import { NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  let lastCheck = new Date();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );

      const interval = setInterval(async () => {
        try {
          // Get new notifications since last check
          const newNotifications = await prisma.notification.findMany({
            where: {
              userId: user.id,
              createdAt: { gt: lastCheck },
              read: false,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          });

          // Get total unread count
          const unreadCount = await prisma.notification.count({
            where: {
              userId: user.id,
              read: false,
            },
          });

          // Send new notification
          if (newNotifications.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'new_notification',
                  notification: newNotifications[0],
                })}\n\n`
              )
            );
          }

          // Send count update
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'count_update',
                count: unreadCount,
              })}\n\n`
            )
          );

          lastCheck = new Date();
        } catch (error) {
          console.error('SSE error:', error);
        }
      }, 3000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
