import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/rate-limit"

const limiter = rateLimit({ max: 5, windowMs: 60 * 1000 }) // 5 per minute per IP

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const apps = await prisma.scholarshipApplication.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(apps)
  } catch (err: any) {
    console.error("Fetch scholarship applications error:", err)
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
    const {
      scholarshipName,
      name,
      dob,
      gender,
      fatherName,
      cnic,
      lastInstitution,
      grade,
      percentage,
      phone,
      email,
      address,
      documentUrl,
      documentType,
    } = body

    // Validate required fields
    if (
      !scholarshipName?.trim() ||
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !cnic?.trim() ||
      !lastInstitution?.trim() ||
      !grade?.trim() ||
      !percentage?.trim() ||
      !documentUrl?.trim() ||
      !documentType?.trim()
    ) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const app = await prisma.scholarshipApplication.create({
      data: {
        scholarshipName: scholarshipName.trim(),
        name: name.trim(),
        dob: dob.trim(),
        gender: gender.trim(),
        fatherName: fatherName.trim(),
        cnic: cnic.trim(),
        lastInstitution: lastInstitution.trim(),
        grade: grade.trim(),
        percentage: percentage.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address?.trim() || "",
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
