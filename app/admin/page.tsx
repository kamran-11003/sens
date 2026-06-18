"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { signIn } from "next-auth/react"
import { AuthCanvas } from "@/components/auth/auth-canvas"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authSuccess, setAuthSuccess] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setFormVisible(true)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleDrawComplete = useCallback(() => {
    setFormVisible(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthSuccess(false)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError("Invalid credentials. Access denied.")
      } else {
        setAuthSuccess(true)
        router.push("/dashboard")
      }
    } catch {
      setAuthError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a1128] font-(--font-inter) overflow-y-auto flex items-center justify-center md:justify-end p-4 md:p-8">
      {/* Ambient Glow */}
      <div className="absolute -top-50 -right-25 w-150 h-150 rounded-full opacity-40 blur-[100px] bg-[radial-gradient(circle,#f5b041_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-75 -left-50 w-200 h-200 rounded-full opacity-40 blur-[100px] bg-[radial-gradient(circle,#2e4a8f_0%,transparent_70%)] pointer-events-none" />

      {/* Canvas Animation */}
      {!isMobile && <AuthCanvas formHeight={400} onDrawComplete={handleDrawComplete} />}

      {/* Auth Form */}
      <motion.div
        className="relative md:absolute md:bottom-4 md:right-4 w-full max-w-md z-20"
        initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 20 }}
        animate={formVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.8,
          ease: [0.175, 0.885, 0.32, 1.275],
        }}
        style={{ pointerEvents: formVisible ? "auto" : "none" }}
      >

        <div className="backdrop-blur-2xl bg-[rgba(21,34,67,0.65)] border border-[rgba(245,176,65,0.3)] rounded-[20px] p-6 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-linear-to-br from-[#f5b041] to-[#d68910] rounded-xl mb-3">
              <ShieldCheck className="w-6 h-6 text-[#0a1128]" />
            </div>
            <h2 className="font-(--font-poppins) text-2xl font-bold text-white mb-1">
              Admin Portal
            </h2>
            <p className="text-[#94a3b8] text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin@ric.edu.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-[0.95rem] transition-all focus:outline-none focus:border-[#f5b041] focus:shadow-[0_0_0_3px_rgba(245,176,65,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-[0.95rem] transition-all focus:outline-none focus:border-[#f5b041] focus:shadow-[0_0_0_3px_rgba(245,176,65,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 flex items-center justify-center text-[#94a3b8] hover:text-[#f5b041] transition-colors bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-red-500 text-sm text-center mt-2">{authError}</p>
              )}
              {authSuccess && (
                <p className="text-emerald-500 text-sm text-center mt-2">
                  Authentication successful! Redirecting...
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-[#f5b041] text-[#0a1128] font-(--font-poppins) text-base font-bold rounded-lg hover:bg-[#f39c12] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all cursor-pointer"
              >
                {isLoading ? "Authenticating..." : "Sign In"}
              </button>

            </form>


        </div>
      </motion.div>
    </div>
  )
}
