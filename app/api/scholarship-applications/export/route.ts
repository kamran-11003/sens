import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const apps = await prisma.scholarshipApplication.findMany({
      orderBy: { createdAt: "desc" },
    })

    const header = [
      "ID",
      "Scholarship",
      "Name",
      "Email",
      "Phone",
      "CNIC",
      "DOB",
      "Gender",
      "Father's Name",
      "Last Institution",
      "Grade",
      "Percentage",
      "Address",
      "Document Type",
      "Document URL",
      "Status",
      "Date",
    ]

    const rows = apps.map((a) => [
      a.id,
      `"${a.scholarshipName.replace(/"/g, '""')}"`,
      `"${a.name.replace(/"/g, '""')}"`,
      a.email,
      a.phone,
      `"${a.cnic}"`,
      a.dob,
      a.gender,
      `"${a.fatherName.replace(/"/g, '""')}"`,
      `"${a.lastInstitution.replace(/"/g, '""')}"`,
      `"${a.grade.replace(/"/g, '""')}"`,
      `"${a.percentage.replace(/"/g, '""')}"`,
      `"${a.address.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      a.documentType,
      a.documentUrl,
      a.status,
      new Date(a.createdAt).toISOString().slice(0, 10),
    ])

    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="scholarship-applications-${Date.now()}.csv"`,
      },
    })
  } catch (err: any) {
    console.error("Export CSV error:", err)
    return NextResponse.json({ error: "Failed to generate CSV export" }, { status: 500 })
  }
}
