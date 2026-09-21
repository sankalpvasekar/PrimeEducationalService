import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ hasPaid: false });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ hasPaid: false });

    const purchase = await query('SELECT id FROM purchases WHERE user_id = $1 AND status = $2', [payload.userId, 'success']);
    return NextResponse.json({ hasPaid: purchase.length > 0 });
  } catch (err) {
    console.error('Check Purchase Error:', err);
    return NextResponse.json({ hasPaid: false });
  }
}
