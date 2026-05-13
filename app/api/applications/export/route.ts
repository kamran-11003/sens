import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const applications = await prisma.programApplication.findMany({
    include: { program: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  })

  const header = ["ID", "Name", "Email", "Phone", "Program", "Status", "Date"]
  const rows = applications.map((a) => [
    a.id,
    `"${a.name}"`,
    a.email,
    a.phone,
    `"${a.program.title}"`,
    a.status,
    a.createdAt.toISOString().slice(0, 10),
  ])

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="applications-${Date.now()}.csv"`,
    },
  })
}
