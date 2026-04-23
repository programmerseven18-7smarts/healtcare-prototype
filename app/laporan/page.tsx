import { AppShell } from '@/components/app-shell';
import { LaporanClient } from '@/components/laporan-client';
import { loadData } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export default async function LaporanPage() {
  const { rsudList, photos } = await loadData();

  return (
    <AppShell title="Laporan">
      <LaporanClient rsudList={rsudList} photos={photos} />
    </AppShell>
  );
}
