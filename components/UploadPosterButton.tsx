'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  videoId: string;
  thumbnailUrl?: string | null;
  onUpload?: (url: string) => void;
}

export default function UploadPosterButton({
  videoId,
  thumbnailUrl,
  onUpload,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [posterUrl, setPosterUrl] = useState(thumbnailUrl);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const buffer = await file.arrayBuffer();

      const res = await fetch('/api/videos/upload-poster', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'X-Video-Id': videoId,
        },
        body: buffer,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setPosterUrl(data.posterUrl);
      onUpload?.(data.posterUrl);
      toast.success('Poster uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Uploading...' : posterUrl ? 'Change Poster' : 'Upload Poster'}
      </Button>
    </div>
  );
}
