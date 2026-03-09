import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, company } = await req.json();
    if (!email || !password || !name || !company) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    // Simple hash for mock (not production-safe)
    const passwordHash = Buffer.from(password).toString('base64');
    const user = createUser(email, name, company, passwordHash);
    const token = await createToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60, path: '/' });
    return NextResponse.json({ user, message: 'Registration successful' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
