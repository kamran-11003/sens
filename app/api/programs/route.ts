import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const programs = await prisma.program.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
  })
  return NextResponse.json(programs)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const { title, category, shortDesc, fullDesc, duration, highlights, iconName, color, active } = body
  if (!title?.trim() || !category?.trim()) {
    return NextResponse.json({ error: "title and category are required" }, { status: 400 })
  }
  const program = await prisma.program.create({
    data: { title, category, shortDesc: shortDesc ?? "", fullDesc: fullDesc ?? "", duration: duration ?? "", highlights: highlights ?? [], iconName: iconName ?? "", color: color ?? "#1E3A8A", active: active ?? true },
  })
  return NextResponse.json(program, { status: 201 })
}
