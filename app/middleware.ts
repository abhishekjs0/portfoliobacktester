import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isProtectedRoute } from "./lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  if (isProtectedRoute(pathname)) {
    // Check if user is authenticated
    const token = request.cookies.get("next-auth.session-token")?.value;
    
    if (!token) {
      // Not authenticated, redirect to login
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};