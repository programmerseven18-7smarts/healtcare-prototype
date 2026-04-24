'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Images, CheckCircle2, Clock, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadModal } from '@/components/upload-modal';
import { useRouter } from 'next/navigation';
import type { RSUD, Photo, Milestone } from '@/lib/data-model';
import { useDisplayMode } from '@/components/display-mode-context';

interface MilestoneEntry {
  milestone: Milestone;
  photos: Photo[];
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
  const { displayMode } = useDisplayMode();
  const isMobile = displayMode === 'mobile';

  const handleUploadSuccess = () => {
    router.refresh();
  };

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 sm:rounded-xl sm:bg-[var(--bg-subtle)]">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all sm:rounded-lg sm:py-2 sm:font-medium',
              activeTab === tab
                ? 'bg-white text-[var(--brand)] shadow-sm ring-1 ring-slate-200/70'
                : 'text-slate-500 hover:text-[var(--text-primary)]'
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
        <div className={cn('grid gap-3 sm:gap-4', isMobile ? 'grid-cols-1' : 'sm:grid-cols-2')}>
          {milestoneData.map(({ milestone, photos, done }) => (
            <div
              key={milestone}
              className={cn(
                'overflow-hidden border bg-white shadow-sm',
                isMobile
                  ? 'rounded-[1.45rem] border-slate-200 p-0 shadow-[0_14px_30px_rgba(15,23,42,0.08)]'
                  : 'rounded-xl border-[var(--border-color)] p-5'
              )}
            >
              <div className={cn('flex items-start justify-between gap-3', isMobile && 'p-4 pb-3')}>
                <div className="flex min-w-0 items-start gap-3">
                  <div className={cn(
                    'flex shrink-0 items-center justify-center rounded-2xl',
                    isMobile ? 'h-12 w-12' : 'h-9 w-9 rounded-full',
                    done ? 'bg-green-100' : 'bg-amber-50'
                  )}>
                    {done
                      ? <CheckCircle2 className={cn('text-green-600', isMobile ? 'h-6 w-6' : 'h-5 w-5')} />
                      : <Clock className={cn('text-amber-500', isMobile ? 'h-6 w-6' : 'h-5 w-5')} />}
                  </div>
                  <div className="min-w-0">
                    <p className={cn('font-bold leading-snug text-slate-950', isMobile ? 'text-base' : 'text-sm text-[var(--text-primary)]')}>
                      {milestone}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{photos.length} foto dokumentasi</p>
                  </div>
                </div>
                <span className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                  done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                )}>
                  {done ? 'Selesai' : 'Proses'}
                </span>
              </div>

              <div className={cn('flex gap-2', isMobile ? 'border-t border-slate-100 bg-slate-50/80 p-3' : 'mt-4')}>
                <Link
                  href={`/foto?rsud=${rsud.id}&milestone=${encodeURIComponent(milestone)}`}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 border font-semibold transition',
                    isMobile
                      ? 'rounded-xl border-slate-200 bg-white px-3 py-3 text-xs text-slate-700 shadow-sm'
                      : 'rounded-lg border-[var(--border-color)] py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                  )}
                >
                  <Images className="h-3.5 w-3.5" />
                  Lihat Foto
                </Link>
                <button
                  onClick={() => { setUploadMilestone(milestone); setShowUpload(true); }}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 bg-[var(--brand)] font-semibold text-white transition hover:opacity-90',
                    isMobile ? 'rounded-xl px-3 py-3 text-xs shadow-[0_10px_24px_rgba(37,99,235,0.28)]' : 'rounded-lg py-2 text-xs font-medium'
                  )}
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
