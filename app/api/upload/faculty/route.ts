import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { supabaseAdmin, BUCKETS } from "@/lib/supabase"

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get("image") as File | null
  if (!file || !file.name) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP or GIF images allowed" }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from(BUCKETS.faculty)
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error("Supabase faculty upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from(BUCKETS.faculty).getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}

