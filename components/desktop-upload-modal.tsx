'use client';

import { X, Camera, Upload, CheckCircle, ChevronRight, MapPin } from 'lucide-react';
import { MILESTONES, type Milestone, type RSUD } from '@/lib/data-model';
import { cn } from '@/lib/utils';

interface DesktopUploadModalProps {
  step: 'form' | 'preview' | 'success';
  rsudList: RSUD[];
  rsudId: string;
  milestone: Milestone;
  location: string;
  timestamp: string;
  notes: string;
  previewUrl: string | null;
  uploading: boolean;
  processing: boolean;
  error: string;
  locationReady: boolean;
  locationState: 'loading' | 'ready' | 'error';
  selectedRsud?: RSUD;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onRsudChange: (value: string) => void;
  onMilestoneChange: (value: Milestone) => void;
  onNotesChange: (value: string) => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onRetryLocation: () => void;
  onCameraChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function DesktopUploadModal({
  step,
  rsudList,
  rsudId,
  milestone,
  location,
  timestamp,
  notes,
  previewUrl,
  uploading,
  processing,
  error,
  locationReady,
  locationState,
  selectedRsud,
  fileInputRef,
  cameraInputRef,
  onClose,
  onRsudChange,
  onMilestoneChange,
  onNotesChange,
  onPickCamera,
  onPickGallery,
  onRetryLocation,
  onCameraChange,
  onGalleryChange,
  onBack,
  onSubmit,
}: DesktopUploadModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="flex min-h-[640px] flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-white px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                {step === 'form' ? 'Upload Foto' : step === 'preview' ? 'Preview Foto' : 'Berhasil!'}
              </h2>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                {step === 'form'
                  ? 'Pilih lokasi proyek lalu ambil atau pilih foto.'
                  : step === 'preview'
                    ? 'Periksa hasil foto dan metadata sebelum dikirim.'
                    : 'Foto berhasil tersimpan ke dokumentasi proyek.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {step === 'form' && (
            <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[minmax(0,1.1fr)_360px]">
              <div className="border-b border-[var(--border-color)] bg-[linear-gradient(180deg,#eff5ff_0%,#ffffff_100%)] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Upload Dokumentasi</p>
                    <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Cepat, rapi, dan siap kirim.</h3>
                    <p className="mt-2 max-w-xl text-sm text-slate-500">
                      Pilih sumber foto sesuai perangkat yang dipakai. Desktop fokus ke manajemen file, mobile fokus ke kamera.
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Form Upload
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Pilih RSUD</label>
                    <select
                      value={rsudId}
                      onChange={(e) => onRsudChange(e.target.value)}
                      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    >
                      <option value="">-- Pilih RSUD --</option>
                      {rsudList.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--text-primary)]">Pilih Milestone</label>
                    <select
                      value={milestone}
                      onChange={(e) => onMilestoneChange(e.target.value as Milestone)}
                      className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    >
                      {MILESTONES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onCameraChange}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onGalleryChange}
                />

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
                  <button
                    onClick={onPickCamera}
                    disabled={!locationReady || processing}
                    className={cn(
                      'relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#5b92ff,#2563eb_60%,#1d4ed8)] p-6 text-left text-white shadow-[0_18px_35px_rgba(37,99,235,0.24)] transition',
                      locationReady && !processing ? 'hover:-translate-y-0.5' : 'cursor-not-allowed opacity-55'
                    )}
                  >
                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
                    <div className="relative flex min-h-52 flex-col justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/15">
                        <Camera className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-2xl font-semibold">Ambil Foto</p>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-blue-100">
                          Gunakan kamera perangkat untuk dokumentasi progres lapangan secara instan.
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="space-y-4">
                    <button
                      onClick={onPickGallery}
                      disabled={!locationReady || processing}
                      className={cn(
                        'flex min-h-32 w-full flex-col items-start justify-between rounded-[1.75rem] border border-[var(--brand)] bg-blue-50 p-5 text-left text-[var(--brand)] transition',
                        locationReady && !processing ? 'hover:bg-blue-100' : 'cursor-not-allowed opacity-55'
                      )}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Upload className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold">Pilih dari Galeri</p>
                        <p className="mt-1 text-sm text-blue-700">Upload file foto yang sudah ada dari perangkat.</p>
                      </div>
                    </button>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Alur Cepat</p>
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">1. Tentukan RSUD dan milestone</div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">2. Ambil atau pilih foto</div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">3. Review lalu kirim</div>
                      </div>
                    </div>
                  </div>
                </div>

                {error && <p className="mt-4 text-xs text-red-500">{error}</p>}
              </div>

              <aside className="space-y-4 bg-slate-50 p-5 sm:p-6">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">Ringkasan pilihan</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Metadata akan ikut tersimpan bersama foto dokumentasi.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">RSUD</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedRsud?.name ?? 'Belum dipilih'}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Milestone</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{milestone}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Lokasi</p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-slate-900">{location}</p>
                      {locationState === 'error' && (
                        <button
                          type="button"
                          onClick={onRetryLocation}
                          className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Coba lagi
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#ffffff_0%,#eff6ff_100%)] p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Tips</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Ambil foto dengan pencahayaan yang cukup dan sudut yang memperlihatkan progres pekerjaan utama.
                  </p>
                </div>
              </aside>
            </div>
          )}

          {step === 'preview' && previewUrl && (
            <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border-color)] bg-slate-100 shadow-sm">
                  <img src={previewUrl} alt="Preview foto" className="w-full max-h-[420px] object-contain bg-slate-100" />
                </div>

                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-3">
                    <MapPin className="h-3.5 w-3.5 text-[var(--brand)] shrink-0" />
                    <span className="text-[var(--text-muted)] truncate">{location}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-[var(--bg-subtle)] px-4 py-3">
                    <span className="text-[var(--text-muted)]">{timestamp}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Catatan (Opsional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Tambahkan catatan tentang foto ini..."
                    rows={4}
                    className="w-full rounded-2xl border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  />
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}

                <div className="flex gap-3">
                  <button
                    onClick={onBack}
                    className="flex-1 rounded-2xl border border-[var(--border-color)] py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={onSubmit}
                    disabled={uploading || processing}
                    className={cn(
                      'flex-1 rounded-2xl bg-[var(--brand)] py-3 text-sm font-semibold text-white shadow transition',
                      uploading || processing ? 'cursor-not-allowed opacity-60' : 'hover:opacity-90'
                    )}
                  >
                    {processing ? 'Menyiapkan Foto...' : uploading ? 'Mengirim...' : 'Kirim'}
                  </button>
                </div>
              </div>

              <aside className="space-y-4 rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-subtle)] p-5">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">Review Upload</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Pastikan metadata dan hasil foto sudah sesuai.</p>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">RSUD</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{selectedRsud?.name ?? 'Belum dipilih'}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Milestone</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{milestone}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Waktu</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{timestamp}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Lokasi</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">{location}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
                  Foto akan dikirim ke galeri proyek dan langsung muncul di daftar dokumentasi.
                </div>
              </aside>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
              <div className="rounded-full bg-green-100 p-5">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <p className="text-base font-semibold text-[var(--text-primary)]">Foto Berhasil Dikirim!</p>
              <p className="max-w-md text-sm text-[var(--text-muted)]">
                Foto telah tersimpan dan dapat dilihat di galeri dokumentasi.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                Kembali ke galeri
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900 lg:hidden"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
