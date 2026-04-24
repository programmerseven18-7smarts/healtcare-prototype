import { MILESTONES, type Milestone, type Photo, type RSUD } from './data-model';

export type DerivedRSUD = RSUD & {
  progress: number;
  status: RSUD['status'];
};

export function getCompletedMilestones(rsudId: string, photos: Photo[]): Set<Milestone> {
  return new Set(
    photos
      .filter((photo) => photo.rsudId === rsudId)
      .map((photo) => photo.milestone)
  );
}

export function getRsudProgress(rsudId: string, photos: Photo[]): number {
  const completed = getCompletedMilestones(rsudId, photos).size;
  return Math.round((completed / MILESTONES.length) * 100);
}

export function getRsudStatus(rsudId: string, photos: Photo[]): RSUD['status'] {
  const completed = getCompletedMilestones(rsudId, photos).size;
  if (completed === 0) return 'Pending';
  if (completed >= MILESTONES.length) return 'Selesai';
  return 'Aktif';
}

export function withDerivedProgress(rsudList: RSUD[], photos: Photo[]): DerivedRSUD[] {
  return rsudList.map((rsud) => ({
    ...rsud,
    progress: getRsudProgress(rsud.id, photos),
    status: getRsudStatus(rsud.id, photos),
  }));
}

export function isMilestoneComplete(rsudId: string, milestone: Milestone, photos: Photo[]) {
  return photos.some((photo) => photo.rsudId === rsudId && photo.milestone === milestone);
}
