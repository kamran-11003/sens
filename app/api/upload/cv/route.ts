import { NextResponse } from "next/server"
import { supabaseAdmin, BUCKETS } from "@/lib/supabase"

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("cv") as File | null

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only PDF and Word documents are accepted" }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.cv)
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error("Supabase CV upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from(BUCKETS.cv).getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}

