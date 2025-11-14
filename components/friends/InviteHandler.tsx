'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function InviteHandler() {
  const { isSignedIn, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const processInvite = async () => {
      // Only process if user is signed in, Clerk is loaded, haven't processed yet
      if (!isLoaded || !isSignedIn || hasProcessed) return;

      const inviteToken = searchParams?.get('invite');
      if (!inviteToken) return;

      setHasProcessed(true);

      try {
        const res = await fetch('/api/friends/accept-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: inviteToken }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to accept invite');
        }

        toast.success(data.message || 'You are now friends!');

        // Redirect to friends page after a brief delay
        setTimeout(() => {
          router.push('/user/friends');
        }, 2000);
      } catch (error) {
        console.error('Error accepting invite:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to accept invite');

        // Still redirect to home/dashboard
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    processInvite();
  }, [isLoaded, isSignedIn, searchParams, hasProcessed, router]);

  return null; // This component doesn't render anything
}
