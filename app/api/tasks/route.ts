import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const role = (session.user as any).role
  const userId = (session.user as any).id

  if (role === "ADMIN") {
    const tasks = await prisma.task.findMany({
      include: {
        teacher: { select: { id: true, name: true, email: true } },
        subtasks: true,
        documents: true,
        _count: { select: { messages: true, submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(tasks)
  }

  if (role === "TEACHER") {
    const tasks = await prisma.task.findMany({
      where: { teacherId: userId },
      include: {
        subtasks: true,
        documents: true,
        _count: { select: { messages: true, submissions: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(tasks)
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { title, description, teacherId, deadline, priority, subtasks, documentUrls } = await req.json()

  if (!title || !teacherId) {
    return NextResponse.json({ error: "Title and teacher are required" }, { status: 400 })
  }

  const task = await prisma.task.create({
    data: {
      title,
      description: description ?? "",
      teacherId,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority ?? "MEDIUM",
      status: "PENDING",
      subtasks: subtasks?.length
        ? { create: (subtasks as string[]).filter(Boolean).map((t) => ({ title: t })) }
        : undefined,
      documents: documentUrls?.length
        ? { create: (documentUrls as { name: string; url: string }[]).map((d) => ({ name: d.name, url: d.url })) }
        : undefined,
    },
    include: { subtasks: true, documents: true },
  })

  return NextResponse.json(task, { status: 201 })
}
