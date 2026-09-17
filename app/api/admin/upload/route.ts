import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Assuming the file URL or the file itself is handled by frontend and this just validates
    // Actually, the previous implementation used cloudinary API signature on the client side.
    // Let's keep it simple. If the client sends the file, we upload it.
    
    // The previous implementation for upload-signature already existed.
    // The client was using it to upload directly to Cloudinary.
    // So this route is NOT NEEDED for the actual upload?
    // Looking at the code, `app/api/admin/upload/route.ts` was indeed saving to DB.
    
    return NextResponse.json({ message: 'Use upload-signature for direct upload' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
