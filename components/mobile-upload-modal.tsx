'use client';

import { ArrowLeft, Camera, ChevronRight, ImageIcon, MapPin, Send, User } from 'lucide-react';
import type { Milestone, RSUD } from '@/lib/data-model';
import { MILESTONES } from '@/lib/data-model';
import { cn } from '@/lib/utils';

interface MobileUploadModalProps {
  rsudList: RSUD[];
  rsudId: string;
  milestone: Milestone;
  notes: string;
  location: string;
  timestamp: string;
  previewUrl: string | null;
  uploading: boolean;
  processing: boolean;
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onBack: () => void;
  onRsudChange: (value: string) => void;
  onMilestoneChange: (value: Milestone) => void;
  onNotesChange: (value: string) => void;
  onPickCamera: () => void;
  onPickGallery: () => void;
  onCameraChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export function MobileUploadModal({
  rsudList,
  rsudId,
  milestone,
  notes,
  location,
  timestamp,
  previewUrl,
  uploading,
  processing,
  error,
  fileInputRef,
  cameraInputRef,
  onClose,
  onBack,
  onRsudChange,
  onMilestoneChange,
  onNotesChange,
  onPickCamera,
  onPickGallery,
  onCameraChange,
  onGalleryChange,
  onSubmit,
}: MobileUploadModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex h-full flex-col overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={previewUrl ? onBack : onClose}
            className="inline-flex items-center gap-2 text-sm text-slate-500"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>
          <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Mobile Upload</div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3">
            <select
              value={rsudId}
              onChange={(e) => onRsudChange(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              <option value="">-- Pilih RSUD --</option>
              {rsudList.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              value={milestone}
              onChange={(e) => onMilestoneChange(e.target.value as Milestone)}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            >
              {MILESTONES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
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

          <button
            type="button"
            onClick={onPickCamera}
            className="block w-full overflow-hidden rounded-[1.75rem] border border-dashed border-blue-200 bg-[linear-gradient(180deg,#f9fbff_0%,#eef4ff_100%)] shadow-sm"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview foto" className="h-60 w-full object-contain bg-slate-100" />
            ) : (
              <div className="flex h-60 flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Camera className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-600">Ketuk untuk mengambil foto</p>
                <p className="mt-1 text-sm text-slate-400">atau pilih dari galeri</p>
              </div>
            )}
          </button>

          <div className="grid grid-cols-[1.25fr_0.75fr] gap-3">
            <button
              type="button"
              onClick={onPickCamera}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4f8dfc,#2563eb)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(37,99,235,0.24)]"
            >
              <Camera className="h-4 w-4" />
              Ambil Foto
            </button>
            <button
              type="button"
              onClick={onPickGallery}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
            >
              <ImageIcon className="h-4 w-4" />
              Galeri
            </button>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Informasi Otomatis</p>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span>{location}</span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="mt-0.5 h-4 w-4 rotate-90 text-[var(--brand)]" />
                <span>{timestamp}</span>
              </div>
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                <span>Tim Lapangan</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-primary)]">Catatan (Opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Tambahkan catatan..."
              rows={3}
              className="w-full rounded-2xl border border-[var(--border-color)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="button"
            onClick={onSubmit}
            disabled={uploading || processing || !previewUrl}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-semibold text-white shadow-[0_16px_30px_rgba(16,185,129,0.28)] transition',
              uploading || processing || !previewUrl
                ? 'cursor-not-allowed bg-emerald-300'
                : 'bg-[linear-gradient(135deg,#1ec98f,#0ea76f)] hover:-translate-y-0.5'
            )}
          >
            <Send className="h-4 w-4" />
            {processing ? 'Menyiapkan Foto...' : uploading ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </div>
    </div>
  );
}
