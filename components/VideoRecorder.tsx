'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

export default function VideoRecorder({
  onVideoSelected,
  disabled,
}: {
  onVideoSelected: (file: File) => void;
  disabled?: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Start webcam preview and recording
  const startRecording = async () => {
    if (disabled || isRecording) return;
    try {
      setIsLoading(true);
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current
          .play()
          .catch((err) => toast.error('Error playing video: ' + err.message));
      }

      const options = { mimeType: 'video/webm;codecs=vp9' };
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', {
          type: 'video/webm',
        });
        onVideoSelected(file);
        stopStream();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      toast.error('Error accessing camera: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop recording and clean up
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Clean up stream when component unmounts or recording stops
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        className="w-full h-64 bg-black rounded-md"
        playsInline
        muted // Mute to prevent feedback during preview
      />
      <div className="flex gap-2">
        <Button
          onClick={startRecording}
          disabled={disabled || isRecording || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Starting…' : 'Record from Webcam'}
        </Button>
        <Button
          onClick={stopRecording}
          disabled={!isRecording || disabled}
          variant="destructive"
          className="flex-1"
        >
          Stop Recording
        </Button>
      </div>
    </div>
  );
}
