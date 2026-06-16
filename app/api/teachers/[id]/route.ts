import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import bcrypt from "bcryptjs"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  const { name, email, password } = await req.json()

  const data: Record<string, string> = {}
  if (name) data.name = name
  if (email) data.email = email
  if (password) data.password = await bcrypt.hash(password, 12)

  const user = await prisma.user.update({ where: { id }, data })
  return NextResponse.json({ id: user.id, name: user.name, email: user.email })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params

  // Unlink faculty profile first
  await prisma.facultyMember.updateMany({ where: { userId: id }, data: { userId: null } })
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
