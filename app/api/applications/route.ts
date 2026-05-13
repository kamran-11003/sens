import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const applications = await prisma.programApplication.findMany({
    include: { program: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(applications)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { programId, name, dob, gender, fatherName, cnic, lastInstitution, grade, percentage, phone, email, address } = body

  if (!programId || !name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 })

  const application = await prisma.programApplication.create({
    data: { programId, name, dob, gender, fatherName, cnic, lastInstitution, grade, percentage, phone, email, address },
  })
  return NextResponse.json(application, { status: 201 })
}
