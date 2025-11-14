'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddFriendButtonProps {
  userId: string;
  currentStatus: 'none' | 'pending_sent' | 'pending_received' | 'friends';
  friendshipId?: string;
}

export default function AddFriendButton({
  userId,
  currentStatus,
  friendshipId,
}: AddFriendButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send friend request');
      }

      toast.success('Friend request sent!');
      setStatus('pending_sent');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!friendshipId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendshipId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to accept request');
      }

      toast.success('Friend request accepted!');
      setStatus('friends');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!friendshipId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/friends/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendshipId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reject request');
      }

      toast.success('Friend request declined');
      setStatus('none');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'friends') {
    return (
      <Button variant="secondary" disabled>
        <Check className="h-4 w-4 mr-2" />
        Friends
      </Button>
    );
  }

  if (status === 'pending_sent') {
    return (
      <Button variant="outline" disabled>
        <Clock className="h-4 w-4 mr-2" />
        Request Pending
      </Button>
    );
  }

  if (status === 'pending_received') {
    return (
      <div className="flex gap-2">
        <Button onClick={handleAccept} disabled={loading} size="sm">
          <Check className="h-4 w-4 mr-2" />
          Accept
        </Button>
        <Button
          onClick={handleReject}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <X className="h-4 w-4 mr-2" />
          Decline
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleSendRequest} disabled={loading}>
      <UserPlus className="h-4 w-4 mr-2" />
      Add Friend
    </Button>
  );
}
