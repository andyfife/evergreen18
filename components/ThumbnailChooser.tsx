'use client';

import { useRef, useState } from 'react';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { qk } from '@/lib/queryKeys';
import type { Video } from '@/lib/video';

type Props = {
  videoUrl: string;
  videoAssetId: string;
  userId: string;
  getToken: () => Promise<string | null>;
  onClose: () => void;
  onSaved?: (thumbUrl: string) => void;
  invalidateQuery?: (queryKey: QueryKey) => void;
};

export default function ThumbnailChooser({
  videoUrl,
  videoAssetId,
  userId,
  getToken,
  onClose,
  onSaved,
  invalidateQuery,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const queryClient = useQueryClient();

  async function uploadThumbBlob(blob: Blob) {
    const token = await getToken();
    if (!token) {
      toast.error('Not authenticated');
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error('Please enter a video name');
      return;
    }

    console.log('Preparing thumbnail upload:', {
      videoAssetId,
      name: trimmedName,
      description: trimmedDescription,
    });

    // Optimistic update
    const queryKey = qk.videos(userId);
    const prevVideos = queryClient.getQueryData<Video[]>(queryKey);
    const tempThumbUrl = URL.createObjectURL(blob); // Temporary URL for optimistic update
    queryClient.setQueryData<Video[]>(queryKey, (list) =>
      (list ?? []).map((v) =>
        v.id === videoAssetId
          ? {
              ...v,
              thumbnailUrl: tempThumbUrl,
              name: trimmedName,
              description: trimmedDescription,
            }
          : v
      )
    );

    const fd = new FormData();
    fd.append('file', blob, 'thumbnail.jpg');
    fd.append('thumbnailFor', videoAssetId);
    fd.append('name', trimmedName);
    fd.append('description', trimmedDescription);

    console.log('FormData contents:', {
      thumbnailFor: fd.get('thumbnailFor'),
      name: fd.get('name'),
      description: fd.get('description'),
    });

    let res: Response;
    try {
      res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
    } catch {
      queryClient.setQueryData(queryKey, prevVideos); // Revert on error
      toast.error('Network error uploading thumbnail');
      return;
    }

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      queryClient.setQueryData(queryKey, prevVideos); // Revert on error
      toast.error('Failed to parse API response');
      return;
    }

    if (!res.ok) {
      console.error('Thumbnail upload failed:', data);
      queryClient.setQueryData(queryKey, prevVideos); // Revert on error
      toast.error(data?.message || 'Failed to upload thumbnail');
      return;
    }

    console.log('Thumbnail upload response:', data);

    const thumbUrl: string | undefined = data?.updatedAsset?.thumbnailUrl;
    const estIdFromApi: string | undefined =
      data?.updatedAsset?.establishmentId;
    const savedName: string | undefined = data?.updatedAsset?.name;
    const savedDescription: string | undefined =
      data?.updatedAsset?.description;

    // Update cache with server data
    if (estIdFromApi && thumbUrl) {
      queryClient.setQueryData<Video[]>(queryKey, (list) =>
        (list ?? []).map((v) =>
          v.id === videoAssetId
            ? {
                ...v,
                thumbnailUrl: thumbUrl,
                name: savedName ?? trimmedName,
                description: savedDescription ?? trimmedDescription,
              }
            : v
        )
      );
    }

    if (estIdFromApi) {
      console.log('Dispatching thumbnailUpdated:', {
        establishmentId: estIdFromApi,
        videoAssetId,
      });
      window.dispatchEvent(
        new CustomEvent('thumbnailUpdated', {
          detail: { establishmentId: estIdFromApi, videoAssetId },
        })
      );
    }

    if (invalidateQuery && estIdFromApi) {
      console.log('Invalidating query in ThumbnailChooser:', queryKey);
      invalidateQuery(queryKey);
    }

    if (thumbUrl) {
      onSaved?.(thumbUrl);
      toast.success(
        `Thumbnail saved! Name: ${savedName || 'Untitled'}, Description: ${
          savedDescription || 'None'
        }`
      );
    } else {
      queryClient.setQueryData(queryKey, prevVideos); // Revert on error
      toast.error('Thumbnail URL missing in response');
    }
    onClose();
  }

  async function handleCapture() {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState < 2) {
      await new Promise<void>((resolve) => {
        const onLoaded = () => {
          video.removeEventListener('loadeddata', onLoaded);
          resolve();
        };
        video.addEventListener('loadeddata', onLoaded);
      });
    }

    const canvas = document.createElement('canvas');
    const maxW = 1280;
    const scale = Math.min(1, maxW / (video.videoWidth || 1));
    canvas.width = Math.max(1, Math.floor((video.videoWidth || 1) * scale));
    canvas.height = Math.max(1, Math.floor((video.videoHeight || 1) * scale));

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Canvas not available');
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setSaving(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Blob failed'))),
          'image/jpeg',
          0.85
        )
      );
      await uploadThumbBlob(blob);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Capture failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleCustomUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image');
      e.target.value = '';
      return;
    }
    setSaving(true);
    try {
      await uploadThumbBlob(file);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4 rounded-lg bg-gray-800 text-white">
      <h3 className="text-lg font-semibold mb-3">Choose a Thumbnail</h3>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="name" className="text-sm text-gray-300">
            Video Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter video name"
            disabled={saving}
            className="bg-gray-700 text-white border-gray-600"
            required
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-sm text-gray-300">
            Description
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter video description"
            disabled={saving}
            className="bg-gray-700 text-white border-gray-600"
          />
        </div>
      </div>

      <div className=" space-y-3 mb-6">
        <div className="flex justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            className="max-w-lg w-full max-h-[60vh] rounded-md bg-black object-contain"
            controls
            playsInline
            crossOrigin="anonymous"
          />
        </div>
        <p className="text-sm text-gray-300">
          Pause on a frame and click “Use current frame”.
        </p>
        <Button
          onClick={handleCapture}
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {saving ? 'Saving…' : 'Upload'}
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-300">Or upload a custom image:</p>
        <Input
          type="file"
          accept="image/*"
          onChange={handleCustomUpload}
          disabled={saving}
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button variant="ghost" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
