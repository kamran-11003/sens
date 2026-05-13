import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible NextAuth config.
 * No database / Node.js-only imports here — this file runs in the
 * Edge Runtime (middleware) AND as the base for auth.ts (Node runtime).
 */
export const authConfig = {
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
} satisfies NextAuthConfig
