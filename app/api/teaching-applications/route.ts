import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({ max: 3, windowMs: 60 * 1000 }) // 3 per minute per IP

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const apps = await prisma.teachingApplication.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(apps)
  } catch {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const { allowed, retryAfter } = limiter(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  try {
    const body = await req.json()
    const { name, email, phone, subject, experience, qualification, message } = body

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !subject?.trim() || !experience?.trim() || !qualification?.trim()) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { cvUrl } = body
    const app = await prisma.teachingApplication.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject.trim(),
        experience: experience.trim(),
        qualification: qualification.trim(),
        message: message?.trim() || "",
        cvUrl: cvUrl?.trim() || "",
      },
    })
    return NextResponse.json(app, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}

