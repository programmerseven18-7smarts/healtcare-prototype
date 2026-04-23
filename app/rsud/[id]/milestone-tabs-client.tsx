'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Images, CheckCircle2, Clock, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadModal } from '@/components/upload-modal';
import { useRouter } from 'next/navigation';
import type { RSUD, Photo, Milestone } from '@/lib/data-store';

interface MilestoneEntry {
  milestone: Milestone;
  photos: Photo[];
  progressThreshold: number;
  done: boolean;
}

interface Props {
  rsud: RSUD;
  milestoneData: MilestoneEntry[];
  rsudPhotos: Photo[];
  rsudList: RSUD[];
}

const TABS = ['Overview', 'Milestone', 'Foto'] as const;
type Tab = (typeof TABS)[number];

export function MilestoneTabsClient({ rsud, milestoneData, rsudPhotos, rsudList }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMilestone, setUploadMilestone] = useState<Milestone | undefined>();
  const router = useRouter();

  const handleUploadSuccess = () => {
    router.refresh();
  };

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-[var(--bg-subtle)] p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 rounded-lg py-2 text-sm font-medium transition-all',
              activeTab === tab
                ? 'bg-white text-[var(--brand)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="Nama RSUD" value={rsud.name} />
          <InfoRow label="Kota" value={rsud.kota} />
          <InfoRow label="Provinsi" value={rsud.provinsi} />
          <InfoRow label="Status" value={rsud.status} />
          <InfoRow label="Progress" value={`${rsud.progress}%`} />
          <InfoRow label="Total Foto" value={`${rsudPhotos.length} foto`} />
        </div>
      )}

      {/* Milestone */}
      {activeTab === 'Milestone' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {milestoneData.map(({ milestone, photos, done }) => (
            <div
              key={milestone}
              className="rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full shrink-0',
                    done ? 'bg-green-100' : 'bg-amber-50'
                  )}>
                    {done
                      ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                      : <Clock className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{milestone}</p>
                    <p className="text-xs text-[var(--text-muted)]">{photos.length} foto</p>
                  </div>
                </div>
                <span className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                )}>
                  {done ? 'Selesai' : 'Proses'}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/foto?rsud=${rsud.id}&milestone=${encodeURIComponent(milestone)}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-color)] py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
                >
                  <Images className="h-3.5 w-3.5" />
                  Lihat Foto
                </Link>
                <button
                  onClick={() => { setUploadMilestone(milestone); setShowUpload(true); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] py-2 text-xs font-medium text-white hover:opacity-90 transition"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Upload Foto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Foto tab */}
      {activeTab === 'Foto' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">{rsudPhotos.length} foto tersimpan</p>
            <button
              onClick={() => { setUploadMilestone(undefined); setShowUpload(true); }}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-medium text-white hover:opacity-90 transition"
            >
              <Camera className="h-3.5 w-3.5" />
              Upload Foto
            </button>
          </div>

          {rsudPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border-color)] py-16">
              <Images className="h-10 w-10 text-[var(--text-muted)]" />
              <p className="text-sm text-[var(--text-muted)]">Belum ada foto untuk RSUD ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {rsudPhotos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
                  <img src={photo.blobUrl} alt={photo.name} className="h-36 w-full object-cover" />
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{photo.milestone}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{photo.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showUpload && (
        <UploadModal
          rsudList={rsudList}
          defaultRsudId={rsud.id}
          defaultMilestone={uploadMilestone}
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-color)] bg-white p-4 shadow-sm">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
