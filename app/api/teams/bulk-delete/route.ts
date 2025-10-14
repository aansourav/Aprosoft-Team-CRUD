import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid team IDs" }, { status: 400 })
    }

    const objectIds = ids.map((id) => new ObjectId(id))
    const result = await db.collection("teams").deleteMany({ _id: { $in: objectIds } })

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} team(s) deleted successfully`,
    })
  } catch (error) {
    console.error("[v0] Error bulk deleting teams:", error)
    return NextResponse.json({ error: "Failed to delete teams" }, { status: 500 })
  }
}
