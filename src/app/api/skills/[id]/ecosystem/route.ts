import { NextResponse } from 'next/server';
import { getSkillEcosystem } from '@/lib/queries/skills';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getSkillEcosystem(id);
    if (!data) {
      return NextResponse.json({ error: 'Skill ecosystem not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch skill ecosystem';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
