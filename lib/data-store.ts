import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { list, put } from '@vercel/blob';
import type { AppData } from './data-model';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'app-data.json');

/**
 * Versioned prefix for metadata blobs.
 * Each save writes a NEW blob with a timestamp suffix so no blob is ever
 * overwritten. loadData() always lists and picks the most-recently uploaded
 * one, guaranteeing a fresh read regardless of CDN caching on any fixed path.
 */
const BLOB_DATA_PREFIX = 'data/meta/app-data-';

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
      // List ALL versioned metadata blobs and pick the newest one.
      // Because each save writes to a unique timestamped path, no Vercel
      // edge/CDN caches an older version at the same URL, so we always get
      // the true latest snapshot.
      const latestUrl = await resolveLatestBlobUrl();
      if (latestUrl) {
        // Append a cache-busting query param so even if the HTTP client or
        // a proxy has cached the URL body we force a fresh fetch.
        const res = await fetch(`${latestUrl}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const raw = await res.text();
          return mergeDefaultData(JSON.parse(raw) as AppData);
        }
      }
    } catch (error) {
      console.error('Blob data load error:', error);
    }
  }

  // Fallback: local filesystem (dev environment)
  try {
    const raw = await readFile(DATA_FILE_PATH, 'utf8');
    return mergeDefaultData(JSON.parse(raw) as AppData);
  } catch {
    return createDefaultData();
  }
}

export async function saveData(data: AppData): Promise<void> {
  if (hasBlobToken()) {
    // Write to a unique path so the URL is never reused and therefore never
    // served stale from any CDN cache layer.
    const uniquePath = `${BLOB_DATA_PREFIX}${Date.now()}.json`;
    await put(uniquePath, JSON.stringify(data, null, 2), {
      access: 'public',
      contentType: 'application/json',
      // addRandomSuffix: false — we already have a millisecond-unique name
      addRandomSuffix: false,
    });
    return;
  }

  // Fallback: local filesystem (dev environment)
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Lists all versioned metadata blobs and returns the public URL of the most
 * recently uploaded one, or null if none exist yet.
 */
async function resolveLatestBlobUrl(): Promise<string | null> {
  const { blobs } = await list({ prefix: BLOB_DATA_PREFIX, limit: 1000 });
  if (blobs.length === 0) return null;

  const latest = blobs.sort(
    (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
  )[0];

  return latest.url;
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
