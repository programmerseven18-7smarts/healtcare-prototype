'use client';

import type { ComponentType } from 'react';
import { Activity, Building2, Camera, CheckCircle2, Clock3, Images, Sparkles, TrendingUp } from 'lucide-react';
import { useDisplayMode } from '@/components/display-mode-context';
import { MILESTONES, type Photo, type RSUD } from '@/lib/data-model';

interface LaporanClientProps {
  rsudList: RSUD[];
  photos: Photo[];
}

export function LaporanClient({ rsudList, photos }: LaporanClientProps) {
  const { displayMode } = useDisplayMode();

  const total = rsudList.length;
  const selesai = rsudList.filter((r) => r.status === 'Selesai').length;
  const aktif = rsudList.filter((r) => r.status === 'Aktif').length;
  const pending = rsudList.filter((r) => r.status === 'Pending').length;
  const avgProgress = Math.round(rsudList.reduce((s, r) => s + r.progress, 0) / Math.max(rsudList.length, 1));

  if (displayMode === 'mobile') {
    const topRsud = [...rsudList].sort((a, b) => b.progress - a.progress).slice(0, 4);

    return (
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#0f172a_0%,#1d4ed8_52%,#60a5fa_100%)] p-5 text-white shadow-[0_28px_60px_rgba(37,99,235,0.24)]">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-100">Laporan Proyek</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Kinerja lapangan hari ini</h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-blue-100/90">
                  Ringkasan progres, status RSUD, dan distribusi dokumentasi proyek dalam satu layar.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 rounded-[1.6rem] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/80">Rata-rata Progress</p>
                  <p className="mt-2 text-4xl font-bold">{avgProgress}%</p>
                </div>
                <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-blue-50">
                  {aktif} aktif • {selesai} selesai
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#bef264,#34d399,#22c55e)]"
                  style={{ width: `${avgProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <MobileSummaryCard icon={Building2} label="Total RSUD" value={total} tone="blue" />
          <MobileSummaryCard icon={Activity} label="Aktif" value={aktif} tone="green" />
          <MobileSummaryCard icon={CheckCircle2} label="Selesai" value={selesai} tone="emerald" />
          <MobileSummaryCard icon={Camera} label="Total Foto" value={photos.length} tone="rose" />
        </div>

        <section className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--brand)]" />
              <h3 className="text-base font-semibold text-slate-900">Peringkat RSUD</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">Empat progres tertinggi saat ini.</p>
          </div>
          <div className="space-y-3 p-4">
            {topRsud.map((rsud, index) => {
              const rsudPhotos = photos.filter((p) => p.rsudId === rsud.id);
              return (
                <div key={rsud.id} className="rounded-[1.35rem] bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[var(--brand)] shadow-sm">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{rsud.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{rsud.kota} • {rsudPhotos.length} foto</p>
                      </div>
                    </div>
                    <StatusBadge status={rsud.status} />
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-semibold text-[var(--brand)]">{rsud.progress}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)]"
                        style={{ width: `${rsud.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Images className="h-4 w-4 text-[var(--brand)]" />
              <h3 className="text-base font-semibold text-slate-900">Distribusi Milestone</h3>
            </div>
            <p className="mt-1 text-sm text-slate-500">Sebaran dokumentasi per tahap proyek.</p>
          </div>
          <div className="space-y-3 p-4">
            {MILESTONES.map((m) => {
              const count = photos.filter((p) => p.milestone === m).length;
              const pct = photos.length > 0 ? Math.round((count / photos.length) * 100) : 0;
              return (
                <div key={m} className="rounded-[1.3rem] bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{m}</p>
                      <p className="mt-1 text-xs text-slate-500">{count} foto terdokumentasi</p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--brand)] shadow-sm">
                      {pct}%
                    </div>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#93c5fd,#2563eb)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[1.7rem] bg-[linear-gradient(145deg,#ecfeff_0%,#ffffff_58%,#eff6ff_100%)] p-5 shadow-sm ring-1 ring-cyan-100">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Status Operasional</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {pending} RSUD masih pending. Fokus tindak lanjut bisa diarahkan ke lokasi dengan progres terendah.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total RSUD', value: total, icon: Building2, cls: 'text-blue-600 bg-blue-50' },
          { label: 'Aktif', value: aktif, icon: Clock3, cls: 'text-amber-600 bg-amber-50' },
          { label: 'Selesai', value: selesai, icon: CheckCircle2, cls: 'text-green-600 bg-green-50' },
          { label: 'Total Foto', value: photos.length, icon: Images, cls: 'text-rose-600 bg-rose-50' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${cls}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
        <div className="border-b border-[var(--border-color)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Progres Per RSUD</h2>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {rsudList.map((rsud) => {
            const rsudPhotos = photos.filter((p) => p.rsudId === rsud.id);
            return (
              <div key={rsud.id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{rsud.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{rsud.kota} • {rsudPhotos.length} foto</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                      <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${rsud.progress}%` }} />
                    </div>
                    <span className="w-9 shrink-0 text-right text-xs font-semibold text-[var(--brand)]">{rsud.progress}%</span>
                  </div>
                </div>
                <StatusBadge status={rsud.status} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
        <div className="border-b border-[var(--border-color)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Foto per Milestone</h2>
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {MILESTONES.map((m) => {
            const count = photos.filter((p) => p.milestone === m).length;
            const pct = photos.length > 0 ? Math.round((count / photos.length) * 100) : 0;
            return (
              <div key={m} className="flex items-center gap-4 px-5 py-3.5">
                <p className="w-36 shrink-0 text-sm text-[var(--text-primary)]">{m}</p>
                <div className="flex-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                    <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="w-12 shrink-0 text-right text-xs font-semibold text-[var(--text-muted)]">{count} foto</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border-color)] bg-blue-50 p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand)]">Rata-rata Progress Keseluruhan</p>
        <p className="mt-1 text-4xl font-bold text-[var(--brand)]">{avgProgress}%</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {pending} RSUD pending • {aktif} aktif • {selesai} selesai
        </p>
      </div>
    </div>
  );
}

function MobileSummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: 'blue' | 'green' | 'emerald' | 'rose';
}) {
  const toneMap = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    emerald: 'bg-green-50 text-green-700 ring-green-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
  };

  return (
    <div className="rounded-[1.55rem] bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className={`inline-flex rounded-2xl p-2.5 ring-1 ${toneMap[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-4 text-3xl font-bold leading-none text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
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
