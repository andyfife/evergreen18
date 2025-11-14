// components/VideoMetaDialog.tsx
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// ⬅️ ADDED: import the transcript dialog
import VideoTranscriptDialog from './VideoTranscriptDialog';

export type Visibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC';
export type ModerationStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED';

export type VideoMeta = {
  name: string;
  description: string;
  visibility: Visibility;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<VideoMeta>;
  onSubmit: (meta: VideoMeta) => Promise<void> | void;
  submitting?: boolean;
  mode?: 'create' | 'edit';
  /** pass the asset’s moderation status here */
  moderationStatus?: ModerationStatus;

  // ⬅️ ADDED: you need the media id to fetch its transcript
  mediaId?: string;
};

export default function VideoMetaDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting,
  mode = 'create',
  moderationStatus = 'PENDING',
  mediaId, // ⬅️ ADDED
}: Props) {
  const isApproved = moderationStatus === 'APPROVED';

  const [name, setName] = React.useState(initial?.name ?? '');
  const [description, setDescription] = React.useState(
    initial?.description ?? ''
  );
  const [visibility, setVisibility] = React.useState<Visibility>(() => {
    const init = (initial?.visibility as Visibility) ?? 'PRIVATE';
    return isApproved ? init : 'PRIVATE';
  });

  // ⬅️ ADDED: local state to open the transcript dialog
  const [openTranscript, setOpenTranscript] = React.useState(false);

  // Reset fields when dialog opens or approval status changes
  React.useEffect(() => {
    if (!open) return;
    const initVis = (initial?.visibility as Visibility) ?? 'PRIVATE';
    setName(initial?.name ?? '');
    setDescription(initial?.description ?? '');
    setVisibility(isApproved ? initVis : 'PRIVATE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isApproved]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      // ✅ Always PRIVATE unless approved
      visibility: isApproved ? visibility : 'PRIVATE',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-lg bg-gray-900 border border-gray-700 text-gray-100">
          <h3 className="text-lg font-semibold">
            {mode === 'create' ? 'Describe your video' : 'Edit video details'}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Add a title and description. Visibility is available after approval.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm">Title</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., A Night to Remember"
                required
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers what this video is about…"
                rows={4}
                className="bg-gray-800 border-gray-700 text-gray-100"
              />
              {/* ⬅️ ADDED: View transcript button (only if we have a mediaId) */}
              {mediaId && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpenTranscript(true)}
                    className="bg-gray-800 border border-gray-700 text-gray-100 hover:bg-gray-700"
                  >
                    View transcript
                  </Button>
                </div>
              )}
            </div>

            {/* ✅ Only show the visibility select WHEN APPROVED */}
            {isApproved ? (
              <div className="space-y-2">
                <label className="text-sm">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2"
                >
                  <option value="PRIVATE">Private</option>
                  <option value="FRIENDS">Friends</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Sharing options options are available after this video is
                approved.
                {moderationStatus === 'REJECTED' && (
                  <div className="mt-1 text-red-400">
                    This video was rejected and cannot be shared.
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-gray-300"
                disabled={!!submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!!submitting}
              >
                {submitting ? 'Saving…' : mode === 'create' ? 'Upload' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ⬅️ ADDED: mount the transcript dialog next to this one */}
      {mediaId && (
        <VideoTranscriptDialog
          mediaId={mediaId}
          open={openTranscript}
          onOpenChange={setOpenTranscript}
          // Optional: if you have a <video> elsewhere, pass a seek handler here
          // onSeek={(t) => {/* playerRef.current.currentTime = t; */}}
        />
      )}
    </>
  );
}
