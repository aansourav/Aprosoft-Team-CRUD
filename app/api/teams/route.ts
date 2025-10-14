import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")

    let query = {}
    if (search) {
      query = {
        $or: [
          { teamName: { $regex: search, $options: "i" } },
          { manager: { $regex: search, $options: "i" } },
          { director: { $regex: search, $options: "i" } },
          { "members.name": { $regex: search, $options: "i" } },
        ],
      }
    }

    const teams = await db.collection("teams").find(query).sort({ order: 1 }).toArray()

    return NextResponse.json(teams)
  } catch (error) {
    console.error("[v0] Error fetching teams:", error)
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Get the highest order number
    const lastTeam = await db.collection("teams").find().sort({ order: -1 }).limit(1).toArray()

    const newOrder = lastTeam.length > 0 ? lastTeam[0].order + 1 : 0

    const newTeam = {
      ...body,
      managerApprovalStatus: "pending",
      directorApprovalStatus: "pending",
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("teams").insertOne(newTeam)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Team created successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating team:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}
