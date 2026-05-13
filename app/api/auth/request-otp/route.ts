import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/mailer"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({ max: 3, windowMs: 10 * 60 * 1000 })

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown"
  const { allowed, retryAfter } = limiter.check(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${retryAfter} seconds.` },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const email = (body?.email ?? "").trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    // Check user exists — always return 200 to avoid email enumeration
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // Invalidate any existing OTPs for this email
    await prisma.passwordResetOtp.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.passwordResetOtp.create({
      data: { email, otp, expiresAt },
    })

    await sendOtpEmail(email, otp)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[request-otp]", err)
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 })
  }
}
