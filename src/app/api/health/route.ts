import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/neo4j';

export async function GET() {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      return NextResponse.json({ status: 'ok', db: 'connected', result: 1 });
    }
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 500 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', db: 'unreachable', message },
      { status: 500 }
    );
  }
}
