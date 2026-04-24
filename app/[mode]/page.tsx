import { AppShell } from '@/components/app-shell';
import { DashboardClient } from '@/components/dashboard-client';
import { loadData } from '@/lib/data-store';
import { withDerivedProgress } from '@/lib/progress';

export const dynamic = 'force-dynamic';

export default async function DashboardModePage() {
  const data = await loadData();
  const { photos } = data;
  const rsudList = withDerivedProgress(data.rsudList, photos);

  const aktif = rsudList.filter((r) => r.status === 'Aktif').length;
  const selesai = rsudList.filter((r) => r.status === 'Selesai').length;
  const avgProgress = Math.round(rsudList.reduce((sum, r) => sum + r.progress, 0) / Math.max(rsudList.length, 1));

  return (
    <AppShell title="Dashboard">
      <DashboardClient
        rsudList={rsudList}
        photos={photos}
        aktif={aktif}
        selesai={selesai}
        avgProgress={avgProgress}
      />
    </AppShell>
  );
}
