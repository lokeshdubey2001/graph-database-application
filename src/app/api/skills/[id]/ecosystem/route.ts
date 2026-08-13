import { NextResponse } from 'next/server';
import { getSkillEcosystem } from '@/lib/queries/skills';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    const data = await getSkillEcosystem(id.trim());
    if (!data) {
      return NextResponse.json({ error: `Skill '${id}' not found` }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
