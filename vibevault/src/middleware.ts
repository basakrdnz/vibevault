import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow access to public routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET 
  });

  const isLoggedIn = !!token;

  // Require authentication for protected routes
  if (!isLoggedIn && (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/watchlist') ||
    pathname.startsWith('/movies') ||
    pathname.startsWith('/mood-tracker') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/social')
  )) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/watchlist/:path*',
    '/movies/:path*',
    '/mood-tracker/:path*',
    '/profile/:path*',
    '/social/:path*',
  ],
};
