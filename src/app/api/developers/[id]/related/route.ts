import { NextResponse } from 'next/server';
import { getRelatedDevelopers } from '@/lib/queries/developers';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return NextResponse.json({ error: 'Developer ID is required' }, { status: 400 });
    }

    const data = await getRelatedDevelopers(id.trim());
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
