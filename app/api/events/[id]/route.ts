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
  const { title, type, date, time, location, description, attendees, image, active } = body
  const event = await prisma.event.update({ where: { id }, data: { title, type, date, time, location, description, attendees, image, active } })
  return NextResponse.json(event)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  await prisma.event.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
