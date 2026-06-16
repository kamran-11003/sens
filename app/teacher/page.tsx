"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, BookOpen } from "lucide-react"
import { signIn } from "next-auth/react"

export default function TeacherLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", { email, password, redirect: false })

      if (result?.error) {
        setError("Invalid credentials. Please try again.")
      } else {
        setSuccess(true)
        router.push("/teacher/dashboard")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1128] flex items-center justify-center p-4">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 blur-[120px] bg-[radial-gradient(circle,#7C3AED_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-30 blur-[120px] bg-[radial-gradient(circle,#1E3A8A_0%,transparent_70%)] pointer-events-none" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <div className="backdrop-blur-2xl bg-[rgba(21,34,67,0.65)] border border-[rgba(124,58,237,0.3)] rounded-[20px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-linear-to-br from-[#7C3AED] to-[#1E3A8A] rounded-xl mb-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Teacher Portal</h2>
            <p className="text-[#94a3b8] text-sm">Sign in to access your LMS dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="teacher@ric.edu.pk"
                className="w-full px-4 py-3 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-sm transition-all focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-sm transition-all focus:outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#94a3b8] hover:text-[#7C3AED] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            {success && <p className="text-emerald-400 text-sm text-center">Authenticated! Redirecting…</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-[#7C3AED] text-white text-base font-bold rounded-lg hover:bg-[#6D28D9] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all cursor-pointer"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#475569]">
            Your login credentials are assigned by your administrator.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
