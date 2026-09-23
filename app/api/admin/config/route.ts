import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const configs = await query<any>('SELECT * FROM admins_data LIMIT 1');
    return NextResponse.json(configs[0] || { hero_images: [], company_pdfs: [], preparation_pdfs: [], price: 499, highlight_text: '500+ Companies Trusted Us' });
  } catch (err) {
    console.error('Config Fetch Error:', err);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    
    // Fetch current data to merge
    const current = await query<any>('SELECT * FROM admins_data LIMIT 1');
    const existing = current[0] || { hero_images: [], company_pdfs: [], preparation_pdfs: [], price: 499, highlight_text: '500+ Companies Trusted Us' };

    // Merge incoming data with existing data
    const hero_images = body.hero_images !== undefined ? body.hero_images : (existing.hero_images || []);
    const company_pdfs = body.company_pdfs !== undefined ? body.company_pdfs : (existing.company_pdfs || []);
    const preparation_pdfs = body.preparation_pdfs !== undefined ? body.preparation_pdfs : (existing.preparation_pdfs || []);
    const price = body.price !== undefined ? body.price : (existing.price || 499);
    const highlight_text = body.highlight_text !== undefined ? body.highlight_text : (existing.highlight_text || '500+ Companies Trusted Us');

    // Update DB
    await query(`
      UPDATE admins_data 
      SET hero_images = $1, company_pdfs = $2, preparation_pdfs = $3, price = $4, highlight_text = $5
      WHERE id = 1
    `, [JSON.stringify(hero_images), JSON.stringify(company_pdfs), JSON.stringify(preparation_pdfs), price, highlight_text]);

    return NextResponse.json({ success: true, message: 'Configuration updated!' });
  } catch (err) {
    console.error('Config Update Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}