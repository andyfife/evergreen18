'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Row = {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl: string | null;
  name: string | null;
  description: string | null;
  createdAt: string;
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVIEW';
  approvalStatus: 'DRAFT' | 'AWAITING_ADMIN' | 'APPROVED' | 'REJECTED';
  desiredVisibility: 'PRIVATE' | 'FRIENDS' | 'PUBLIC' | null;
  visibility: 'PRIVATE' | 'FRIENDS' | 'PUBLIC';
  user?: {
    username?: string | null;
    email_address?: string | null;
  } | null;
  transcript: {
    id: string;
    text: string | null;
    userApproved: boolean;
    finalApproval: 'DRAFT' | 'AWAITING_ADMIN' | 'APPROVED' | 'REJECTED';
    language: string | null;
    status: 'QUEUED' | 'PROCESSING' | 'FAILED' | 'COMPLETED';
    durationSec: number | null;
  } | null;
};

export default function AdminReviewListClient({
  initialRows,
}: {
  initialRows: Row[];
}) {
  const [rows, setRows] = React.useState<Row[]>(initialRows);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'completedOnly'>('all');
  const router = useRouter();

  const filtered = rows.filter((r) =>
    filter === 'completedOnly' ? r.transcript?.status === 'COMPLETED' : true
  );

  async function act(id: string, approve: boolean) {
    setBusyId(id);

    // ✅ Optimistic UI
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              approvalStatus: approve ? 'APPROVED' : 'REJECTED',
              transcript: r.transcript
                ? {
                    ...r.transcript,
                    finalApproval: approve ? 'APPROVED' : 'REJECTED',
                  }
                : r.transcript,
            }
          : r
      )
    );

    try {
      const res = await fetch(`/api/admin/user-media/${id}/final-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Action failed');
      }

      // ✅ Refresh page so new state reflects server truth
      router.refresh();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed to submit');
      setRows(initialRows); // rollback
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filtered.length} of {rows.length} awaiting admin
        </div>
        <div className="flex gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filter === 'completedOnly'}
              onChange={(e) =>
                setFilter(e.target.checked ? 'completedOnly' : 'all')
              }
            />
            Completed transcripts only
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-gray-500 border rounded-md p-6">
          Nothing to review right now.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((row) => (
            <li key={row.id} className="border rounded-xl overflow-hidden">
              {/* Video Preview */}
              <div className="bg-black">
                <video
                  src={row.url}
                  className="w-full max-h-80 object-contain bg-black"
                  controls
                  playsInline
                  crossOrigin="anonymous"
                />
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">
                      {row.name || 'Untitled video'}
                    </div>

                    {/* ✅ User info, moderation, approval */}
                    <div className="text-xs text-gray-500">
                      User:{' '}
                      {row.user?.email_address
                        ? row.user.email_address
                        : row.user?.username
                        ? row.user.username
                        : row.userId.slice(0, 6) + '…'}{' '}
                      · Moderation: {row.moderationStatus} · Approval:{' '}
                      <span
                        className={`inline-flex items-center rounded px-1.5 py-0.5 border ml-1 ${
                          row.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : row.approvalStatus === 'REJECTED'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {row.approvalStatus}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      Current: {row.visibility}
                    </div>
                  </div>
                </div>

                {/* Transcript Display */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Transcript</div>
                  {row.transcript ? (
                    <>
                      <div className="text-xs text-gray-500">
                        {row.transcript.language
                          ? `Language: ${row.transcript.language} · `
                          : ''}
                        Status: {row.transcript.status}
                        {row.transcript.userApproved
                          ? ' · User approved'
                          : ' · Awaiting user'}
                      </div>
                      <div className="p-3 rounded-md bg-gray-50 text-gray-800 text-sm max-h-40 overflow-auto whitespace-pre-wrap">
                        {row.transcript.text || '(empty)'}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-500">
                      No transcript found
                    </div>
                  )}
                </div>

                {/* Approve / Reject Buttons */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Note: Approving keeps visibility PRIVATE. Publishing is a
                    separate step.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => act(row.id, false)}
                      disabled={busyId === row.id}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      {busyId === row.id ? 'Working…' : 'Reject'}
                    </button>
                    <button
                      onClick={() => act(row.id, true)}
                      disabled={
                        busyId === row.id ||
                        row.approvalStatus !== 'AWAITING_ADMIN'
                      }
                      className="px-3 py-1 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60"
                      title={undefined}
                    >
                      {busyId === row.id ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />{' '}
                          Approving…
                        </span>
                      ) : (
                        'Approve'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
