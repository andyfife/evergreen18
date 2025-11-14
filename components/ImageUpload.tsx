'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export interface MediaAsset {
  id: string;
  url: string;
  isPrimaryImage: boolean | null;
  type?: string | null;
}

interface ImageSelectorProps {
  primaryImage: MediaAsset | null;
  mediaAssets: MediaAsset[];
  username: string;
  userId: string;
}

export default function ImageUpload({
  primaryImage: initialPrimaryImage,
  mediaAssets: initialMediaAssets,
  username,
  userId: userIdProp,
}: ImageSelectorProps) {
  const { userId, getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentImage, setCurrentImage] = useState<MediaAsset | null>(
    initialPrimaryImage ?? initialMediaAssets[0] ?? null
  );
  const [localMediaAssets, setLocalMediaAssets] =
    useState<MediaAsset[]>(initialMediaAssets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const filterImageAssets = useCallback((assets: MediaAsset[]) => {
    return assets.filter(
      (asset) =>
        asset.type === 'VIDEO_POSTER' ||
        asset.type === 'THUMBNAIL_IMAGE' ||
        !asset.type
    );
  }, []);

  const fetchMediaAssets = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Authentication token not found');

      const uid = userId ?? userIdProp;
      const response = await fetch(`/api/mediaAssets?userId=${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch media assets');

      const data: MediaAsset[] = await response.json();
      const imagesOnly = filterImageAssets(data);

      setLocalMediaAssets(imagesOnly);

      const newPrimaryImage =
        imagesOnly.find((asset) => asset.isPrimaryImage === true) ||
        imagesOnly[0] ||
        null;

      setCurrentImage(newPrimaryImage);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch media assets');
    }
  }, [userId, userIdProp, getToken, filterImageAssets]);

  useEffect(() => {
    fetchMediaAssets();
  }, [fetchMediaAssets]);

  useEffect(() => {
    const handleImageUploaded = () => {
      fetchMediaAssets();
    };

    window.addEventListener('imageUploaded', handleImageUploaded);
    return () =>
      window.removeEventListener('imageUploaded', handleImageUploaded);
  }, [fetchMediaAssets]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const formData = new FormData();

      // Upload multiple files
      Array.from(files).forEach((file) => {
        formData.append('file', file); // singular 'file', not 'files'
      });

      formData.append('userId', userId ?? userIdProp);
      formData.append('type', 'USER_IMAGE'); // use USER_IMAGE enum from Prisma // or whatever type you need

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success(`${files.length} image(s) uploaded successfully!`);
        await fetchMediaAssets();

        // Dispatch custom event for other components
        window.dispatchEvent(new Event('imageUploaded'));
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to upload images');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while uploading images');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const updatePrimaryImage = async (imageId: string) => {
    try {
      const token = await getToken();
      if (!token) return toast.error('Authentication token not found');

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaAssetId: imageId,
          userId: userId ?? userIdProp,
        }),
      });

      if (response.ok) {
        await fetchMediaAssets();
        setIsDialogOpen(false);
        toast.success('Image set as primary!');
      } else {
        toast.error('Failed to update primary image');
      }
    } catch {
      toast.error('An error occurred while updating the primary image.');
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const token = await getToken();
      if (!token) return toast.error('Authentication token not found');

      const response = await fetch('/api/deleteMediaAsset', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaAssetId: imageId,
          userId: userId ?? userIdProp,
        }),
      });

      if (response.ok) {
        await fetchMediaAssets();
        setIsDialogOpen(false);
        toast.success('Image deleted successfully!');
      } else {
        toast.error('Failed to delete image');
      }
    } catch {
      toast.error('An error occurred while deleting the image.');
    }
  };

  const thumbnails = (
    currentImage
      ? localMediaAssets.filter((a) => a.id !== currentImage.id)
      : localMediaAssets
  ).slice(0, 4);

  return (
    <div>
      {/* Upload Button */}
      <div className="flex justify-center mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Uploading...' : 'Upload Images'}
        </Button>
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
          <p className="text-gray-400">
            Click the Upload Images Button to select images...
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
              alt={`Banner for ${username}`}
              width={600}
              height={300}
              className="rounded-lg cursor-pointer object-cover w-full h-auto"
              onClick={() => currentImage && setIsDialogOpen(true)}
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
                className="mt-4 w-full bg-red-500 text-white hover:bg-red-600"
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
