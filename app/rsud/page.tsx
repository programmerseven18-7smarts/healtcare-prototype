import { AppShell } from '@/components/app-shell';
import { RSUDListClient } from '@/components/rsud-list-client';
import { loadData } from '@/lib/data-store';
import { withDerivedProgress } from '@/lib/progress';

export const dynamic = 'force-dynamic';

export default async function RSUDListPage() {
  const { rsudList, photos } = await loadData();
  const derivedRsudList = withDerivedProgress(rsudList, photos);

  return (
    <AppShell title="Data RSUD">
      <RSUDListClient rsudList={derivedRsudList} photos={photos} />
    </AppShell>
  );
}
