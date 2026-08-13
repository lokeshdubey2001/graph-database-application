import { NextResponse } from 'next/server';
import { searchGraph } from '@/lib/queries/search';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    if (!q.trim()) {
      return NextResponse.json({ query: '', developers: [], skills: [], technologies: [] });
    }
    const data = await searchGraph(q);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
