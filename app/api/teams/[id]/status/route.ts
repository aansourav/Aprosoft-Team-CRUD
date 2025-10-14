import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { field, status } = await request.json()

    if (!field || !status) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const result = await db.collection("teams").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          [field]: status,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Team Status Saved",
    })
  } catch (error) {
    console.error("[v0] Error updating status:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
