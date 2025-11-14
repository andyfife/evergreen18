'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, Loader2, FileVideo } from 'lucide-react';

interface UploadStatus {
  mediaId: string;
  approvalStatus: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
  moderationNotes?: string;
  transcript?: {
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    error?: string;
  } | null;
}

export default function VideoUploadWithStatus() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Poll for status updates
  const pollStatus = useCallback(async (mediaId: string) => {
    try {
      const res = await fetch(`/api/videos/upload?mediaId=${mediaId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get status');
      }

      setStatus(data);

      // Stop polling if we reach a terminal state
      if (
        data.approvalStatus === 'REJECTED' ||
        (data.approvalStatus === 'APPROVED' &&
          data.transcript?.status === 'COMPLETED') ||
        (data.approvalStatus === 'APPROVED' &&
          data.transcript?.status === 'FAILED')
      ) {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    } catch (err) {
      console.error('[Poll] Error:', err);
      // Don't stop polling on transient errors
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a video file');
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        setError('File size must be less than 500MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('name', selectedFile.name);

      // Simulate upload progress (for UX)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log('[Upload] Success:', data);

      // Start polling for status
      setStatus({
        mediaId: data.mediaId,
        approvalStatus: 'PENDING',
        moderationNotes: 'Awaiting moderation',
      });

      pollIntervalRef.current = setInterval(() => {
        pollStatus(data.mediaId);
      }, 3000); // Poll every 3 seconds

      // Do initial poll immediately
      pollStatus(data.mediaId);

      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('[Upload] Error:', err);
      setError((err as Error).message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusIcon = () => {
    if (!status) return null;

    if (status.approvalStatus === 'REJECTED') {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }

    if (
      status.approvalStatus === 'APPROVED' &&
      status.transcript?.status === 'COMPLETED'
    ) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }

    return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
  };

  const getStatusMessage = () => {
    if (!status) return null;

    switch (status.approvalStatus) {
      case 'PENDING':
        return 'Queued for moderation...';
      case 'PROCESSING':
        return 'Checking content safety...';
      case 'REJECTED':
        return `❌ ${status.moderationNotes || 'Content rejected'}`;
      case 'APPROVED':
        if (!status.transcript) {
          return 'Approved! Preparing transcription...';
        }
        switch (status.transcript.status) {
          case 'PENDING':
            return 'Approved! Queued for transcription...';
          case 'PROCESSING':
            return 'Approved! Transcribing audio...';
          case 'COMPLETED':
            return '✅ Complete! Video is ready.';
          case 'FAILED':
            return `⚠️ Approved, but transcription failed: ${
              status.transcript.error || 'Unknown error'
            }`;
        }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer space-y-4"
          >
            <FileVideo className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Click to select a video
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Max 500MB • MP4, MOV, AVI, WebM
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <FileVideo className="w-16 h-16 mx-auto text-blue-500" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={uploading}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Upload Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Status Display */}
      {status && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{getStatusMessage()}</p>
              {status.approvalStatus === 'APPROVED' && status.transcript && (
                <p className="text-sm text-gray-500 mt-1">
                  Media ID: {status.mediaId}
                </p>
              )}
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <StatusStep label="Upload" status="completed" />
            <StatusStep
              label="Content Moderation"
              status={
                status.approvalStatus === 'PENDING'
                  ? 'pending'
                  : status.approvalStatus === 'PROCESSING'
                  ? 'processing'
                  : status.approvalStatus === 'APPROVED'
                  ? 'completed'
                  : 'failed'
              }
            />
            {status.approvalStatus === 'APPROVED' && (
              <StatusStep
                label="Transcription"
                status={
                  !status.transcript
                    ? 'pending'
                    : status.transcript.status === 'PENDING'
                    ? 'pending'
                    : status.transcript.status === 'PROCESSING'
                    ? 'processing'
                    : status.transcript.status === 'COMPLETED'
                    ? 'completed'
                    : 'failed'
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusStep({
  label,
  status,
}: {
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}) {
  const icons = {
    pending: <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />,
    processing: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
  };

  const colors = {
    pending: 'text-gray-500',
    processing: 'text-blue-600',
    completed: 'text-green-600',
    failed: 'text-red-600',
  };

  return (
    <div className="flex items-center gap-3">
      {icons[status]}
      <span className={`text-sm font-medium ${colors[status]}`}>{label}</span>
    </div>
  );
}
