import { NextResponse } from 'next/server';
import { getTechnologies } from '@/lib/queries/skills';

export async function GET() {
  try {
    const data = await getTechnologies();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
