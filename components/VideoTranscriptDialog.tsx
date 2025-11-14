import * as React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type Props = {
  mediaId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSeek?: (timeInSeconds: number) => void;
};

type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

type TranscriptData = {
  text: string;
  segments?: TranscriptSegment[];
  language?: string;
  userApproved: boolean;
  status?: 'QUEUED' | 'PROCESSING' | 'FAILED' | 'COMPLETED';
};

export default function VideoTranscriptDialog({
  mediaId,
  open,
  onOpenChange,
  onSeek,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [transcript, setTranscript] = React.useState<TranscriptData | null>(
    null
  );
  const [editMode, setEditMode] = React.useState(false);
  const [editedText, setEditedText] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [approving, setApproving] = React.useState(false);

  React.useEffect(() => {
    if (!open || !mediaId) return;

    const fetchTranscript = async () => {
      setLoading(true);
      try {
        // ✅ corrected path
        const res = await fetch(`/api/user-media/${mediaId}/transcript`);
        if (!res.ok) throw new Error('Failed to fetch transcript');
        const data = await res.json();
        // expect { transcript: {...} } from your route; normalize for this UI
        const t: TranscriptData | null = data?.transcript ?? data ?? null;
        setTranscript(t);
        setEditedText(t?.text || '');
      } catch (err) {
        console.error('Error fetching transcript:', err);
        setTranscript(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [open, mediaId]);

  const handleSave = async () => {
    if (!mediaId || !editedText.trim()) return;
    setSaving(true);
    try {
      // ✅ corrected path
      const res = await fetch(`/api/user-media/${mediaId}/transcript`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editedText.trim() }),
      });
      if (!res.ok) throw new Error('Failed to save transcript');
      // your PUT can return { ok: true } or the updated transcript;
      // refetch to be safe:
      const refetch = await fetch(`/api/user-media/${mediaId}/transcript`);
      const data = await refetch.json();
      const t: TranscriptData | null = data?.transcript ?? data ?? null;
      setTranscript(t);
      setEditMode(false);
    } catch (err) {
      console.error('Error saving transcript:', err);
      alert('Failed to save transcript. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!mediaId) return;
    setApproving(true);
    try {
      // If currently editing, save first
      if (editMode) {
        await handleSave();
      }
      // ✅ this is the call you asked “where does this go?”
      await fetch(`/api/user-media/${mediaId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editedText }), // optional
      });

      // reflect locally
      setTranscript((prev) => (prev ? { ...prev, userApproved: true } : prev));
      onOpenChange(false); // optional: close after submit
    } catch (err) {
      console.error('Error approving transcript:', err);
      alert('Failed to submit for admin review.');
    } finally {
      setApproving(false);
    }
  };

  const handleSegmentClick = (start: number) => {
    if (onSeek) {
      onSeek(start);
      onOpenChange(false);
    }
  };

  const canApprove =
    !!transcript && transcript.status !== 'FAILED' && !transcript.userApproved; // only allow once

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle>Video transcript</DialogTitle>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] bg-gray-900 border border-gray-700 text-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Video Transcript</h3>
          {transcript && !loading && (
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditMode(false);
                      setEditedText(transcript.text || '');
                    }}
                    disabled={saving || approving}
                    className="text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving || approving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  disabled={approving}
                  className="bg-gray-800 border border-gray-700 hover:bg-gray-700"
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : !transcript ? (
          <div className="text-center py-12 text-gray-400">
            <p>No transcript available for this video.</p>
            <p className="text-sm mt-2">
              Transcripts are generated automatically after upload.
            </p>
          </div>
        ) : editMode ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              Edit the transcript below. Your changes will be saved and used for
              the final submission.
            </div>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={16}
              className="bg-gray-800 border-gray-700 text-gray-100 font-mono text-sm"
              placeholder="Enter transcript text..."
            />
            <div className="text-xs text-gray-500">
              {editedText.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {transcript.language && (
              <div className="text-xs text-gray-400 mb-2">
                Language:{' '}
                <span className="text-gray-300">{transcript.language}</span>
              </div>
            )}

            {transcript.segments && transcript.segments.length > 0 ? (
              <div className="space-y-3">
                {transcript.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-800 rounded hover:bg-gray-750 transition-colors cursor-pointer"
                    onClick={() => handleSegmentClick(seg.start)}
                  >
                    <div className="text-xs text-blue-400 mb-1">
                      {formatTime(seg.start)} → {formatTime(seg.end)}
                    </div>
                    <div className="text-sm text-gray-200">{seg.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-800 rounded text-sm leading-relaxed whitespace-pre-wrap">
                {transcript.text}
              </div>
            )}
          </div>
        )}

        {/* status / CTA row */}
        {transcript && !editMode && (
          <div className="mt-4 flex items-center justify-between">
            {!transcript.userApproved ? (
              <div className="text-sm text-yellow-200 bg-yellow-900/20 border border-yellow-700/30 rounded px-3 py-2">
                Please review the transcript before submitting for admin
                approval.
              </div>
            ) : (
              <div className="text-sm text-emerald-200 bg-emerald-900/20 border border-emerald-700/30 rounded px-3 py-2">
                Submitted to admin for review.
              </div>
            )}

            <Button
              onClick={handleApprove}
              disabled={!canApprove || approving || saving}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting…
                </>
              ) : (
                'Approve & Send to Admin'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
