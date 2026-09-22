import { NextRequest, NextResponse } from 'next/server';
import { query, initDB } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const configs = await query('SELECT * FROM admins_data LIMIT 1');
    return NextResponse.json(configs[0] || {});
  } catch (err) {
    console.error('Config Fetch Error:', err);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { hero_image_urls, company_info_pdf_urls, preparation_pdf_urls, price } = body;

    await query(`
      UPDATE site_config 
      SET hero_image_urls = $1, company_info_pdf_urls = $2, preparation_pdf_urls = $3, price = $4
      WHERE id = 1
    `, [hero_image_urls, company_info_pdf_urls, preparation_pdf_urls, price]);

    return NextResponse.json({ success: true, message: 'Configuration updated!' });
  } catch (err) {
    console.error('Config Update Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
