import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const docs = await prisma.botDocument.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(docs)
  } catch {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, category, content, fileName, active } = body

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const doc = await prisma.botDocument.create({
      data: {
        title: title.trim(),
        category: category?.trim() || "general",
        content: content.trim(),
        fileName: fileName?.trim() || "",
        active: active ?? true,
      },
    })
    return NextResponse.json(doc, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}
