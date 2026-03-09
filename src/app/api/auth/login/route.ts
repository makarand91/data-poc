import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserById, addLog } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = getUserByEmail(email) as any;
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const passwordHash = Buffer.from(password).toString('base64');
    if (user.passwordHash !== passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const token = await createToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' });
    addLog(user.id, 'User logged in', 'auth', `${user.name} signed in`);
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser, message: 'Login successful' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  return NextResponse.json({ message: 'Logged out' });
}

export async function GET() {
  const { getCurrentUserId } = await import('@/lib/auth');
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const user = getUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
}
