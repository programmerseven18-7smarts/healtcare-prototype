import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Images, CheckSquare2, MapPin } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { loadData } from '@/lib/data-store';
import { MILESTONES, type Milestone } from '@/lib/data-model';
import { MilestoneTabsClient } from './milestone-tabs-client';

export const dynamic = 'force-dynamic';

const MILESTONE_PROGRESS: Record<Milestone, number> = {
  'Site Preparation': 25,
  'Material on Site ( CDD )': 40,
  'Installation': 50,
  'Training': 75,
  'Commissioning': 100,
};

export default async function RSUDDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { rsudList, photos } = await loadData();
  const rsud = rsudList.find((r) => r.id === id);
  if (!rsud) notFound();

  const rsudPhotos = photos.filter((p) => p.rsudId === id);

  // Work out which milestones have photos
  const milestoneData = MILESTONES.map((m) => ({
    milestone: m,
    photos: rsudPhotos.filter((p) => p.milestone === m),
    progressThreshold: MILESTONE_PROGRESS[m],
    done: rsud.progress >= MILESTONE_PROGRESS[m],
  }));

  return (
    <AppShell title={rsud.name}>
      <div className="space-y-6">
        {/* Back + header */}
        <div>
          <Link
            href="/rsud"
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--brand)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar RSUD
          </Link>
          <div className="rounded-xl border border-[var(--border-color)] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{rsud.name}</h2>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                  <MapPin className="h-3.5 w-3.5" />
                  {rsud.kota}, {rsud.provinsi}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--brand)]">{rsud.progress}%</p>
                  <p className="text-xs text-[var(--text-muted)]">Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{rsudPhotos.length}</p>
                  <p className="text-xs text-[var(--text-muted)]">Foto</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2.5 w-full rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand)] transition-all"
                  style={{ width: `${rsud.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Overview / Milestone / Foto */}
        <MilestoneTabsClient rsud={rsud} milestoneData={milestoneData} rsudPhotos={rsudPhotos} rsudList={rsudList} />
      </div>
    </AppShell>
  );
}
