import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({ max: 5, windowMs: 60 * 1000 }) // 5 per minute per IP

// Admin: list all event registrations (with the event they belong to)
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const regs = await prisma.eventRegistration.findMany({
      orderBy: { createdAt: "desc" },
      include: { event: { select: { title: true, type: true, date: true } } },
    })
    return NextResponse.json(regs)
  } catch {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}

// Public: register for an event (minimal info)
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const { allowed, retryAfter } = limiter(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before registering again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  try {
    const body = await req.json()
    const { eventId, name, phone, email, note } = body

    if (!eventId?.trim() || !name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Name and phone number are required" }, { status: 400 })
    }

    if (email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
      }
    }

    // Ensure the event exists and is open for registration
    const event = await prisma.event.findUnique({ where: { id: eventId.trim() } })
    if (!event || !event.active) {
      return NextResponse.json({ error: "This event is not available for registration" }, { status: 404 })
    }

    const reg = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim().toLowerCase() || "",
        note: note?.trim() || "",
      },
    })
    return NextResponse.json(reg, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to register. Please try again." }, { status: 500 })
  }
}
