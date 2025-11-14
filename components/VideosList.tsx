// components/VideosListServer.tsx
import Link from 'next/link';
import { Video as VideoIcon, Clock } from 'lucide-react';
import DeleteVideoButton from './DeleteVideoButton'; // <-- import

export type VideoType = {
  id: string;
  name: string | null;
  originalFilename: string | null;
  url: string | null;
  createdAt: Date | string;
  posterUrl: string | null;
};

export default async function VideosList({ videos }: { videos: VideoType[] }) {
  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <VideoIcon className="w-10 h-10 mb-3 text-gray-400" />
        <p>No videos found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Videos ({videos.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/user/video/${video.id}`}
            className="block bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
              {/* Delete button sits on top and prevents the Link navigation when clicked */}
              <DeleteVideoButton videoId={video.id} />

              {video.url ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  poster={video.posterUrl || undefined}
                />
              ) : (
                <VideoIcon className="w-12 h-12 text-gray-600" />
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 truncate">
                {video.name || video.originalFilename || 'Untitled Video'}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
