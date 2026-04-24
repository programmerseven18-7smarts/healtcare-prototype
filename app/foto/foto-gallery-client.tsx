'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Camera,
  Images,
  MapPin,
  Calendar,
  FileText,
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UploadModal } from '@/components/upload-modal';
import { useDisplayMode } from '@/components/display-mode-context';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Photo, RSUD, Milestone } from '@/lib/data-model';
import { MILESTONES } from '@/lib/data-model';

interface Props {
  photos: Photo[];
  rsudList: RSUD[];
  defaultRsudFilter?: string;
  defaultMilestoneFilter?: string;
}

export function FotoGalleryClient({ photos, rsudList, defaultRsudFilter, defaultMilestoneFilter }: Props) {
  const [galleryPhotos, setGalleryPhotos] = useState(photos);
  const [showUpload, setShowUpload] = useState(false);
  // Validation toast shown when the user tries to upload without filters set
  const [uploadValidationMsg, setUploadValidationMsg] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photoPendingDelete, setPhotoPendingDelete] = useState<Photo | null>(null);
  const [filterRsud, setFilterRsud] = useState(defaultRsudFilter ?? '');
  const [filterMilestone, setFilterMilestone] = useState(defaultMilestoneFilter ?? '');
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { displayMode } = useDisplayMode();

  // Both filters must be set for the page to show results
  const bothFiltersSet = Boolean(filterRsud && filterMilestone);
  // At least one filter set (used for showing a "filter-mismatch" empty state)
  const anyFilterSet = Boolean(filterRsud || filterMilestone);

  useEffect(() => {
    setGalleryPhotos(photos);
  }, [photos]);

  const filtered = useMemo(() => {
    if (!bothFiltersSet) return [];
    return galleryPhotos.filter(
      (p) => p.rsudId === filterRsud && p.milestone === filterMilestone
    );
  }, [galleryPhotos, bothFiltersSet, filterRsud, filterMilestone]);

  const getRsudName = (id: string) => rsudList.find((r) => r.id === id)?.name ?? id;
  const getLocationLabel = (location: string) => {
    if (!location) return 'Lokasi tidak tersedia';
    const parts = location.split(',');
    if (parts.length >= 2) {
      const lat = parts[0]?.trim();
      const lng = parts[1]?.trim();
      if (lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
        return `${lat}, ${lng}`;
      }
    }
    return location;
  };

  const handleDelete = async (photo: Photo) => {
    setDeleting(photo.id);
    try {
      await fetch(`/api/photos/${photo.id}`, { method: 'DELETE' });
      setGalleryPhotos((current) => current.filter((item) => item.id !== photo.id));
      setSelectedPhoto(null);
      setPhotoPendingDelete(null);
    } finally {
      setDeleting(null);
    }
  };

  /**
   * Called when upload succeeds.
   * - Optimistically prepends the new photo to local state so it appears
   *   immediately without waiting for a server refresh.
   * - Does NOT overwrite the active filters the user already had selected.
   * - Only if no filters were set before upload may it auto-assign filters.
   * - Triggers router.refresh() after local state is settled so the server
   *   snapshot eventually catches up without clobbering the optimistic state
   *   (the useEffect on `photos` will merge the server list in).
   */
  const handleUploadSuccess = (photo: Photo) => {
    setGalleryPhotos((current) => [photo, ...current.filter((item) => item.id !== photo.id)]);

    if (!filterRsud && !filterMilestone) {
      // No filters were active — auto-navigate to the uploaded photo's context
      setFilterRsud(photo.rsudId);
      setFilterMilestone(photo.milestone);
    }
    // If filters were already set, preserve them exactly as-is.

    // Defer the server refresh so the optimistic local state is visible first.
    // The useEffect above will sync once the server data arrives.
    setTimeout(() => router.refresh(), 500);
  };

  /**
   * Guards the upload action: both filters must be selected on the gallery
   * page before the upload modal may open.
   */
  const handleUploadClick = () => {
    if (!bothFiltersSet) {
      setUploadValidationMsg(
        'Please select both RSUD and milestone before uploading a photo.'
      );
      return;
    }
    setUploadValidationMsg('');
    setShowUpload(true);
  };

  const filterControls = (
    <div className={displayMode === 'mobile' ? 'grid gap-3' : 'grid gap-3 sm:grid-cols-2 lg:max-w-xl'}>
      <select
        value={filterRsud}
        onChange={(event) => {
          setFilterRsud(event.target.value);
          setUploadValidationMsg('');
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
      >
        <option value="">Semua RSUD</option>
        {rsudList.map((rsud) => (
          <option key={rsud.id} value={rsud.id}>
            {rsud.name}
          </option>
        ))}
      </select>
      <select
        value={filterMilestone}
        onChange={(event) => {
          setFilterMilestone(event.target.value);
          setUploadValidationMsg('');
        }}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-[var(--brand)]"
      >
        <option value="">Semua Milestone</option>
        {MILESTONES.map((milestone) => (
          <option key={milestone} value={milestone}>
            {milestone}
          </option>
        ))}
      </select>
    </div>
  );

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (displayMode === 'mobile') {
    return (
      <>
        <div className="space-y-5">
          <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#172554_0%,#2563eb_62%,#7dd3fc_100%)] p-5 text-white shadow-[0_26px_55px_rgba(37,99,235,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-100">Foto Dokumentasi</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Galeri Lapangan</h2>
                <p className="mt-2 text-sm leading-6 text-blue-100/90">
                  Dokumentasi progres dengan tag lokasi yang menempel langsung di file foto.
                </p>
              </div>
              <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20">
                <Images className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[1.35rem] bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">Ditemukan</p>
                <p className="mt-2 text-3xl font-bold">{bothFiltersSet ? filtered.length : 0}</p>
                <p className="text-xs text-blue-100">foto</p>
              </div>
              <button
                onClick={handleUploadClick}
                className="rounded-[1.35rem] bg-white p-4 text-left text-[var(--brand)] shadow-lg"
              >
                <Camera className="h-5 w-5" />
                <p className="mt-3 text-sm font-bold">Upload Foto</p>
                <p className="mt-1 text-xs text-slate-500">Ambil atau pilih galeri</p>
              </button>
            </div>
          </section>

          <section className="rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="mb-3 text-sm font-semibold text-slate-900">Filter Dokumentasi</p>
            {filterControls}
            {uploadValidationMsg && (
              <p className="mt-2 text-xs font-medium text-red-600">{uploadValidationMsg}</p>
            )}
          </section>

          {/* Empty states & results */}
          {!anyFilterSet ? (
            // Neither filter selected — prompt user to pick both
            <section className="flex flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">
              <Images className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-base font-semibold text-slate-900">Please select filters first</p>
              <p className="mt-2 text-sm text-slate-500">
                Select an RSUD and milestone to display the matching photo documentation.
              </p>
            </section>
          ) : !bothFiltersSet ? (
            // Only one filter selected — remind user to set the other
            <section className="flex flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">
              <Images className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-base font-semibold text-slate-900">Please select filters first</p>
              <p className="mt-2 text-sm text-slate-500">
                Select an RSUD and milestone to display the matching photo documentation.
              </p>
            </section>
          ) : filtered.length === 0 ? (
            // Both filters set but no matching photos
            <section className="flex flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-slate-300 bg-white px-5 py-16 text-center shadow-sm">
              <Images className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-base font-semibold text-slate-900">No matching photos found</p>
              <p className="mt-2 text-sm text-slate-500">Coba ubah filter atau upload dokumentasi baru.</p>
              <button
                onClick={handleUploadClick}
                className="mt-5 rounded-2xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-sm"
              >
                Upload Foto Pertama
              </button>
            </section>
          ) : (
            // Results
            <div className="space-y-4">
              {filtered.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="w-full overflow-hidden rounded-[1.7rem] bg-white text-left shadow-sm ring-1 ring-slate-200"
                >
                  <div className="relative bg-slate-100">
                    <img
                      src={photo.blobUrl}
                      alt={photo.name}
                      className="h-52 w-full object-contain bg-slate-100"
                    />
                    <div className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{getLocationLabel(photo.location)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-base font-semibold text-slate-900">{photo.milestone}</p>
                    <p className="mt-1 text-sm text-slate-500">{getRsudName(photo.rsudId)}</p>
                    <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      <span>{photo.date}</span>
                      <span>Lihat detail</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedPhoto && (
        <PhotoDetail
          photo={selectedPhoto}
          rsudName={getRsudName(selectedPhoto.rsudId)}
          locationLabel={getLocationLabel(selectedPhoto.location)}
          deleting={deleting === selectedPhoto.id}
          onClose={() => setSelectedPhoto(null)}
          onDelete={() => setPhotoPendingDelete(selectedPhoto)}
        />
      )}

        {showUpload && (
          <UploadModal
            rsudList={rsudList}
            defaultRsudId={filterRsud || undefined}
            defaultMilestone={(filterMilestone as Milestone) || undefined}
            onClose={() => setShowUpload(false)}
            onSuccess={handleUploadSuccess}
          />
        )}
      </>
    );
  }

  // ── Desktop layout ─────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)]">
              {bothFiltersSet
                ? `${filtered.length} foto ditemukan`
                : 'Silakan pilih RSUD dan milestone untuk menampilkan foto'}
            </p>
            <div className="mt-3">{filterControls}</div>
            {uploadValidationMsg && (
              <p className="mt-2 text-xs font-medium text-red-600">{uploadValidationMsg}</p>
            )}
          </div>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white shadow hover:opacity-90 transition"
          >
            <Camera className="h-4 w-4" />
            Upload Foto
          </button>
        </div>

        {/* Grid / empty states */}
        {!bothFiltersSet ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border-color)] py-20 text-center">
            <Images className="h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">Please select filters first</p>
            <p className="max-w-md text-sm text-[var(--text-muted)]">
              Select an RSUD and milestone to display the matching photo documentation.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--border-color)] py-20">
            <Images className="h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">
              No photos found for the selected filters
            </p>
            <button
              onClick={handleUploadClick}
              className="mt-1 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
            >
              Upload Foto Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={photo.blobUrl}
                    alt={photo.name}
                    className="h-40 w-full object-contain bg-slate-100 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1 rounded-full bg-slate-950/72 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{getLocationLabel(photo.location)}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{photo.milestone}</p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">{getRsudName(photo.rsudId)}</p>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">{photo.date}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Photo detail modal */}
      {selectedPhoto && (
        <PhotoDetail
          photo={selectedPhoto}
          rsudName={getRsudName(selectedPhoto.rsudId)}
          locationLabel={getLocationLabel(selectedPhoto.location)}
          deleting={deleting === selectedPhoto.id}
          onClose={() => setSelectedPhoto(null)}
          onDelete={() => setPhotoPendingDelete(selectedPhoto)}
        />
      )}

      {showUpload && (
        <UploadModal
          rsudList={rsudList}
          defaultRsudId={filterRsud || undefined}
          defaultMilestone={(filterMilestone as Milestone) || undefined}
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}

      <DeletePhotoDialog
        photo={photoPendingDelete}
        deleting={deleting === photoPendingDelete?.id}
        onCancel={() => setPhotoPendingDelete(null)}
        onConfirm={() => (photoPendingDelete ? handleDelete(photoPendingDelete) : undefined)}
      />
    </>
  );
}

function PhotoDetail({
  photo,
  rsudName,
  locationLabel,
  deleting,
  onClose,
  onDelete,
}: {
  photo: Photo;
  rsudName: string;
  locationLabel: string;
  deleting: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"
          aria-label="Tutup"
        >
          <X className="h-4 w-4 text-[var(--text-primary)]" />
        </button>
        <div className="bg-slate-100 p-3">
          <img
            src={photo.blobUrl}
            alt={photo.name}
            className="max-h-[70vh] w-full rounded-xl bg-slate-100 object-contain"
          />
        </div>
        <div className="space-y-3 p-5">
          <div>
            <p className="text-base font-semibold text-[var(--text-primary)]">{photo.milestone}</p>
            <p className="text-sm text-[var(--text-muted)]">{rsudName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <Calendar className="h-3.5 w-3.5 text-[var(--brand)]" />
              {photo.date}
            </div>
            <div className="flex items-center gap-1.5 truncate text-[var(--text-muted)]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
              <span className="truncate">{locationLabel}</span>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">Koordinat Lokasi</p>
            <p className="mt-1 break-all">{locationLabel}</p>
          </div>
          {photo.notes && (
            <div className="flex items-start gap-1.5 text-xs text-[var(--text-muted)]">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
              <span>{photo.notes}</span>
            </div>
          )}
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleting ? 'Menghapus...' : 'Hapus Foto'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeletePhotoDialog({
  photo,
  deleting,
  onCancel,
  onConfirm,
}: {
  photo: Photo | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={Boolean(photo)} onOpenChange={(open) => (!open ? onCancel() : undefined)}>
      <AlertDialogContent className="overflow-hidden border-0 bg-[linear-gradient(145deg,#fff7ed_0%,#ffffff_42%,#fee2e2_100%)] p-0 shadow-[0_32px_90px_rgba(15,23,42,0.4)] sm:max-w-lg">
        <div className="bg-[radial-gradient(circle_at_top_left,#fb7185_0%,#ef4444_28%,#7f1d1d_100%)] px-6 py-6 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-100">Danger Zone</p>
              <AlertDialogTitle className="mt-2 text-2xl font-bold tracking-tight text-white">
                Hapus foto dokumentasi?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-sm leading-6 text-rose-50">
                Tindakan ini akan menghapus foto dari galeri proyek dan tidak bisa dibatalkan.
              </AlertDialogDescription>
            </div>
          </div>
        </div>

        <AlertDialogHeader className="px-6 pb-1 pt-5 text-left">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Foto Yang Akan Dihapus</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{photo?.milestone ?? '-'}</p>
            <p className="mt-1 truncate text-sm text-slate-500">{photo?.name ?? 'Foto dokumentasi'}</p>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="px-6 pb-6 pt-4 sm:justify-between">
          <AlertDialogCancel
            onClick={onCancel}
            className="mt-0 rounded-2xl border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-2xl bg-[linear-gradient(135deg,#ef4444,#b91c1c)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,68,68,0.28)] hover:opacity-95"
          >
            {deleting ? 'Menghapus...' : 'Ya, Hapus Foto'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
