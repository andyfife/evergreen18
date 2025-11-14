// components/UploadVideo.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UploadResponse {
  uploaded: Array<{
    id: string;
    url: string;
  }>;
  message: string;
}

export default function UploadVideo() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file size (4GB max)
      const MAX_SIZE = 4 * 1024 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError('File too large. Maximum size is 4GB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file.');
        return;
      }

      setUploading(true);
      setStatus('Uploading video...');
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      try {
        // Upload with progress tracking
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setProgress(Math.round(percentComplete));
            setStatus(`Uploading... ${Math.round(percentComplete)}%`);
          }
        });

        // Handle completion
        const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          });
          xhr.addEventListener('error', () =>
            reject(new Error('Upload failed'))
          );
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);

        const data = await uploadPromise;

        setProgress(100);
        setStatus('✅ Upload successful! Processing...');

        // Refresh the page to show the new video
        setTimeout(() => {
          router.refresh();
          setUploading(false);
          setStatus('');
          setProgress(0);
          // Reset the input
          e.target.value = '';
        }, 2000);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err instanceof Error ? err.message : 'Upload failed');
        setUploading(false);
        setProgress(0);
      }
    },
    [router]
  );

  return (
    <div className="space-y-4">
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
        <label className="flex flex-col items-center cursor-pointer">
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600 mb-2">
            {uploading ? 'Uploading...' : 'Click to upload video'}
          </span>
          <span className="text-xs text-gray-500">MP4, MOV, AVI up to 4GB</span>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && progress > 0 && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">{status}</p>
        </div>
      )}

      {/* Status Message */}
      {!uploading && status && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{status}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-sm text-blue-900 mb-2">
          📹 What happens after upload?
        </h3>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Video is automatically checked for content safety</li>
          <li>If approved, transcription starts automatically</li>
          <li>You'll be able to review and edit the transcript</li>
          <li>Once approved, you can share publicly or with friends</li>
        </ol>
      </div>
    </div>
  );
}
