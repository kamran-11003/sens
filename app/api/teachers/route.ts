import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      facultyProfile: {
        select: { id: true, name: true, title: true, department: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(teachers)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { name, email, password, facultyMemberId } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "TEACHER" },
  })

  if (facultyMemberId) {
    await prisma.facultyMember.update({
      where: { id: facultyMemberId },
      data: { userId: user.id },
    })
  }

  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
}
