import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { getUserById, getCreditTransactions, updateCredits } from '@/lib/db';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = getUserById(userId);
  const transactions = getCreditTransactions(userId);
  return NextResponse.json({ credits: user?.credits || 0, transactions });
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const { amount, planName } = body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid credit amount' }, { status: 400 });
  }

  const result = updateCredits(userId, amount, 'credit', `Purchased ${planName || 'credits'} plan — ${amount} credits added`);

  if (!result) {
    return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
  }

  return NextResponse.json({ credits: result.credits, transaction: result.transaction });
}
