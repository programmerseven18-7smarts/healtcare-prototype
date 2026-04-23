import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { AppData } from './data-model';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'app-data.json');

const DEFAULT_DATA: AppData = {
  rsudList: [
    {
      id: 'rsud-1',
      name: 'RSUD Dr. Soetomo',
      kota: 'Surabaya',
      provinsi: 'Jawa Timur',
      status: 'Aktif',
      progress: 65,
    },
    {
      id: 'rsud-2',
      name: 'RSUD Tarakan',
      kota: 'Jakarta',
      provinsi: 'DKI Jakarta',
      status: 'Aktif',
      progress: 40,
    },
    {
      id: 'rsud-3',
      name: 'RSUD Arifin Achmad',
      kota: 'Pekanbaru',
      provinsi: 'Riau',
      status: 'Selesai',
      progress: 100,
    },
    {
      id: 'rsud-4',
      name: 'RSUD Abdul Wahab Sjahranie',
      kota: 'Samarinda',
      provinsi: 'Kalimantan Timur',
      status: 'Pending',
      progress: 10,
    },
    {
      id: 'rsud-5',
      name: 'RSUD Dr. Wahidin Sudirohusodo',
      kota: 'Makassar',
      provinsi: 'Sulawesi Selatan',
      status: 'Aktif',
      progress: 55,
    },
  ],
  photos: [],
};

export async function loadData(): Promise<AppData> {
  try {
    const raw = await readFile(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(raw) as AppData;
    // Merge in case new default RSUDs were added
    const existingIds = new Set(data.rsudList.map((r) => r.id));
    for (const r of DEFAULT_DATA.rsudList) {
      if (!existingIds.has(r.id)) data.rsudList.push(r);
    }
    return data;
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export async function saveData(data: AppData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}
