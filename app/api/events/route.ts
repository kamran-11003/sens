import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const events = await prisma.event.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const body = await req.json()
  const event = await prisma.event.create({ data: body })
  return NextResponse.json(event, { status: 201 })
}
