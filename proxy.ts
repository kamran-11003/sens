import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "./auth.config"

// Use edge-compatible authConfig (no Prisma adapter) for the proxy
const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl
  const isAuthenticated = !!session?.user

  // Redirect authenticated admin away from /admin login page
  if (pathname === "/admin" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  // Protect /dashboard — redirect unauthenticated to /admin
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Skip Next.js internals, static assets, and NextAuth API routes
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)).*)",
  ],
}
