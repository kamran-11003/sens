import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { title, category, content, fileName, active } = body

    const doc = await prisma.botDocument.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(fileName !== undefined && { fileName: fileName.trim() }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(doc)
  } catch {
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.botDocument.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
