import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const regs = await prisma.eventRegistration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: { select: { title: true, type: true, date: true } } },
  })

  const header = ["ID", "Event", "Event Type", "Event Date", "Name", "Phone", "Email", "Note", "Registered On"]
  const rows = regs.map((r) => [
    r.id,
    q(r.event?.title),
    q(r.event?.type),
    q(r.event?.date),
    q(r.name),
    q(r.phone),
    q(r.email),
    q(r.note),
    new Date(r.createdAt).toISOString().slice(0, 10),
  ])

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="event-registrations-${Date.now()}.csv"`,
    },
  })
}
