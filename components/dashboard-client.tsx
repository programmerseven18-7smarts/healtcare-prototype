'use client';

import { Building2, Images, CheckSquare, TrendingUp, ChevronRight, ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/stat-card';
import { useDisplayMode } from '@/components/display-mode-context';
import type { RSUD, Photo } from '@/lib/data-model';
import { cn } from '@/lib/utils';
import { ModeLink } from '@/components/mode-link';

interface DashboardClientProps {
  rsudList: RSUD[];
  photos: Photo[];
  aktif: number;
  selesai: number;
  avgProgress: number;
}

export function DashboardClient({
  rsudList,
  photos,
  aktif,
  selesai,
  avgProgress,
}: DashboardClientProps) {
  const { displayMode } = useDisplayMode();

  if (displayMode === 'mobile') {
    return (
      <div className="space-y-5">
        <div className="rounded-[1.9rem] bg-[linear-gradient(135deg,#eff5ff_0%,#ffffff_60%,#f4f9ff_100%)] p-5 shadow-[0_18px_40px_rgba(37,99,235,0.12)] ring-1 ring-blue-100">
          <p className="text-sm font-medium text-slate-500">Dashboard Proyek</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ringkasan Hari Ini</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pantau progres RSUD, dokumentasi foto, dan status proyek langsung dari lapangan.
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--brand)] shadow-sm ring-1 ring-blue-100">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MobileStatCard label="Total RSUD" value={rsudList.length} sub="Terdaftar" tone="blue" />
          <MobileStatCard label="Proyek Aktif" value={aktif} sub="Sedang jalan" tone="green" />
          <MobileStatCard label="Selesai" value={selesai} sub="Milestone selesai" tone="amber" />
          <MobileStatCard label="Total Foto" value={photos.length} sub="Dokumentasi" tone="rose" />
        </div>

        <div className="rounded-[1.6rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Rata-rata Progress</p>
              <p className="mt-1 text-sm text-slate-500">Perkembangan keseluruhan proyek RSUD</p>
            </div>
            <span className="text-2xl font-bold text-[var(--brand)]">{avgProgress}%</span>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)]"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Daftar RSUD</h3>
              <p className="mt-1 text-sm text-slate-500">Status singkat proyek prioritas</p>
            </div>
            <ModeLink href="/rsud" className="text-sm font-semibold text-[var(--brand)]">
              Lihat Semua
            </ModeLink>
          </div>
          <div className="space-y-3 px-4 pb-4">
            {rsudList.slice(0, 5).map((rsud) => (
              <div key={rsud.id} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-6 text-slate-900">{rsud.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{rsud.kota}, {rsud.provinsi}</p>
                  </div>
                  <StatusBadge status={rsud.status} />
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-[var(--brand)]">{rsud.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)]"
                      style={{ width: `${rsud.progress}%` }}
                    />
                  </div>
                </div>
                <ModeLink
                  href={`/rsud/${rsud.id}`}
                  className="mt-4 inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[var(--brand)] shadow-sm ring-1 ring-blue-100"
                >
                  Lihat Detail
                  <ChevronRight className="h-4 w-4" />
                </ModeLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total RSUD" value={rsudList.length} icon={Building2} color="blue" sub="Terdaftar" />
        <StatCard label="Proyek Aktif" value={aktif} icon={TrendingUp} color="green" sub="Sedang berjalan" />
        <StatCard label="Selesai" value={selesai} icon={CheckSquare} color="amber" sub="Milestone tercapai" />
        <StatCard label="Total Foto" value={photos.length} icon={Images} color="rose" sub="Dokumentasi" />
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Rata-rata Progress Keseluruhan</p>
          <span className="text-sm font-bold text-[var(--brand)]">{avgProgress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-all"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Daftar RSUD</h2>
          <ModeLink href="/rsud" className="text-xs font-medium text-[var(--brand)] hover:underline">
            Lihat Semua
          </ModeLink>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-subtle)]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Nama RSUD</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] md:table-cell">Kota</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Status</th>
                <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] lg:table-cell">Progress</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {rsudList.slice(0, 5).map((rsud) => (
                <tr key={rsud.id} className="transition-colors hover:bg-[var(--bg-subtle)]">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-[var(--text-primary)]">{rsud.name}</p>
                    <p className="text-xs text-[var(--text-muted)] md:hidden">{rsud.kota}</p>
                  </td>
                  <td className="hidden px-5 py-3.5 text-[var(--text-muted)] md:table-cell">{rsud.kota}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={rsud.status} />
                  </td>
                  <td className="hidden px-5 py-3.5 lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                        <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${rsud.progress}%` }} />
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{rsud.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <ModeLink
                      href={`/rsud/${rsud.id}`}
                      className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-[var(--brand)] transition hover:bg-blue-100"
                    >
                      Lihat Detail
                    </ModeLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MobileStatCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub: string;
  tone: 'blue' | 'green' | 'amber' | 'rose';
}) {
  const tones = {
    blue: 'from-blue-50 to-blue-100/70 text-blue-700 ring-blue-100',
    green: 'from-emerald-50 to-green-100/70 text-emerald-700 ring-emerald-100',
    amber: 'from-amber-50 to-orange-100/70 text-amber-700 ring-amber-100',
    rose: 'from-rose-50 to-pink-100/70 text-rose-700 ring-rose-100',
  };

  return (
    <div className={cn('rounded-[1.5rem] bg-gradient-to-br p-4 shadow-sm ring-1', tones[tone])}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-bold leading-none">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{sub}</p>
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
