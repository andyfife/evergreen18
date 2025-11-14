// components/VideoMetaDialog.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export type Visibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEW';
export type VideoMeta = {
  name: string;
  description: string;
  visibility: Visibility;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: 'edit' | 'create';
  initial: VideoMeta;
  moderationStatus?: ModerationStatus;
  onSubmit: (meta: VideoMeta) => Promise<void> | void;

  /** 👇 NEW: when true, the visibility selector is disabled */
  lockVisibility?: boolean;
};

export default function VideoMetaDialog({
  open,
  onOpenChange,
  mode,
  initial,
  moderationStatus,
  onSubmit,
  lockVisibility = false, // default
}: Props) {
  const [name, setName] = React.useState(initial.name);
  const [description, setDescription] = React.useState(initial.description);
  const [visibility, setVisibility] = React.useState<Visibility>(
    initial.visibility
  );
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(initial.name);
      setDescription(initial.description);
      setVisibility(initial.visibility);
    }
  }, [open, initial]);

  const submit = async () => {
    setSaving(true);
    try {
      // Even if locked, we still pass the current value up; the caller decides whether to include it.
      await onSubmit({ name, description, visibility });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit video' : 'New video'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Title</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="Video title"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-gray-800 border-gray-700"
              placeholder="Describe your video"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Visibility
            </label>

            {/* Simple segmented control */}
            <div className="inline-flex rounded-md overflow-hidden border border-gray-700">
              {(['PRIVATE', 'FRIENDS', 'PUBLIC'] as Visibility[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  disabled={lockVisibility}
                  onClick={() => setVisibility(v)}
                  className={[
                    'px-3 py-1.5 text-sm',
                    visibility === v
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-gray-300',
                    'hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
                    'border-r border-gray-700 last:border-r-0',
                  ].join(' ')}
                >
                  {v[0] + v.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {lockVisibility && (
              <div className="mt-2 text-xs text-amber-300">
                Sharing options unlock after admin approval.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
