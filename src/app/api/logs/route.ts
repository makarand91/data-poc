import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { getLogs } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const category = req.nextUrl.searchParams.get('category') || undefined;
  const logs = getLogs(userId, category);
  return NextResponse.json({ logs });
}
