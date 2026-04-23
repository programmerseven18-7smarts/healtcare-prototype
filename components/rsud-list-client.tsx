'use client';

import { Building2, ChevronRight, MapPin, Camera } from 'lucide-react';
import { useDisplayMode } from '@/components/display-mode-context';
import { ModeLink } from '@/components/mode-link';
import type { Photo, RSUD } from '@/lib/data-model';

interface RSUDListClientProps {
  rsudList: RSUD[];
  photos: Photo[];
}

export function RSUDListClient({ rsudList, photos }: RSUDListClientProps) {
  const { displayMode } = useDisplayMode();

  if (displayMode === 'mobile') {
    return (
      <div className="space-y-4">
        <section className="rounded-[1.8rem] bg-[linear-gradient(145deg,#eff5ff_0%,#ffffff_60%,#f4f8ff_100%)] p-5 shadow-[0_20px_45px_rgba(37,99,235,0.10)] ring-1 ring-blue-100">
          <p className="text-sm font-medium text-slate-500">Data RSUD</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Monitoring Rumah Sakit</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Total {rsudList.length} RSUD terdaftar dengan progres dan dokumentasi terbaru.
          </p>
        </section>

        <div className="space-y-3">
          {rsudList.map((rsud) => {
            const rsudPhotos = photos.filter((p) => p.rsudId === rsud.id);
            return (
              <article
                key={rsud.id}
                className="rounded-[1.6rem] bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--brand)]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold leading-6 text-slate-900">{rsud.name}</h3>
                        <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>
                            {rsud.kota}, {rsud.provinsi}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={rsud.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Progress</p>
                        <p className="mt-1 text-2xl font-bold text-[var(--brand)]">{rsud.progress}%</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Camera className="h-3.5 w-3.5" />
                          <p className="text-[11px] font-semibold uppercase tracking-wide">Foto</p>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{rsudPhotos.length}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Kemajuan proyek</span>
                        <span className="font-semibold text-[var(--brand)]">{rsud.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)]"
                          style={{ width: `${rsud.progress}%` }}
                        />
                      </div>
                    </div>

                    <ModeLink
                      href={`/rsud/${rsud.id}`}
                      className="mt-4 inline-flex items-center gap-1 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                    >
                      Lihat Detail
                      <ChevronRight className="h-4 w-4" />
                    </ModeLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-muted)]">Total {rsudList.length} RSUD terdaftar dalam sistem.</p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rsudList.map((rsud) => {
          const rsudPhotos = photos.filter((p) => p.rsudId === rsud.id);
          return (
            <div
              key={rsud.id}
              className="rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Building2 className="h-5 w-5 text-[var(--brand)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">{rsud.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {rsud.kota}, {rsud.provinsi}
                    </p>
                  </div>
                </div>
                <StatusBadge status={rsud.status} />
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Progress</span>
                  <span className="font-semibold text-[var(--brand)]">{rsud.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--brand)] transition-all"
                    style={{ width: `${rsud.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-[var(--text-muted)]">{rsudPhotos.length} foto dokumentasi</p>
                <ModeLink
                  href={`/rsud/${rsud.id}`}
                  className="flex items-center gap-1 text-xs font-medium text-[var(--brand)] hover:underline"
                >
                  Lihat Detail <ChevronRight className="h-3.5 w-3.5" />
                </ModeLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktif: 'bg-green-100 text-green-700',
    Selesai: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}
