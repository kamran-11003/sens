import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const rules = await prisma.botRule.findMany({ orderBy: { priority: "desc" } })
    return NextResponse.json(rules)
  } catch {
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, rule, priority, active } = body

    if (!title?.trim() || !rule?.trim()) {
      return NextResponse.json({ error: "Title and rule text are required" }, { status: 400 })
    }

    const created = await prisma.botRule.create({
      data: {
        title: title.trim(),
        rule: rule.trim(),
        priority: priority ?? 0,
        active: active ?? true,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 })
  }
}
