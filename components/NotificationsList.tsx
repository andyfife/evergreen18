'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
  userMedia: {
    name: string | null;
  } | null;
}

interface NotificationsListProps {
  notifications: Notification[];
}

export default function NotificationsList({
  notifications: initialNotifications,
}: NotificationsListProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      try {
        await fetch(`/api/notifications/${notification.id}/read`, {
          method: 'PATCH',
        });

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate if there's a link
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      router.refresh();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            className={`
              p-4 rounded-lg border cursor-pointer transition-all
              ${
                notification.read
                  ? 'bg-white border-gray-200 hover:border-gray-300'
                  : 'bg-blue-50 border-blue-200 hover:border-blue-300'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                mt-1 p-2 rounded-full
                ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}
              `}
              >
                {notification.type === 'video_ready' ? (
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      notification.read ? 'text-gray-600' : 'text-blue-600'
                    }`}
                  />
                ) : (
                  <Bell
                    className={`h-5 w-5 ${
                      notification.read ? 'text-gray-600' : 'text-blue-600'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-semibold ${
                      notification.read ? 'text-gray-900' : 'text-blue-900'
                    }`}
                  >
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 mt-1.5" />
                  )}
                </div>

                <p
                  className={`text-sm mt-1 ${
                    notification.read ? 'text-gray-600' : 'text-blue-700'
                  }`}
                >
                  {notification.message}
                </p>

                {notification.userMedia?.name && (
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Video: {notification.userMedia.name}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
