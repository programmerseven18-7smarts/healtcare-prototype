import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  Images,
  PackageCheck,
  Settings,
  ShieldCheck,
  TowerControl,
  type LucideIcon,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { loadData } from '@/lib/data-store';
import { MILESTONES, type Milestone } from '@/lib/data-model';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const MILESTONE_ICONS: Record<Milestone, LucideIcon> = {
  'Site Preparation': TowerControl,
  'Material on Site ( CDD )': PackageCheck,
  'Installation': Settings,
  'Training': GraduationCap,
  'Commissioning': ShieldCheck,
};

const MILESTONE_DESC: Record<Milestone, string> = {
  'Site Preparation': 'Persiapan lokasi, pembersihan area, dan setup infrastruktur dasar',
  'Material on Site ( CDD )': 'Material dan perangkat utama sudah tiba di lokasi proyek',
  'Installation': 'Pemasangan peralatan medis dan sistem pendukung',
  'Training': 'Pelatihan staf dan operator sistem',
  'Commissioning': 'Pengujian akhir dan serah terima sistem',
};

const MILESTONE_THRESHOLDS: Record<Milestone, number> = {
  'Site Preparation': 25,
  'Material on Site ( CDD )': 40,
  'Installation': 50,
  'Training': 75,
  'Commissioning': 100,
};

export default async function MilestonePage() {
  const { rsudList, photos } = await loadData();

  return (
    <AppShell title="Milestone">
      <div className="space-y-6">
        {MILESTONES.map((milestone) => {
          const milestonePhotos = photos.filter((p) => p.milestone === milestone);
          const rsudWithMilestone = rsudList.filter(
            (r) => r.progress >= MILESTONE_THRESHOLDS[milestone]
          );
          const MilestoneIcon = MILESTONE_ICONS[milestone];

          return (
            <div key={milestone} className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-white shadow-sm">
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[var(--brand)]">
                  <MilestoneIcon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">{milestone}</h3>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-[var(--brand)]">
                      {milestonePhotos.length} foto
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{MILESTONE_DESC[milestone]}</p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      {rsudWithMilestone.length} RSUD selesai
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {rsudList.length - rsudWithMilestone.length} dalam proses
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[var(--border-color)] border-t border-[var(--border-color)]">
                {rsudList.slice(0, 3).map((rsud) => {
                  const rsudMilestonePhotos = photos.filter(
                    (p) => p.rsudId === rsud.id && p.milestone === milestone
                  );
                  return (
                    <div key={rsud.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-xs font-medium text-[var(--text-primary)]">{rsud.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{rsudMilestonePhotos.length} foto</p>
                      </div>
                      <Link
                        href={`/foto?rsud=${rsud.id}&milestone=${encodeURIComponent(milestone)}`}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition',
                          'bg-blue-50 text-[var(--brand)] hover:bg-blue-100'
                        )}
                      >
                        <Images className="h-3.5 w-3.5" />
                        Lihat Foto
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
