import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { getABMResults, saveABMResults, updateCredits, addLog } from '@/lib/db';
import { getABMCompanies } from '@/lib/mock-ai';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const results = getABMResults(userId);
  return NextResponse.json({ results });
}

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const companies = getABMCompanies(5);
  const saved = saveABMResults(userId, companies);
  updateCredits(userId, 10, 'debit', 'ABM lookalike search');
  addLog(userId, 'ABM Search', 'abm', `Found ${companies.length} lookalike companies via suggestions page`, {}, 10);
  return NextResponse.json({ results: saved, creditsUsed: 10 });
}
