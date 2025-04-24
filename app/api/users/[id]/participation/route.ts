import { type NextRequest, NextResponse } from "next/server"
import { getUserParticipationHistory } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const participationHistory = await getUserParticipationHistory(userId)
    
    return NextResponse.json(participationHistory)
  } catch (error: any) {
    console.error("Error fetching user participation history:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch participation history" 
    }, { status: 500 })
  }
} 