import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("teams").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $pull: { members: { _id: params.memberId } },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting member:", error)
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string; memberId: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { name } = await request.json()

    const result = await db.collection("teams").updateOne(
      {
        _id: new ObjectId(params.id),
        "members._id": params.memberId,
      },
      {
        $set: {
          "members.$.name": name,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Team or member not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error updating member:", error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}
