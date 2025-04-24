import { type NextRequest, NextResponse } from "next/server"
import { getCollection, createTournament } from "@/lib/db"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import authConfig from "@/config/auth.json"

// Get JWT secret from config
const JWT_SECRET = authConfig.jwtSecret || process.env.JWT_SECRET || "your-secret-key"

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get("limit") || "10")
    const skip = Number(searchParams.get("skip") || "0")
    const game = searchParams.get("game")
    
    // Create filter
    const filter: any = {}
    
    if (game) {
      filter.game = game
    }

    // Get tournaments from database
    const tournaments = await getCollection("tournaments")
    const results = await tournaments
      .find(filter)
      .sort({ startDateTime: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json({ error: "Failed to fetch tournaments" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Check if valid user is creating the tournament (unless anonymous is allowed)
    let userId = "anonymous"
    if (!body.isAnonymous) {
      // Get the token from cookies
      const token = req.cookies.get("auth-token")?.value

      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }

      // Verify the token
      try {
        const decoded = verify(token, JWT_SECRET) as { id: string }
        userId = decoded.id
      } catch (error) {
        return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
      }
    }

    // Create tournament using the dedicated function
    const tournamentData = {
      ...body,
      participants: [],
      organizerId: userId,
    }

    const result = await createTournament(tournamentData)

    return NextResponse.json({ 
      message: "Tournament created successfully", 
      tournamentId: result.insertedId.toString() 
    })
  } catch (error) {
    console.error("Error creating tournament:", error)
    return NextResponse.json({ error: "Failed to create tournament" }, { status: 500 })
  }
} 