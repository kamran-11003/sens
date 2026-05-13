"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { signIn } from "next-auth/react"
import { AuthCanvas } from "@/components/auth/auth-canvas"

type Step = "login" | "email" | "otp"

export default function AdminLoginPage() {
  const router = useRouter()
  // Login state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authSuccess, setAuthSuccess] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  // Password reset state
  const [step, setStep] = useState<Step>("login")
  const [resetEmail, setResetEmail] = useState("")
  const [resetOtp, setResetOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState("")

  const handleDrawComplete = useCallback(() => {
    setFormVisible(true)
  }, [])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setResetLoading(true)
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResetError(data.error ?? "Failed to send OTP.")
      } else {
        setStep("otp")
      }
    } catch {
      setResetError("Network error. Please try again.")
    } finally {
      setResetLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.")
      return
    }
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters.")
      return
    }
    setResetLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, otp: resetOtp, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setResetError(data.error ?? "Failed to reset password.")
      } else {
        setResetSuccess("Password reset successfully! You can now sign in.")
        setTimeout(() => {
          setStep("login")
          setResetEmail("")
          setResetOtp("")
          setNewPassword("")
          setConfirmPassword("")
          setResetSuccess("")
        }, 2500)
      }
    } catch {
      setResetError("Network error. Please try again.")
    } finally {
      setResetLoading(false)
    }
  }

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
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a1128] font-(--font-inter)">
      {/* Ambient Glow */}
      <div className="absolute -top-50 -right-25 w-150 h-150 rounded-full opacity-40 blur-[100px] bg-[radial-gradient(circle,#f5b041_0%,transparent_70%)]" />
      <div className="absolute -bottom-75 -left-50 w-200 h-200 rounded-full opacity-40 blur-[100px] bg-[radial-gradient(circle,#2e4a8f_0%,transparent_70%)]" />

      {/* Canvas Animation */}
      <AuthCanvas formHeight={400} onDrawComplete={handleDrawComplete} />

      {/* Auth Form */}
      <motion.div
        className="absolute bottom-4 right-4 w-full max-w-115 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={formVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.8,
          ease: [0.175, 0.885, 0.32, 1.275],
        }}
        style={{ pointerEvents: formVisible ? "auto" : "none" }}
      >
        <div className="backdrop-blur-2xl bg-[rgba(21,34,67,0.65)] border border-[rgba(245,176,65,0.3)] rounded-[20px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-11 h-11 bg-linear-to-br from-[#f5b041] to-[#d68910] rounded-xl mb-3">
              <ShieldCheck className="w-6 h-6 text-[#0a1128]" />
            </div>
            <h2 className="font-(--font-poppins) text-2xl font-bold text-white mb-1">
              {step === "login" ? "Admin Portal" : "Reset Password"}
            </h2>
            <p className="text-[#94a3b8] text-sm">
              {step === "login" && "Sign in to access the admin dashboard"}
              {step === "email" && "Enter your admin email to receive an OTP"}
              {step === "otp" && "Enter the OTP sent to your email"}
            </p>
          </div>

          {/* Step: Login */}
          {step === "login" && (
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

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setResetError(""); setResetSuccess("") }}
                  className="text-[#94a3b8] text-sm hover:text-[#f5b041] transition-colors bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* Step: Enter Email */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin@ric.edu.pk"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-[0.95rem] transition-all focus:outline-none focus:border-[#f5b041] focus:shadow-[0_0_0_3px_rgba(245,176,65,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                />
              </div>

              {resetError && (
                <p className="text-red-500 text-sm text-center">{resetError}</p>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 mt-2 bg-[#f5b041] text-[#0a1128] font-(--font-poppins) text-base font-bold rounded-lg hover:bg-[#f39c12] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all cursor-pointer"
              >
                {resetLoading ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => { setStep("login"); setResetError("") }}
                  className="text-[#94a3b8] text-sm hover:text-[#f5b041] transition-colors bg-transparent border-none cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Step: Enter OTP + New Password */}
          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">
                  OTP Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={resetOtp}
                  onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-[0.95rem] tracking-widest text-center transition-all focus:outline-none focus:border-[#f5b041] focus:shadow-[0_0_0_3px_rgba(245,176,65,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                />
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-[0.95rem] transition-all focus:outline-none focus:border-[#f5b041] focus:shadow-[0_0_0_3px_rgba(245,176,65,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 flex items-center justify-center text-[#94a3b8] hover:text-[#f5b041] transition-colors bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-[#e2e8f0] mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[rgba(10,17,40,0.5)] border border-white/10 rounded-lg text-white text-[0.95rem] transition-all focus:outline-none focus:border-[#f5b041] focus:shadow-[0_0_0_3px_rgba(245,176,65,0.2)] focus:bg-[rgba(10,17,40,0.8)] placeholder:text-[#475569]"
                />
              </div>

              {resetError && (
                <p className="text-red-500 text-sm text-center">{resetError}</p>
              )}
              {resetSuccess && (
                <p className="text-emerald-500 text-sm text-center">{resetSuccess}</p>
              )}

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3 mt-2 bg-[#f5b041] text-[#0a1128] font-(--font-poppins) text-base font-bold rounded-lg hover:bg-[#f39c12] hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all cursor-pointer"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center mt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setResetError(""); setResetOtp("") }}
                  className="text-[#94a3b8] text-sm hover:text-[#f5b041] transition-colors bg-transparent border-none cursor-pointer"
                >
                  Resend OTP
                </button>
                <span className="text-[#334155] text-sm">|</span>
                <button
                  type="button"
                  onClick={() => { setStep("login"); setResetError(""); setResetOtp(""); setNewPassword(""); setConfirmPassword("") }}
                  className="text-[#94a3b8] text-sm hover:text-[#f5b041] transition-colors bg-transparent border-none cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
