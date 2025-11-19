import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIX = "/backoffice";
const PUBLIC_PATHS = ["/backoffice/login", "/backoffice/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }

  const hasToken = Boolean(request.cookies.get("auth_token"));
  const isPublicRoute = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (isPublicRoute) {
    if (hasToken) {
      const dashboardUrl = new URL("/backoffice", request.nextUrl.origin);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  if (!hasToken) {
    const loginUrl = new URL("/backoffice/login", request.nextUrl.origin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/backoffice/:path*"],
};


