// components/UploadVideo.tsx
'use client';

import { useState } from 'react';

export default function UploadVideo({ userMediaId }: { userMediaId: string }) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [transcriptId, setTranscriptId] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userMediaId', userMediaId);

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.transcriptId) {
        setTranscriptId(data.transcriptId);
        setStatus('Queued for transcription...');
        pollStatus(data.transcriptId);
      }
    } catch (err) {
      setStatus('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const pollStatus = async (id: string) => {
    const res = await fetch(`/api/transcript/${id}`);
    const data = await res.json();

    setStatus(data.status);

    if (!['COMPLETED', 'FAILED'].includes(data.status)) {
      setTimeout(() => pollStatus(id), 5000);
    } else if (data.status === 'COMPLETED') {
      setStatus(
        `Done! <a href="${data.srtUrl}" target="_blank">Download SRT</a>`
      );
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {status && (
        <p
          className="mt-2 text-sm"
          dangerouslySetInnerHTML={{ __html: status }}
        />
      )}
    </div>
  );
}
