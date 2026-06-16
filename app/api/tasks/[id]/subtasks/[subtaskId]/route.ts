import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; subtaskId: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: taskId, subtaskId } = await params
  const role = (session.user as any).role
  const userId = (session.user as any).id

  if (role === "TEACHER") {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task || task.teacherId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  const body = await req.json()
  const data: Record<string, unknown> = {}

  if (body.done !== undefined) data.done = body.done
  if (role === "ADMIN" && body.title !== undefined) data.title = body.title

  const subtask = await prisma.subtask.update({ where: { id: subtaskId }, data })
  return NextResponse.json(subtask)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; subtaskId: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { subtaskId } = await params
  await prisma.subtask.delete({ where: { id: subtaskId } })
  return NextResponse.json({ ok: true })
}
