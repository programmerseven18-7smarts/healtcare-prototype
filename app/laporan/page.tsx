import { AppShell } from '@/components/app-shell';
import { LaporanClient } from '@/components/laporan-client';
import { loadData } from '@/lib/data-store';
import { withDerivedProgress } from '@/lib/progress';

export const dynamic = 'force-dynamic';

export default async function LaporanPage() {
  const { rsudList, photos } = await loadData();
  const derivedRsudList = withDerivedProgress(rsudList, photos);

  return (
    <AppShell title="Laporan">
      <LaporanClient rsudList={derivedRsudList} photos={photos} />
    </AppShell>
  );
}
