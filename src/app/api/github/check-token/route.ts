import { NextResponse } from 'next/server';
import { getAuthInfo } from '@/lib/github';

export async function GET() {
  try {
    const info = await getAuthInfo();
    return NextResponse.json(info);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message || 'Auth check failed' }, { status: 500 });
  }
}

