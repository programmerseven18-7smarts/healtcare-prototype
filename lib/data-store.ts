import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { get, put } from '@vercel/blob';
import type { AppData } from './data-model';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'app-data.json');
const BLOB_DATA_PATH = 'data/app-data.json';

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
  if (hasBlobToken()) {
    try {
      const blob = await get(BLOB_DATA_PATH, { access: 'public', useCache: false });
      if (blob?.statusCode === 200) {
        const raw = await streamToText(blob.stream);
        return mergeDefaultData(JSON.parse(raw) as AppData);
      }
    } catch (error) {
      console.error('Blob data load error:', error);
    }
  }

  try {
    const raw = await readFile(DATA_FILE_PATH, 'utf8');
    return mergeDefaultData(JSON.parse(raw) as AppData);
  } catch {
    return createDefaultData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  if (hasBlobToken()) {
    await put(BLOB_DATA_PATH, JSON.stringify(data, null, 2), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function createDefaultData(): AppData {
  return {
    rsudList: DEFAULT_DATA.rsudList.map((rsud) => ({ ...rsud })),
    photos: [],
  };
}

function mergeDefaultData(data: AppData): AppData {
  const merged: AppData = {
    rsudList: Array.isArray(data.rsudList) ? [...data.rsudList] : [],
    photos: Array.isArray(data.photos) ? [...data.photos] : [],
  };

  const existingIds = new Set(merged.rsudList.map((r) => r.id));
  for (const r of DEFAULT_DATA.rsudList) {
    if (!existingIds.has(r.id)) merged.rsudList.push({ ...r });
  }

  return merged;
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  result += decoder.decode();
  return result;
}
