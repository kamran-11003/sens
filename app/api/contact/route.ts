import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({ max: 5, windowMs: 60 * 1000 }) // 5 per minute per IP

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(submissions)
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

  const body = await req.json()
  const { name, email, phone, subject, message } = body
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const submission = await prisma.contactSubmission.create({
    data: { name, email, phone: phone ?? "", subject, message },
  })
  return NextResponse.json(submission, { status: 201 })
}

