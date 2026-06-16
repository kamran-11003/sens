import { NextResponse } from "next/server"
import { supabaseAdmin, BUCKETS } from "@/lib/supabase"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any).role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const ALLOWED = [
    "application/pdf",
    "image/jpeg", "image/jpg", "image/png", "image/webp",
    "video/mp4", "video/quicktime", "video/webm",
  ]
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only PDF, images (JPEG/PNG/WebP), and videos (MP4/MOV/WebM) are allowed" }, { status: 400 })
  }
  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 100MB" }, { status: 400 })
  }

  const ext = file.name.split(".").pop() ?? "bin"
  const fileName = `submissions/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.submissions)
    .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabaseAdmin.storage.from(BUCKETS.submissions).getPublicUrl(fileName)

  const type = file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : file.type.startsWith("video/") ? "video" : "other"

  return NextResponse.json({ url: data.publicUrl, name: file.name, fileType: type })
}
