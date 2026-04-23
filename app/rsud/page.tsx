import { AppShell } from '@/components/app-shell';
import { RSUDListClient } from '@/components/rsud-list-client';
import { loadData } from '@/lib/data-store';

export const dynamic = 'force-dynamic';

export default async function RSUDListPage() {
  const { rsudList, photos } = await loadData();

  return (
    <AppShell title="Data RSUD">
      <RSUDListClient rsudList={rsudList} photos={photos} />
    </AppShell>
  );
}
