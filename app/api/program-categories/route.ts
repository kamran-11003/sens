import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const categories = await prisma.programCategory.findMany({ orderBy: { label: "asc" } })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const { slug, label } = body
  if (!slug?.trim() || !label?.trim()) {
    return NextResponse.json({ error: "slug and label are required" }, { status: 400 })
  }

  try {
    const cat = await prisma.programCategory.create({
      data: { slug: slug.trim().toLowerCase().replace(/\s+/g, "-"), label: label.trim(), active: body.active ?? true },
    })
    return NextResponse.json(cat, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
  }
}
