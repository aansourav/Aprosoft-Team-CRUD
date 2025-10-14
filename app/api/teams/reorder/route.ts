import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { teams } = await request.json()

    if (!teams || !Array.isArray(teams)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // Update order for each team
    const bulkOps = teams.map((team, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(team._id) },
        update: { $set: { order: index, updatedAt: new Date() } },
      },
    }))

    await db.collection("teams").bulkWrite(bulkOps)

    return NextResponse.json({
      success: true,
      message: "Team order updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error reordering teams:", error)
    return NextResponse.json({ error: "Failed to reorder teams" }, { status: 500 })
  }
}
