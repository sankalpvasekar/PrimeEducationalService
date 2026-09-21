import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export function middleware(request: Request) {
  const token = cookies().get('auth_token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  
  const payload = verifyToken(token);
  if (!payload || !payload.isAdmin) return NextResponse.redirect(new URL('/', request.url));
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};