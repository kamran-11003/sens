import { NextResponse } from "next/server"
import { supabaseAdmin, BUCKETS } from "@/lib/supabase"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const ALLOWED = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg", "image/jpg", "image/png", "image/webp",
  ]
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only PDF, Word, and image files are allowed" }, { status: 400 })
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 20MB" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() ?? "bin"
  const fileName = `task-docs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.taskDocs)
    .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabaseAdmin.storage.from(BUCKETS.taskDocs).getPublicUrl(fileName)
  return NextResponse.json({ url: data.publicUrl, name: file.name })
}
