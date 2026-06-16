import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const DEFAULT_SETTINGS: Record<string, string> = {
  admission_form_enabled: "true",
  teaching_form_enabled: "true",
  scholarship_form_enabled: "true",
}

export async function GET() {
  try {
    const rows = await prisma.siteSettings.findMany()
    const result: Record<string, string> = { ...DEFAULT_SETTINGS }
    for (const row of rows) {
      result[row.key] = row.value
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { key, value } = await req.json()
    if (!key || value === undefined) {
      return NextResponse.json({ error: "key and value are required" }, { status: 400 })
    }
    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
    return NextResponse.json(setting)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
