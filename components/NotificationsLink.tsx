// components/NotificationsLink.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsLink() {
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Fetch initial count
    fetchUnreadCount();

    // Setup SSE connection
    const eventSource = new EventSource('/api/notifications/stream');
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'new_notification') {
        // Increment count when new notification arrives
        setUnreadCount((prev) => prev + 1);
      } else if (data.type === 'count_update') {
        setUnreadCount(data.count);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/notifications/unread-count');
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  return (
    <Link
      href="/user/notifications"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary relative"
    >
      <Bell className="h-4 w-4" />
      <span>Notifications</span>
      {unreadCount > 0 && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}
