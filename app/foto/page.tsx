import { AppShell } from '@/components/app-shell';
import { loadData } from '@/lib/data-store';
import { FotoGalleryClient } from './foto-gallery-client';

export const dynamic = 'force-dynamic';

export default async function FotoPage({
  searchParams,
}: {
  searchParams: Promise<{ rsud?: string; milestone?: string }>;
}) {
  const { rsud: filterRsud, milestone: filterMilestone } = await searchParams;
  const { rsudList, photos } = await loadData();

  return (
    <AppShell title="Foto Dokumentasi">
      <FotoGalleryClient
        photos={photos}
        rsudList={rsudList}
        defaultRsudFilter={filterRsud}
        defaultMilestoneFilter={filterMilestone}
      />
    </AppShell>
  );
}
