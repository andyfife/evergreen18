// hooks/useVideoStatus.ts
'use client';

import { Video } from '@/lib/video';
import { useEffect, useState } from 'react';

interface VideoStatus {
  media: {
    id: string;
    status: string;
    notes?: string;
  };
  moderation?: {
    id: string;
    state: string;
    progress: number;
    attemptsMade: number;
    failedReason?: string;
  } | null;
  transcription?: {
    id: string;
    state: string;
    progress: number;
    attemptsMade: number;
    failedReason?: string;
  } | null;
  transcript?: {
    id: string;
    text: string;
    status: string;
  } | null;
}

export function useVideoStatus(videoId: string, shouldPoll: boolean = false) {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldPoll) return;

    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/media/${videoId}/status`);

        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }

        const data = await response.json();
        setStatus(data);
        setError(null);

        // Stop polling if video is no longer processing
        const isProcessing =
          data.media.status === 'PENDING' ||
          data.media.status === 'PROCESSING' ||
          data.transcription?.state === 'active' ||
          data.transcription?.state === 'waiting';

        if (!isProcessing && intervalId) {
          clearInterval(intervalId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchStatus();

    // Poll every 3 seconds
    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoId, shouldPoll]);

  return { status, loading, error };
}

// Usage in your UserVideosClient component:
export function VideoCard({ video }: { video: Video }) {
  const shouldPoll = video.isProcessing;
  const { status } = useVideoStatus(video.id, shouldPoll);

  return (
    <div className="video-card">
      <video src={video.url} />

      {/* Show processing status */}
      {video.isProcessing && (
        <div className="processing-badge">
          {status?.moderation?.state === 'active' && (
            <span>🔍 Moderating... {status.moderation.progress}%</span>
          )}
          {status?.transcription?.state === 'active' && (
            <span>📝 Transcribing... {status.transcription.progress}%</span>
          )}
          {status?.transcription?.state === 'waiting' && (
            <span>⏳ Waiting for transcription...</span>
          )}
        </div>
      )}

      {/* Show errors */}
      {video.isFailed && (
        <div className="error-badge">
          ❌ {video.moderationNotes || 'Processing failed'}
        </div>
      )}

      {/* Show ready state */}
      {video.isReady && <div className="ready-badge">✅ Ready to publish</div>}
    </div>
  );
}
