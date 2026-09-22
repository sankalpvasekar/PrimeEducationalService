import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ hasPaid: false });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ hasPaid: false });

    const user = await query<{ payment_done: boolean }>('SELECT payment_done FROM users WHERE id = $1', [payload.userId]);
    return NextResponse.json({ hasPaid: user.length > 0 && user[0].payment_done });
  } catch (err) {
    console.error('Check Purchase Error:', err);
    return NextResponse.json({ hasPaid: false });
  }
}
