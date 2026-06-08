import { NextResponse } from "next/server"
import { supabaseAdmin, BUCKETS } from "@/lib/supabase"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_SIZE = 10 * 1024 * 1024 // 10MB limit

export async function POST(req: Request) {
  try {
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
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf"
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Attempt to upload to Supabase if config is present
    const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY

    if (hasSupabase) {
      try {
        const { error } = await supabaseAdmin.storage
          .from(BUCKETS.cv) // using existing cv bucket
          .upload(`scholarships/${filename}`, buffer, { contentType: file.type, upsert: false })

        if (!error) {
          const { data } = supabaseAdmin.storage.from(BUCKETS.cv).getPublicUrl(`scholarships/${filename}`)
          return NextResponse.json({ url: data.publicUrl, storageType: "supabase" })
        } else {
          console.warn("Supabase upload failed, trying local fallback:", error)
        }
      } catch (err) {
        console.warn("Supabase upload error, trying local fallback:", err)
      }
    }

    // Local fallback storage
    const uploadDir = path.join(process.cwd(), "public", "uploads", "scholarships")
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    return NextResponse.json({ url: `/uploads/scholarships/${filename}`, storageType: "local" })
  } catch (err: any) {
    console.error("Scholarship upload API error:", err)
    return NextResponse.json({ error: "File upload failed: " + err.message }, { status: 500 })
  }
}
