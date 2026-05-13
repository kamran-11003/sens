import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
  const isOnAdmin = nextUrl.pathname === "/admin"

  // Protect /dashboard — redirect to /admin if not authenticated
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL("/admin", nextUrl))
  }

  // Redirect /admin to /dashboard if already logged in
  if (isOnAdmin && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/admin"],
}
