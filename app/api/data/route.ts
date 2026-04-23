import { NextResponse } from 'next/server';
import { loadData } from '@/lib/data-store';

export async function GET() {
  try {
    const data = await loadData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
