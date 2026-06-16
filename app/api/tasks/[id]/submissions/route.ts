import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: taskId } = await params

  const submissions = await prisma.taskSubmission.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(submissions)
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id: taskId } = await params
  const userId = (session.user as any).id

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.teacherId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { name, url, fileType } = await req.json()

  if (!name || !url) {
    return NextResponse.json({ error: "Name and URL required" }, { status: 400 })
  }

  const submission = await prisma.taskSubmission.create({
    data: { name, url, fileType: fileType ?? "other", taskId },
  })

  return NextResponse.json(submission, { status: 201 })
}
