import { NextResponse } from 'next/server';
import { getDeveloperById } from '@/lib/queries/developers';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return NextResponse.json({ error: 'Developer ID is required' }, { status: 400 });
    }

    const data = await getDeveloperById(id.trim());
    if (!data) {
      return NextResponse.json({ error: `Developer '${id}' not found` }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
