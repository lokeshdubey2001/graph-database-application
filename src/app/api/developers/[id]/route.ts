import { NextResponse } from 'next/server';
import { getDeveloperById } from '@/lib/queries/developers';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getDeveloperById(id);
    if (!data) {
      return NextResponse.json({ error: 'Developer not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch developer profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
