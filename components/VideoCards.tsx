// components/VideoCards.tsx
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import VideoMetaDialog, {
  ModerationStatus,
  VideoMeta,
  Visibility,
} from './VideoMetaDialog';
import {
  Pencil,
  Trash2,
  Play,
  Shield,
  Users,
  Globe,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
} from 'lucide-react';
import type { Video } from '@/types/video';

function VisibilityBadge({ value }: { value: Visibility }) {
  const map: Record<
    Visibility,
    { label: string; className: string; Icon: any }
  > = {
    PRIVATE: {
      label: 'Private',
      className: 'bg-zinc-800 text-zinc-200',
      Icon: Shield,
    },
    FRIENDS: {
      label: 'Friends',
      className: 'bg-blue-900/60 text-blue-300',
      Icon: Users,
    },
    PUBLIC: {
      label: 'Public',
      className: 'bg-emerald-900/60 text-emerald-300',
      Icon: Globe,
    },
  };
  const { label, className, Icon } = map[value];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${className}`}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}

function TranscriptBadge({ transcript }: { transcript: Video['transcript'] }) {
  if (!transcript) {
    return (
      <span className="inline-flex items-center rounded px-1.5 py-0.5 border bg-gray-800 text-gray-400 border-gray-600 text-xs">
        No transcript
      </span>
    );
  }

  const { status, srtUrl } = transcript;

  const badge = (() => {
    switch (status) {
      case 'QUEUED':
        return {
          label: 'Queued',
          className: 'bg-gray-800 text-gray-300',
          Icon: Loader2,
        };
      case 'PROCESSING':
        return {
          label: 'Transcribing…',
          className: 'bg-amber-900/60 text-amber-300',
          Icon: Loader2,
        };
      case 'COMPLETED':
        return {
          label: 'Ready',
          className: 'bg-emerald-900/60 text-emerald-300',
          Icon: Download,
        };
      case 'FAILED':
        return {
          label: 'Failed',
          className: 'bg-red-900/60 text-red-300',
          Icon: null,
        };
      default:
        return {
          label: status,
          className: 'bg-gray-800 text-gray-400',
          Icon: null,
        };
    }
  })();

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] ${badge.className}`}
      >
        {badge.Icon && (
          <badge.Icon
            size={13}
            className={status === 'PROCESSING' ? 'animate-spin' : ''}
          />
        )}
        {badge.label}
      </span>
      {status === 'COMPLETED' && srtUrl && (
        <a
          href={srtUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
          title="Download .srt"
        >
          <Download size={14} />
        </a>
      )}
    </div>
  );
}

export default function VideoCards({ videos }: { videos: Video[] }) {
  const router = useRouter();
  const [playerId, setPlayerId] = React.useState<string | null>(null);
  const [edit, setEdit] = React.useState<{
    open: boolean;
    video: Video | null;
  }>({ open: false, video: null });
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleRefresh = () => router.refresh();
    window.addEventListener('videoUploaded', handleRefresh);
    window.addEventListener('thumbnailUpdated', handleRefresh);
    return () => {
      window.removeEventListener('videoUploaded', handleRefresh);
      window.removeEventListener('thumbnailUpdated', handleRefresh);
    };
  }, [router]);

  const doDelete = async (video: Video) => {
    if (!video.url) {
      toast.error('No uploaded file to delete');
      return;
    }
    if (!confirm('Delete this video? This cannot be undone.')) return;

    try {
      setDeletingId(video.id);
      const res = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: video.id, url: video.url }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to delete video');
      toast.success('Video deleted');
      router.refresh();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete video'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const doEdit = async (meta: VideoMeta) => {
    if (!edit.video) return;
    const isApproved = edit.video.approvalStatus === 'APPROVED';
    const payload: Record<string, any> = {
      name: meta.name,
      description: meta.description,
    };
    if (isApproved) payload.visibility = meta.visibility;
    else if (
      meta.visibility &&
      meta.visibility !== (edit.video.visibility ?? 'PRIVATE')
    ) {
      toast.error('Sharing options unlock after admin approval.');
    }

    const res = await fetch(`/api/user-media/${edit.video.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success('Saved');
      setEdit({ open: false, video: null });
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data?.message || 'Failed to save');
    }
  };

  if (!videos?.length)
    return <p className="text-gray-400">No videos uploaded yet.</p>;

  return (
    <>
      <div className="space-y-6">
        {videos.map((v) => {
          const vis = (v.visibility as Visibility) || 'PRIVATE';
          const isExpanded = expanded.includes(v.id);
          const displayDescription = v.description || 'No description';
          const approved = v.approvalStatus === 'APPROVED';

          return (
            <Card
              key={v.id}
              className="w-full overflow-hidden rounded-2xl border border-gray-700/60 bg-gray-900/70 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.35)] transition-shadow"
            >
              <button
                onClick={() => v.url && setPlayerId(v.id)}
                className="relative w-full aspect-video overflow-hidden"
                aria-label="Play video"
                disabled={!v.url}
              >
                <img
                  src={v.thumbnailUrl || '/images/flower.png'}
                  alt={v.name || 'Video thumbnail'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg ring-1 ring-black/10">
                    <Play size={22} className="translate-x-px" />
                  </div>
                </div>
                <div className="absolute left-3 top-3">
                  <VisibilityBadge value={vis} />
                </div>
              </button>

              <CardContent className="p-4">
                <div className="mb-2 space-y-1">
                  <div className="text-md font-semibold text-gray-100 truncate">
                    {v.name || 'Untitled video'}
                  </div>
                  <div className="text-xs">
                    {approved ? (
                      <span className="inline-flex items-center rounded px-1.5 py-0.5 border bg-emerald-100 text-emerald-700 border-emerald-300">
                        Admin Approved — sharing unlocked
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center rounded px-1.5 py-0.5 border bg-amber-100 text-amber-700 border-amber-300"
                        title="You can edit name/description now. PUBLIC/FRIENDS remain locked until admin approves."
                      >
                        Waiting for Admin — sharing locked
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <TranscriptBadge transcript={v.transcript} />
                  </div>
                  <div
                    className={`text-sm text-gray-400 transition-all duration-300 ${
                      isExpanded
                        ? 'max-h-[200px] overflow-y-auto'
                        : 'line-clamp-2'
                    }`}
                  >
                    {displayDescription}
                  </div>
                </div>

                {v.description && (
                  <Button
                    variant="link"
                    className="text-blue-400 text-xs p-0 h-auto"
                    onClick={() =>
                      setExpanded((prev) =>
                        isExpanded
                          ? prev.filter((id) => id !== v.id)
                          : [...prev, v.id]
                      )
                    }
                  >
                    {isExpanded ? 'Less' : 'More'}
                    {isExpanded ? (
                      <ChevronUp size={14} className="ml-1" />
                    ) : (
                      <ChevronDown size={14} className="ml-1" />
                    )}
                  </Button>
                )}

                <div className="flex items-center justify-between gap-2 mt-3">
                  <Button
                    variant="secondary"
                    className="bg-gray-800 border border-gray-700 text-gray-100 hover:bg-gray-700"
                    onClick={() => setEdit({ open: true, video: v })}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Pencil size={14} /> {approved ? 'Share / Edit' : 'Edit'}
                    </span>
                  </Button>
                  <button
                    onClick={() => doDelete(v)}
                    className="p-2 rounded hover:bg-gray-800 text-gray-600 disabled:opacity-50 border border-transparent"
                    disabled={deletingId === v.id || !v.url}
                  >
                    {deletingId === v.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!playerId} onOpenChange={(o) => !o && setPlayerId(null)}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-4xl overflow-hidden p-0 bg-gray-900 border border-gray-700">
          {playerId && videos.find((x) => x.id === playerId)?.url && (
            <video
              key={playerId}
              src={videos.find((x) => x.id === playerId)!.url}
              poster={
                videos.find((x) => x.id === playerId)!.thumbnailUrl || undefined
              }
              controls
              autoPlay
              className="w-full h-full"
            />
          )}
        </DialogContent>
      </Dialog>

      <VideoMetaDialog
        open={edit.open}
        onOpenChange={(o) => setEdit({ open: o, video: o ? edit.video : null })}
        mode="edit"
        initial={{
          name: edit.video?.name || '',
          description: edit.video?.description || '',
          visibility: (edit.video?.visibility as Visibility) || 'PRIVATE',
        }}
        moderationStatus={
          edit.video?.moderationStatus as ModerationStatus | undefined
        }
        lockVisibility={edit.video?.approvalStatus !== 'APPROVED'}
        onSubmit={doEdit}
      />
    </>
  );
}
