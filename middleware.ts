import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "junto_ops_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "junto-fallback-super-secure-session-key-32chars";
  return new TextEncoder().encode(secret.padEnd(32, "0").slice(0, 32));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      if (payload && payload.authenticated === true) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Root route handling
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 2. Protect /dashboard and all /dashboard/* subpaths
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. Redirect authenticated users away from /login to /dashboard
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
  ],
};
