import { NextResponse } from "next/server"
import { supabaseAdmin, BUCKETS } from "@/lib/supabase"

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("document") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only PDF, JPEG, PNG, WebP, and Word files are allowed" },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File size exceeds the 10MB limit" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf"
  const filename = `scholarships/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.cv)
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error("Scholarship upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from(BUCKETS.cv).getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}
