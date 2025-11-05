import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/backoffice/login', '/backoffice/register'];
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Check if the request is for backoffice routes (except public routes)
  if (pathname.startsWith('/backoffice') && !isPublicRoute) {
    // Check for auth token in cookies
    const authToken = request.cookies.get('auth_token');
    
    // If no token, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/backoffice/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and trying to access login or register page, redirect to dashboard
  if (isPublicRoute) {
    const authToken = request.cookies.get('auth_token');
    if (authToken) {
      const dashboardUrl = new URL('/backoffice', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes should be protected
export const config = {
  matcher: [
    '/backoffice/:path*',
  ],
};

