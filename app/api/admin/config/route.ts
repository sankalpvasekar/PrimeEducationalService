import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  const configs = await query('SELECT * FROM site_config LIMIT 1');
  return NextResponse.json(configs[0] || {});
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { hero_image_url, company_info_pdf_url, preparation_pdf_url, price } = body;

    await query(`
      UPDATE site_config 
      SET hero_image_url = $1, company_info_pdf_url = $2, preparation_pdf_url = $3, price = $4
      WHERE id = 1
    `, [hero_image_url, company_info_pdf_url, preparation_pdf_url, price]);

    return NextResponse.json({ success: true, message: 'Configuration updated!' });
  } catch (err) {
    console.error('Config Update Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
