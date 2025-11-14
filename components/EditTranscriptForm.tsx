'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UserMedia, UserMediaTranscript } from '@prisma/client';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAppForm } from '@/components/form/hooks';
import {
  FieldGroup,
  FieldSet,
  FieldContent,
  FieldLegend,
  FieldDescription,
} from '@/components/ui/field';
import { SelectItem } from '@/components/ui/select';
import {
  videoEditSchema,
  VISIBILITY_OPTIONS,
  VideoEditFormData,
} from '@/schemas/video';

interface VideoTranscriptDialogProps {
  video: UserMedia & {
    transcripts: UserMediaTranscript[];
  };
  optimisticPosterUrl?: string | null;
}

export default function VideoTranscriptDialog({
  video,
  optimisticPosterUrl,
}: VideoTranscriptDialogProps) {
  const router = useRouter();
  const latestTranscript = video.transcripts[0];

  // Optimistic UI
  const [optimisticName, setOptimisticName] = useState(video.name || '');
  const [optimisticDescription, setOptimisticDescription] = useState(
    video.description || ''
  );

  // Dialog open state
  const [open, setOpen] = useState(false);

  // Confirmation dialog for final save
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<VideoEditFormData | null>(null);

  // Check if transcript has been finalized (no SRT timestamps = already saved)
  const isTranscriptFinalized = !latestTranscript?.text?.includes('-->');

  // Speaker identification
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [speakerNames, setSpeakerNames] = useState<Record<string, string>>({});
  const [loadingSRT, setLoadingSRT] = useState(false);
  const [srtContent, setSrtContent] = useState<string>(''); // Original SRT with timestamps
  const [cleanedContent, setCleanedContent] = useState<string>(''); // Cleaned version for display
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Shared function to parse SRT format: strip timestamps/numbers and remove repetitive speaker names
  const parseSRT = (srtText: string): string => {
    // Split by double newlines (separates SRT blocks)
    const blocks = srtText.split(/\n\n+/);
    const dialogueLines: string[] = [];
    let lastSpeaker: string | null = null;

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      // SRT format: line 1 = number, line 2 = timestamp, line 3+ = dialogue
      if (lines.length >= 3) {
        // Take everything after the timestamp (line 2+)
        const dialogue = lines.slice(2).join('\n').trim();
        if (dialogue) {
          // Extract speaker from dialogue
          const speakerMatch = dialogue.match(/^\[([^\]]+)\]/);
          const currentSpeaker = speakerMatch ? speakerMatch[1] : null;

          if (currentSpeaker === lastSpeaker) {
            // Same speaker - strip the speaker tag
            const textWithoutSpeaker = dialogue.replace(/^\[([^\]]+)\]\s*/, '');
            dialogueLines.push(textWithoutSpeaker);
          } else {
            // Different speaker - keep the speaker tag
            dialogueLines.push(dialogue);
            lastSpeaker = currentSpeaker;
          }
        }
      }
    }

    return dialogueLines.join('\n\n');
  };

  // Load transcript content - Fetch fresh from server to get latest saved version
  const loadTranscriptContent = async () => {
    setLoadingSRT(true);
    try {
      console.log('[LOAD] Fetching fresh transcript from server for video:', video.id);

      // Fetch the latest video data to get the most recent transcript
      const response = await fetch(`/api/videos/${video.id}`);
      if (!response.ok) {
        console.error('[LOAD] Failed to fetch video data');
        setLoadingSRT(false);
        return;
      }

      const videoData = await response.json();
      const transcriptText = videoData.transcript?.text;

      console.log('[LOAD] Fetched transcript length:', transcriptText?.length);
      console.log('[LOAD] First 300 chars:', transcriptText?.substring(0, 300));

      if (!transcriptText) {
        console.log('[LOAD] No transcript text found');
        setLoadingSRT(false);
        return;
      }

      const cleanedText = parseSRT(transcriptText);

      console.log('[PARSE] Original SRT length:', transcriptText.length);
      console.log('[PARSE] Cleaned text length:', cleanedText.length);
      console.log('[PARSE] First 500 chars of cleaned:', cleanedText.substring(0, 500));

      setSrtContent(transcriptText); // Keep original SRT for reference
      setCleanedContent(cleanedText); // Set cleaned version for textarea
      form.setFieldValue('transcript', cleanedText); // Show cleaned version in textarea

      // Extract ALL speaker patterns in brackets [SPEAKER_XX] or [anything]
      const speakerMatches = transcriptText.match(/\[([^\]]+)\]/g) || [];
      const uniqueSpeakers = [...new Set<string>(speakerMatches)].map((s) =>
        s.replace(/[\[\]]/g, '')
      );

      setSpeakers(uniqueSpeakers);

      // Load saved speaker mappings from database
      const savedMappings = latestTranscript.speakerMappings as Record<
        string,
        string
      > | null;
      const initialNames: Record<string, string> = {};

      // For each detected speaker, use saved mapping if exists, otherwise use speaker ID
      uniqueSpeakers.forEach((speaker) => {
        initialNames[speaker] = savedMappings?.[speaker] || speaker;
      });

      setSpeakerNames(initialNames);
    } catch (error) {
      console.error('Failed to load transcript:', error);
      toast.error('Failed to load transcript');
    } finally {
      setLoadingSRT(false);
    }
  };

  // Optimistically update speaker name and replace in transcript
  const updateSpeakerName = (speakerId: string, newName: string) => {
    // Get the OLD name to replace FROM
    const oldName = speakerNames[speakerId] || speakerId;

    // Update local state immediately (optimistic)
    setSpeakerNames((prev) => ({
      ...prev,
      [speakerId]: newName,
    }));

    // Replace all instances of [oldName] with [newName] (or back to [speakerId] if empty)
    const targetName = newName.trim() || speakerId;
    const regex = new RegExp(`\\[${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g');
    const updatedTranscript = srtContent.replace(regex, `[${targetName}]`);
    setSrtContent(updatedTranscript);

    // Parse the updated SRT to show clean version
    const cleanedText = parseSRT(updatedTranscript);
    setCleanedContent(cleanedText);
    form.setFieldValue('transcript', cleanedText);

    if (textareaRef.current) {
      textareaRef.current.value = cleanedText;
    }
  };

  // Re-analyze speakers using AI
  const [reanalyzing, setReanalyzing] = useState(false);
  const reanalyzeSpeakers = async () => {
    console.log('[UI] Starting speaker re-analysis...');
    console.log('[UI] Current transcript length:', srtContent.length);
    console.log('[UI] Speaker mappings:', speakerNames);

    setReanalyzing(true);
    try {
      console.log('[UI] Sending request to API...');
      const response = await fetch(`/api/videos/${video.id}/reanalyze-speakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: srtContent,
          speakerMappings: speakerNames,
        }),
      });

      console.log('[UI] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[UI] API error:', errorData);
        throw new Error(errorData.error || 'Failed to re-analyze speakers');
      }

      const data = await response.json();
      console.log('[UI] Response data received');
      const correctedTranscript = data.correctedTranscript;
      console.log('[UI] Corrected transcript length:', correctedTranscript?.length);
      console.log('[UI] First 200 chars of corrected:', correctedTranscript?.substring(0, 200));

      // Force update - set both state AND directly update textarea DOM
      const newTranscript = String(correctedTranscript);
      console.log('[UI] Setting srtContent state to:', newTranscript.substring(0, 100));
      setSrtContent(newTranscript);

      // Parse the updated SRT to show clean version
      const cleanedText = parseSRT(newTranscript);
      setCleanedContent(cleanedText);
      form.setFieldValue('transcript', cleanedText);

      // Also directly update the textarea DOM as a fallback
      if (textareaRef.current) {
        textareaRef.current.value = cleanedText;
        console.log('[UI] Directly set textarea.value');
      }

      // Re-extract speakers
      const speakerMatches = correctedTranscript.match(/\[([^\]]+)\]/g) || [];
      const uniqueSpeakers = [...new Set<string>(speakerMatches)].map((s) =>
        s.replace(/[\[\]]/g, '')
      );
      console.log('[UI] Re-extracted speakers:', uniqueSpeakers);
      setSpeakers(uniqueSpeakers);

      toast.success('Speaker tags re-analyzed successfully!');
    } catch (error) {
      console.error('[UI] Failed to re-analyze speakers:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to re-analyze speakers');
    } finally {
      setReanalyzing(false);
      console.log('[UI] Re-analysis complete');
    }
  };

  useEffect(() => {
    if (open) {
      loadTranscriptContent();
    }
  }, [open]);

  // Actual save function
  const saveChanges = async (value: VideoEditFormData) => {
    // Optimistic UI
    setOptimisticName(value.name);
    setOptimisticDescription(value.description || '');

    try {
      // Save the cleaned transcript as-is (no SRT reconstruction)
      // This is the final version and won't be editable again

      // Single PATCH request for everything
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: value.name,
          description: value.description,
          transcript: value.transcript, // Send cleaned transcript
          visibility: value.visibility,
          speakerMappings: speakerNames, // Save speaker mappings
        }),
      });

      if (!res.ok) throw new Error('Failed to update video');

      toast.success('Video updated successfully!');
      setOpen(false); // close dialog
      setShowConfirmDialog(false); // close confirmation dialog

      // Refresh the page data so next time dialog opens it has fresh data
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save changes');

      // Revert optimistic UI
      setOptimisticName(video.name || '');
      setOptimisticDescription(video.description || '');
    }
  };

  const form = useAppForm({
    defaultValues: {
      name: video.name || '',
      description: video.description || '',
      visibility: video.visibility || 'PRIVATE',
      transcript: latestTranscript?.text || '',
    } satisfies VideoEditFormData as VideoEditFormData,
    validators: {
      onSubmit: videoEditSchema,
    },
    onSubmit: async ({ value }) => {
      // If transcript not finalized yet, show confirmation dialog first
      if (!isTranscriptFinalized) {
        setPendingFormData(value);
        setShowConfirmDialog(true);
        return;
      }

      // If already finalized, just save visibility
      await saveChanges(value);
    },
  });

  // Update form when video data changes
  useEffect(() => {
    form.setFieldValue('name', video.name || '');
    form.setFieldValue('description', video.description || '');
    form.setFieldValue('visibility', video.visibility || 'PRIVATE');
    // Don't set transcript here - it's loaded and parsed in loadTranscriptContent()
    setOptimisticName(video.name || '');
    setOptimisticDescription(video.description || '');
  }, [video]);

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="space-y-4">
      {/* Display name & description above video */}
      <div className="mb-2">
        <h2 className="text-xl font-bold">{optimisticName}</h2>
        {optimisticDescription && (
          <p className="text-gray-600">{optimisticDescription}</p>
        )}
      </div>

      {/* Video player */}
      {video.url ? (
        <video
          key={optimisticPosterUrl || video.posterUrl || 'no-poster'}
          controls
          className="w-full rounded-md border border-gray-300"
          src={video.url}
          poster={optimisticPosterUrl || video.posterUrl || undefined}
        />
      ) : (
        <p>Video Still Processing</p>
      )}

      {/* If transcript finalized, show visibility selector instead of edit button */}
      {isTranscriptFinalized ? (
        <div className="flex items-center gap-3">
          <Label htmlFor="visibility-select">Visibility:</Label>
          <Select
            value={video.visibility || 'PRIVATE'}
            onValueChange={async (value) => {
              try {
                const res = await fetch(`/api/videos/${video.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ visibility: value }),
                });
                if (!res.ok) throw new Error('Failed to update visibility');
                toast.success('Visibility updated!');
                router.refresh();
              } catch (err) {
                toast.error('Failed to update visibility');
              }
            }}
          >
            <SelectTrigger id="visibility-select" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>
          {/* Edit dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Edit Video Details</Button>
            </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name="name">
                {(field) => <field.Input label="Video Name" />}
              </form.AppField>

              <form.AppField name="description">
                {(field) => (
                  <field.Textarea
                    label="Description / Summary"
                    description="Enter a brief description of your video"
                  />
                )}
              </form.AppField>

              <form.AppField name="visibility">
                {(field) => (
                  <field.Select label="Visibility">
                    {VISIBILITY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0) + option.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </field.Select>
                )}
              </form.AppField>

              {/* Speaker Identification */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-3">Identify Speakers</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Detected {speakers.length} speaker
                  {speakers.length !== 1 ? 's' : ''} in the transcript. You can
                  assign names and add additional speakers if needed.
                </p>
                <div className="space-y-3">
                  {speakers.map((speaker) => {
                    return (
                      <div key={speaker} className="flex items-center gap-3">
                        <Label className="w-32 text-sm font-medium text-gray-500">
                          {speaker}:
                        </Label>
                        <Input
                          type="text"
                          placeholder="Enter name (e.g., Alice)..."
                          value={speakerNames[speaker] || ''}
                          onChange={(e) =>
                            updateSpeakerName(speaker, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newSpeakers = speakers.filter(
                              (s) => s !== speaker
                            );
                            setSpeakers(newSpeakers);
                            const newNames = { ...speakerNames };
                            delete newNames[speaker];
                            setSpeakerNames(newNames);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextNumber = speakers.length;
                      const newSpeakerId = `SPEAKER_${String(nextNumber).padStart(2, '0')}`;
                      setSpeakers([...speakers, newSpeakerId]);
                      setSpeakerNames({ ...speakerNames, [newSpeakerId]: '' });
                    }}
                  >
                    + Add Speaker
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={reanalyzeSpeakers}
                    disabled={reanalyzing || speakers.length < 2}
                  >
                    {reanalyzing ? 'Re-analyzing...' : 'Re-analyze Speakers with AI'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  First, manually fix the first few speaker tags in the transcript below, then click "Re-analyze" to automatically fix the rest.
                </p>
              </div>

              {/* Transcript Editor */}
              <div className="space-y-2">
                <Label>Transcript (SRT Format)</Label>
                <p className="text-sm text-gray-600">
                  Edit the video transcript. You can manually change speaker tags
                  in the transcript (e.g., change [SPEAKER_00] to [SPEAKER_01]).
                </p>

                {!latestTranscript ? (
                  <div className="p-4 border border-yellow-300 rounded-md bg-yellow-50">
                    <p>No transcript available for this video.</p>
                  </div>
                ) : loadingSRT ? (
                  <div className="p-4 text-center border border-gray-300 rounded-md bg-gray-50">
                    <p>Loading transcript...</p>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    value={cleanedContent}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      setCleanedContent(newContent);
                      form.setFieldValue('transcript', newContent);

                      // Re-extract speakers when content changes
                      const speakerMatches =
                        newContent.match(/\[([^\]]+)\]/g) || [];
                      const uniqueSpeakers = [...new Set(speakerMatches)].map(
                        (s) => s.replace(/[\[\]]/g, '')
                      );
                      setSpeakers(uniqueSpeakers);
                    }}
                    rows={20}
                    className="w-full p-3 border border-gray-300 rounded-md font-mono text-sm resize-y"
                    placeholder="Transcript will load here..."
                  />
                )}
              </div>
            </FieldGroup>

            <DialogFooter className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="secondary" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalize Transcript?</AlertDialogTitle>
            <AlertDialogDescription>
              Once you save, the transcript will be finalized and cannot be edited again.
              Only the visibility setting will be changeable after this point.
              <br /><br />
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setPendingFormData(null);
              setShowConfirmDialog(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (pendingFormData) {
                saveChanges(pendingFormData);
              }
            }}>
              Yes, Save and Finalize
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </>
      )}
    </div>
  );
}
