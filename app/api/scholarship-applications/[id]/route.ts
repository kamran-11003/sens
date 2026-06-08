import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { status } = await req.json()
    
    const VALID_STATUSES = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"]
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const updated = await prisma.scholarshipApplication.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("Update scholarship status error:", err)
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.scholarshipApplication.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Delete scholarship error:", err)
    return NextResponse.json({ error: "Failed to delete scholarship application" }, { status: 500 })
  }
}
