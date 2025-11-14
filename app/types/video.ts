// types/video.ts
export type ModerationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'APPROVED'
  | 'REJECTED'
  | 'FAILED';

export type TranscriptStatus =
  | 'QUEUED'
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'APPROVED';

export type Visibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC';

export type ApprovalStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED';

export interface Transcript {
  id: string;
  text: string;
  language: string;
  userApproved: boolean;
  status: TranscriptStatus;
  srtUrl?: string;
  vttUrl?: string;
  createdAt?: string;
}

export interface Video {
  id: string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  description: string;
  approvalStatus: string; // or your specific type
  visibility: Visibility;
  desiredVisibility: Visibility | null;
  moderationStatus: string;
  moderationNotes?: string; // ← ADD
  type: string;
  isPrimaryImage: boolean;
  isPublic: boolean;
  isProcessing: boolean;
  isFailed: boolean;
  isReady: boolean;
  createdAt: string;
  updatedAt: string;

  transcript: {
    id: string;
    text: string;
    language: string;
    userApproved: boolean;
    status: string;
    srtUrl?: string;
    vttUrl?: string;
    createdAt?: string; // ← ADD
  } | null;
}

// Queue job states
export type JobState =
  | 'waiting'
  | 'active'
  | 'completed'
  | 'failed'
  | 'delayed';

export interface JobStatus {
  id: string;
  state: JobState;
  progress: number;
  attemptsMade: number;
  failedReason?: string;
}
