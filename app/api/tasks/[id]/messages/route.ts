import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: taskId } = await params

  const messages = await prisma.taskMessage.findMany({
    where: { taskId },
    include: { user: { select: { name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: taskId } = await params
  const userId = (session.user as any).id
  const role = (session.user as any).role
  const { message } = await req.json()

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 })
  }

  const msg = await prisma.taskMessage.create({
    data: { message: message.trim(), from: role, userId, taskId },
    include: { user: { select: { name: true, role: true } } },
  })

  return NextResponse.json(msg, { status: 201 })
}
