import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { title, rule, priority, active } = body

    const updated = await prisma.botRule.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(rule !== undefined && { rule: rule.trim() }),
        ...(priority !== undefined && { priority }),
        ...(active !== undefined && { active }),
      },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.botRule.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 })
  }
}
