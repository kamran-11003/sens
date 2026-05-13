import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body?.email ?? "").trim().toLowerCase()
    const otp = (body?.otp ?? "").trim()
    const newPassword: string = body?.newPassword ?? ""

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      )
    }

    // Find a valid, unused OTP
    const record = await prisma.passwordResetOtp.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    })

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new one." },
        { status: 400 }
      )
    }

    // Hash new password and update user
    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    })

    // Mark this OTP as used and invalidate all others for this email
    await prisma.passwordResetOtp.updateMany({
      where: { email },
      data: { used: true },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[reset-password]", err)
    return NextResponse.json({ error: "Failed to reset password. Please try again." }, { status: 500 })
  }
}
