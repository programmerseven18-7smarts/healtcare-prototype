export type Milestone =
  | 'Site Preparation'
  | 'Installation'
  | 'Training'
  | 'Commissioning';

export const MILESTONES: Milestone[] = [
  'Site Preparation',
  'Installation',
  'Training',
  'Commissioning',
];

export interface Photo {
  id: string;
  rsudId: string;
  milestone: Milestone;
  name: string;
  date: string;
  location: string;
  notes: string;
  blobUrl: string;
  uploadedAt: string;
}

export interface RSUD {
  id: string;
  name: string;
  kota: string;
  provinsi: string;
  status: 'Aktif' | 'Selesai' | 'Pending';
  progress: number;
}

export interface AppData {
  rsudList: RSUD[];
  photos: Photo[];
}
