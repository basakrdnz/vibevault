import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Allow access to public routes
  if (nextUrl.pathname.startsWith('/api/auth') || 
      nextUrl.pathname === '/' ||
      nextUrl.pathname.startsWith('/login') ||
      nextUrl.pathname.startsWith('/register')) {
    return NextResponse.next();
  }
  
  // Require authentication for protected routes
  if (!isLoggedIn && (
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/watchlist') ||
    nextUrl.pathname.startsWith('/movies') ||
    nextUrl.pathname.startsWith('/mood-tracker') ||
    nextUrl.pathname.startsWith('/profile') ||
    nextUrl.pathname.startsWith('/recommendations')
  )) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/watchlist/:path*',
    '/movies/:path*',
    '/mood-tracker/:path*',
    '/profile/:path*',
    '/recommendations/:path*',
    '/api/auth/register',
  ],
};
