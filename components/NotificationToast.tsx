// components/NotificationToast.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  link?: string | null;
}

export default function NotificationToast() {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_notification' && data.notification) {
        setNotification(data.notification);
        setShow(true);

        // Auto-hide after 10 seconds
        setTimeout(() => setShow(false), 10000);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleClick = async () => {
    if (notification?.link) {
      // Mark as read
      await fetch(`/api/notifications/${notification.id}/read`, {
        method: 'POST',
      });

      router.push(notification.link);
      setShow(false);
    }
  };

  if (!show || !notification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            {notification.link && (
              <button
                onClick={handleClick}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                View now →
              </button>
            )}
          </div>
          <button
            onClick={() => setShow(false)}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
