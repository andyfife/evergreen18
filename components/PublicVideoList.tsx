// components/PublicVideosList.tsx
'use client';

import { useState } from 'react';
import { Video as VideoIcon, FileText, X } from 'lucide-react';

type PublicVideo = {
  id: string;
  name: string;
  description: string;
  url: string;
  posterUrl: string | null;
  createdAt: Date | string;
  transcript: string;
};

export default function PublicVideosList({
  videos,
}: {
  videos: PublicVideo[];
}) {
  const [selectedVideo, setSelectedVideo] = useState<PublicVideo | null>(null);

  // Parse SRT format: strip timestamps/numbers and remove repetitive speaker names
  const parseSRT = (srtText: string): string => {
    if (!srtText) return '';

    const blocks = srtText.split(/\n\n+/);
    const dialogueLines: string[] = [];
    let lastSpeaker: string | null = null;

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length >= 3) {
        const dialogue = lines.slice(2).join('\n').trim();
        if (dialogue) {
          const speakerMatch = dialogue.match(/^\[([^\]]+)\]/);
          const currentSpeaker = speakerMatch ? speakerMatch[1] : null;

          if (currentSpeaker === lastSpeaker) {
            const textWithoutSpeaker = dialogue.replace(/^\[([^\]]+)\]\s*/, '');
            dialogueLines.push(textWithoutSpeaker);
          } else {
            dialogueLines.push(dialogue);
            lastSpeaker = currentSpeaker;
          }
        }
      }
    }

    return dialogueLines.join('\n\n');
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <VideoIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p>No public videos found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
              {video.url ? (
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  poster={video.posterUrl || undefined}
                />
              ) : (
                <VideoIcon className="w-12 h-12 text-gray-600" />
              )}
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {video.name}
              </h3>

              {video.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {video.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {new Date(video.createdAt).toLocaleDateString()}
                </span>

                {video.transcript && (
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    Read Transcript
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transcript Dialog */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {selectedVideo.name}
                </h2>
                {selectedVideo.description && (
                  <p className="text-sm text-gray-600">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Transcript Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedVideo.transcript ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {selectedVideo.transcript}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No transcript available for this video.
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
