import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, CheckCircle2, Images, MapPin } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { loadData } from '@/lib/data-store';
import { MILESTONES } from '@/lib/data-model';
import { withDerivedProgress } from '@/lib/progress';
import { MilestoneTabsClient } from './milestone-tabs-client';

export const dynamic = 'force-dynamic';

export default async function RSUDDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadData();
  const { photos } = data;
  const rsudList = withDerivedProgress(data.rsudList, photos);
  const rsud = rsudList.find((r) => r.id === id);
  if (!rsud) notFound();

  const rsudPhotos = photos.filter((p) => p.rsudId === id);

  // Work out which milestones have photos
  const milestoneData = MILESTONES.map((m) => ({
    milestone: m,
    photos: rsudPhotos.filter((p) => p.milestone === m),
    done: rsudPhotos.some((p) => p.milestone === m),
  }));

  return (
    <AppShell title={rsud.name}>
      <div className="space-y-5 sm:space-y-6">
        <div>
          <Link
            href="/rsud"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[var(--brand)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar RSUD
          </Link>

          <div className="overflow-hidden rounded-[1.65rem] border border-blue-100 bg-[linear-gradient(145deg,#ffffff_0%,#eef5ff_58%,#dbeafe_100%)] p-5 shadow-[0_22px_50px_rgba(37,99,235,0.16)] sm:rounded-xl sm:border-[var(--border-color)] sm:bg-white sm:shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--brand)] ring-1 ring-blue-100">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {rsud.status}
                </div>
                <h2 className="text-2xl font-bold leading-tight tracking-normal text-slate-950 sm:text-lg sm:text-[var(--text-primary)]">
                  {rsud.name}
                </h2>
                <div className="mt-2 flex items-start gap-1.5 text-sm leading-5 text-slate-500">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{rsud.kota}, {rsud.provinsi}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
                <div className="rounded-2xl bg-white/85 p-4 text-center shadow-sm ring-1 ring-blue-100 sm:bg-transparent sm:p-0 sm:shadow-none sm:ring-0">
                  <p className="text-3xl font-bold leading-none text-[var(--brand)] sm:text-2xl">{rsud.progress}%</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Progress</p>
                </div>
                <div className="rounded-2xl bg-white/85 p-4 text-center shadow-sm ring-1 ring-blue-100 sm:bg-transparent sm:p-0 sm:shadow-none sm:ring-0">
                  <div className="flex items-center justify-center gap-1.5">
                    <Camera className="h-4 w-4 text-[var(--brand)]" />
                    <p className="text-3xl font-bold leading-none text-slate-950 sm:text-2xl sm:text-[var(--text-primary)]">{rsudPhotos.length}</p>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-500">Foto</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Milestone selesai</span>
                <span>{rsud.progress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-blue-100 sm:bg-[var(--bg-subtle)] sm:ring-0">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#60a5fa,#2563eb)] transition-all"
                  style={{ width: `${rsud.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <MilestoneTabsClient rsud={rsud} milestoneData={milestoneData} rsudPhotos={rsudPhotos} rsudList={rsudList} />
      </div>
    </AppShell>
  );
}
