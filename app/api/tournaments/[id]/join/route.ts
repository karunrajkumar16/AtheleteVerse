import { type NextRequest, NextResponse } from "next/server"
import { joinTournament, leaveTournament } from "@/lib/db"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import authConfig from "@/config/auth.json"

// Get JWT secret from config file or fallback to environment variable
const JWT_SECRET = authConfig.jwtSecret || process.env.JWT_SECRET || "your-secret-key"

// Route handler for joining a tournament
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the token
    let userId: string
    try {
      const decoded = verify(token, JWT_SECRET) as { id: string }
      userId = decoded.id
    } catch (error) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    // Join the tournament
    const tournamentId = params.id
    const result = await joinTournament(tournamentId, userId)

    return NextResponse.json({ 
      message: "Successfully joined tournament", 
      success: true 
    })
  } catch (error: any) {
    console.error("Error joining tournament:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to join tournament" 
    }, { status: 500 })
  }
}

// Route handler for leaving a tournament
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify the token
    let userId: string
    try {
      const decoded = verify(token, JWT_SECRET) as { id: string }
      userId = decoded.id
    } catch (error) {
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    // Leave the tournament
    const tournamentId = params.id
    const result = await leaveTournament(tournamentId, userId)

    return NextResponse.json({ 
      message: "Successfully left tournament", 
      success: true 
    })
  } catch (error: any) {
    console.error("Error leaving tournament:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to leave tournament" 
    }, { status: 500 })
  }
} 