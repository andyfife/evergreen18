'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface MediaAsset {
  id: string;
  url: string;
  isPrimaryImage: boolean | null;
  type?: string; // 'USER_IMAGE' | 'USER_VIDEO' | undefined
}

interface ImageSelectorProps {
  primaryImage: MediaAsset | null;
  mediaAssets: MediaAsset[];
  username: string;
  userId: string; // still passed in from server for events/query keys
}

function looksLikeImage(url?: string | null) {
  const u = (url ?? '').toLowerCase();
  return (
    u.endsWith('.jpg') ||
    u.endsWith('.jpeg') ||
    u.endsWith('.png') ||
    u.endsWith('.webp')
  );
}

export default function ImageSelector({
  primaryImage: initialPrimaryImage,
  mediaAssets: initialMediaAssets,
  username,
  userId,
}: ImageSelectorProps) {
  const { getToken } = useAuth();

  const [currentImage, setCurrentImage] = useState<MediaAsset | null>(
    initialPrimaryImage ?? initialMediaAssets[0] ?? null
  );
  const [localMediaAssets, setLocalMediaAssets] =
    useState<MediaAsset[]>(initialMediaAssets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // ✅ Keep only images. Prefer enum check; fall back to extension.
  const filterImageAssets = useCallback((assets: MediaAsset[]) => {
    return assets.filter(
      (a) => a.type === 'USER_IMAGE' || (!a.type && looksLikeImage(a.url))
    );
  }, []);

  // ✅ Fetch the current user's media (no userId param; auth() on the server decides)
  const fetchMediaAssets = useCallback(async () => {
    try {
      const token = await getToken(); // optional — your route uses cookies via Clerk; harmless to include
      const res = await fetch('/api/user-media', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to fetch media');

      const data: MediaAsset[] = await res.json();
      const imagesOnly = filterImageAssets(data);

      setLocalMediaAssets(imagesOnly);

      const newPrimary =
        imagesOnly.find((asset) => asset.isPrimaryImage === true) ||
        imagesOnly[0] ||
        null;

      setCurrentImage(newPrimary);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch media');
    }
  }, [getToken, filterImageAssets]);

  useEffect(() => {
    fetchMediaAssets();
  }, [fetchMediaAssets]);

  // Refresh when uploads happen (your uploader dispatches { detail: { userId } })
  useEffect(() => {
    const handleImageUploaded = (event: CustomEvent) => {
      const evtUserId = (event.detail as any)?.userId as string | undefined;
      if (!evtUserId || evtUserId === userId) {
        fetchMediaAssets();
      }
    };
    window.addEventListener(
      'imageUploaded',
      handleImageUploaded as EventListener
    );
    return () =>
      window.removeEventListener(
        'imageUploaded',
        handleImageUploaded as EventListener
      );
  }, [userId, fetchMediaAssets]);

  const thumbnails = (
    currentImage
      ? localMediaAssets.filter((a) => a.id !== currentImage.id)
      : localMediaAssets
  ).slice(0, 4);

  // ✅ Set primary via UserMedia API
  const updatePrimaryImage = async (imageId: string) => {
    try {
      setIsDialogOpen(false); // close instantly

      const token = await getToken();
      const res = await fetch(`/api/user-media/${imageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ setPrimary: true }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Set primary failed:', res.status, text);
        throw new Error(`HTTP ${res.status}`);
      }

      await fetchMediaAssets(); // refresh in background
      toast.success('Image set as primary!');
    } catch (e) {
      toast.error('Could not set primary image');
    }
  };

  // ✅ Delete via UserMedia API
  const deleteImage = async (imageId: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`/api/user-media/${imageId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchMediaAssets();
      setIsDialogOpen(false);
      toast.success('Image deleted');
    } catch {
      toast.error('Could not delete image');
    }
  };

  return (
    <div>
      {/* Large Primary Image */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-xl border border-gray-600 rounded-lg shadow-md">
          <Image
            src={currentImage?.url || '/images/flower.png'}
            alt={`Banner for ${username}`}
            width={600}
            height={300}
            className="rounded-lg cursor-pointer object-cover w-full h-auto"
            onClick={() => currentImage && setIsDialogOpen(true)}
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap mt-6 justify-center gap-4">
        {thumbnails.length > 0 ? (
          thumbnails.map((asset) => (
            <div
              key={asset.id}
              className="relative w-[100px] h-[100px] border border-gray-600 rounded-md overflow-hidden"
              onClick={() => {
                setCurrentImage(asset);
                setIsDialogOpen(true);
              }}
            >
              <Image
                src={asset.url}
                alt="Thumbnail"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
          ))
        ) : (
          <p className="text-white">
            Click the Upload Images Button to select more images...
          </p>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg p-6">
          <DialogTitle>Image Preview</DialogTitle>
          <div className="flex flex-col items-center">
            <Image
              src={currentImage?.url || '/images/flower.png'}
              alt="Selected Image"
              width={400}
              height={400}
              className="rounded-md"
            />
            {currentImage && currentImage.isPrimaryImage !== true && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePrimaryImage(currentImage.id);
                }}
                className="mt-4 w-full"
              >
                <Button type="submit" className="w-full">
                  Set as Primary
                </Button>
              </form>
            )}

            {currentImage && (
              <Button
                className="mt-4 w-full bg-red-500 text-white"
                onClick={() => deleteImage(currentImage.id)}
              >
                Delete Image
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
