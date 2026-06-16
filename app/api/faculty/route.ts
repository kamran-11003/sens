import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const faculty = await prisma.facultyMember.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      user: { select: { id: true, email: true, name: true } },
    },
  })
  return NextResponse.json(faculty)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const member = await prisma.facultyMember.create({ data: body })
  return NextResponse.json(member, { status: 201 })
}
