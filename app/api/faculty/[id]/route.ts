import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()
  const { name, title: memberTitle, department, bio, specializations, publications, awards, students, image, isDirector, displayOrder } = body
  const member = await prisma.facultyMember.update({ where: { id }, data: { name, title: memberTitle, department, bio, specializations, publications, awards, students, image, isDirector, displayOrder } })
  return NextResponse.json(member)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  await prisma.facultyMember.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
