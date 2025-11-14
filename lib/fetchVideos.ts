// lib/fetchVideos.ts
import { Video } from '@/lib/video';

export async function fetchVideos(establishmentId: string): Promise<Video[]> {
  const res = await fetch(
    `/api/mediaAssets?establishmentId=${encodeURIComponent(establishmentId)}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(await res.text());
  const all = await res.json();
  // Filter only videos
  return all.filter(
    (a: any) => a.type === 'ESTABLISHMENT_VIDEO' || a.type === 'PRODUCT_VIDEO'
  );
}
