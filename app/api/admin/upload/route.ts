import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '@/lib/jwt';

// Configure Cloudinary using server-side environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Session
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // 3. Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<NextResponse>((resolve) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ secure_url: result?.secure_url }));
          }
        }
      ).end(buffer);
    });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
