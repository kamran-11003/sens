import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id: taskId } = await params
  const { title } = await req.json()

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 })
  }

  const subtask = await prisma.subtask.create({ data: { title: title.trim(), taskId } })
  return NextResponse.json(subtask, { status: 201 })
}
