import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const apps = await prisma.teachingApplication.findMany({ orderBy: { createdAt: "desc" } })

  const header = ["ID", "Name", "Email", "Phone", "Subject", "Experience", "Qualification", "Message", "CV URL", "Status", "Date"]
  const rows = apps.map((a) => [
    a.id,
    `"${a.name.replace(/"/g, '""')}"`,
    a.email,
    a.phone,
    `"${a.subject.replace(/"/g, '""')}"`,
    `"${a.experience.replace(/"/g, '""')}"`,
    `"${a.qualification.replace(/"/g, '""')}"`,
    `"${a.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
    a.cvUrl ?? "",
    a.status,
    new Date(a.createdAt).toISOString().slice(0, 10),
  ])

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="teaching-applications-${Date.now()}.csv"`,
    },
  })
}
