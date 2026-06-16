import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({ max: 5, windowMs: 60 * 1000 })

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const apps = await prisma.scholarshipApplication.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(apps)
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch scholarship applications" }, { status: 500 })
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
    const { scholarshipName, firstName, lastName, phone, documentUrl, documentType } = body

    if (
      !scholarshipName?.trim() ||
      !firstName?.trim() ||
      !lastName?.trim() ||
      !phone?.trim() ||
      !documentUrl?.trim() ||
      !documentType?.trim()
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const app = await prisma.scholarshipApplication.create({
      data: {
        scholarshipName: scholarshipName.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        documentUrl: documentUrl.trim(),
        documentType: documentType.trim(),
        status: "PENDING",
      },
    })

    return NextResponse.json(app, { status: 201 })
  } catch (err: any) {
    console.error("Submit scholarship application error:", err)
    return NextResponse.json({ error: "Failed to submit application: " + err.message }, { status: 500 })
  }
}
