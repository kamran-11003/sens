import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } })

  const header = ["ID", "Name", "Email", "Phone", "Subject", "Message", "Status", "Date"]
  const rows = submissions.map((c) => [
    c.id,
    `"${c.name.replace(/"/g, '""')}"`,
    c.email,
    c.phone ?? "",
    `"${(c.subject ?? "").replace(/"/g, '""')}"`,
    `"${c.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
    c.status,
    new Date(c.createdAt).toISOString().slice(0, 10),
  ])

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="contacts-${Date.now()}.csv"`,
    },
  })
}
