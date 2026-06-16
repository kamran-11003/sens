import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const session = (req as any).auth
  const role = session?.user?.role as string | undefined
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/teacher/dashboard")) {
    if (!session) return NextResponse.redirect(new URL("/teacher", req.url))
    if (role !== "TEACHER") return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect(new URL("/admin", req.url))
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/teacher/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/teacher/dashboard/:path*"],
}
