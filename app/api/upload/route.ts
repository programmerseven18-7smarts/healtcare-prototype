import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';
import { type NextRequest, NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/data-store';
import type { Photo, Milestone } from '@/lib/data-model';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const rsudId = formData.get('rsudId') as string;
    const milestone = formData.get('milestone') as Milestone;
    const name = formData.get('name') as string;
    const location = formData.get('location') as string;
    const notes = formData.get('notes') as string;

    if (!file || !rsudId || !milestone) {
      return NextResponse.json({ error: 'File, rsudId, dan milestone wajib diisi' }, { status: 400 });
    }

    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Vercel Blob belum dikonfigurasi. Tambahkan Blob store ke project Vercel.' },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobPath = `uploads/${rsudId}/${milestone}/${timestamp}_${safeName}`;
    let publicUrl: string;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(blobPath, file, {
        access: 'public',
        contentType: file.type || 'application/octet-stream',
      });
      publicUrl = blob.url;
    } else {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', rsudId, milestone);
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, `${timestamp}_${safeName}`);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      publicUrl = `/${blobPath}`;
    }

    const data = await loadData();

    const photo: Photo = {
      id: `photo-${timestamp}`,
      rsudId,
      milestone,
      name: name || file.name,
      date: new Date().toISOString().split('T')[0],
      location: location || 'Tidak diketahui',
      notes: notes || '',
      blobUrl: publicUrl,
      uploadedAt: new Date().toISOString(),
    };

    data.photos.push(photo);
    await saveData(data);

    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }
}
