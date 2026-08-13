import { NextResponse } from 'next/server';
import { getRelatedDevelopers } from '@/lib/queries/developers';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getRelatedDevelopers(id);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch related developers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
