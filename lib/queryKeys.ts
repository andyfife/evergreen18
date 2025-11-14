// '@/lib/queryKeys.ts'
export const qk = {
  // Detail
  video: (id: string) => ['videos', 'detail', id] as const,

  // Canonical list keys
  videosByUser: (
    userId: string,
    opts?: { visibility?: 'PRIVATE' | 'PUBLIC' | 'ALL'; page?: number }
  ) =>
    [
      'videos',
      'list',
      'user',
      userId,
      opts?.visibility ?? 'ALL',
      opts?.page ?? 1,
    ] as const,

  videosByEst: (estId: string, opts?: { page?: number }) =>
    ['videos', 'list', 'est', estId, opts?.page ?? 1] as const,

  // Back-compat aliases so your current components work without edits:
  videos: (userId: string) => ['videos', 'list', 'user', userId] as const,
  userMedia: (userId: string) => ['videos', 'list', 'user', userId] as const,
} as const;
