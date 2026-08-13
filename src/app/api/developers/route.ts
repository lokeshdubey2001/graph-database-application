import { NextResponse } from 'next/server';
import { getDevelopers } from '@/lib/queries/developers';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get('skill')?.trim() || undefined;
    const tech = searchParams.get('tech')?.trim() || undefined;

    const developers = await getDevelopers({ skill, tech });
    return NextResponse.json({ developers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
