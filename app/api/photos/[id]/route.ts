import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';
import { loadData, saveData } from '@/lib/data-store';

export const runtime = 'nodejs';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await loadData();
    const photo = data.photos.find((p) => p.id === id);

    if (!photo) {
      return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
    }

    if (photo.blobUrl.startsWith('/uploads/')) {
      const relativePath = photo.blobUrl.replace(/^\/+/, '').split('/').join(path.sep);
      const absolutePath = path.join(process.cwd(), 'public', relativePath.replace(/^uploads[\\/]/, `uploads${path.sep}`));
      await unlink(absolutePath).catch(() => undefined);
    }
    data.photos = data.photos.filter((p) => p.id !== id);
    await saveData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Gagal menghapus foto' }, { status: 500 });
  }
}
