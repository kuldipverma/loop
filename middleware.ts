import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Sign in / Sign up route ko allow karo
  if (pathname === "/signup" || pathname === "/login") {
    return NextResponse.next();
  }

  // Session na hone par /signup redirect karo
  if (!session) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};