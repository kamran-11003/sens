import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const role = (session.user as any).role
  const userId = (session.user as any).id

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      teacher: { select: { id: true, name: true, email: true } },
      subtasks: { orderBy: { createdAt: "asc" } },
      documents: { orderBy: { createdAt: "asc" } },
      messages: {
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      submissions: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (role === "TEACHER" && task.teacherId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(task)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const role = (session.user as any).role
  const body = await req.json()

  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data: Record<string, unknown> = {}
  if (role === "ADMIN") {
    if (body.title !== undefined) data.title = body.title
    if (body.description !== undefined) data.description = body.description
    if (body.deadline !== undefined) data.deadline = body.deadline ? new Date(body.deadline) : null
    if (body.priority !== undefined) data.priority = body.priority
    if (body.status !== undefined) data.status = body.status
  } else if (role === "TEACHER") {
    if (task.teacherId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (body.status !== undefined) data.status = body.status
  }

  const updated = await prisma.task.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params
  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
