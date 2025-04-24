import { type NextRequest, NextResponse } from "next/server"
import { getEventById, leaveEvent } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if event exists
    const event = await getEventById(eventId)
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if user is the organizer
    if (event.organizerId === userId) {
      return NextResponse.json({ error: "Organizer cannot leave the event" }, { status: 400 })
    }

    // Leave event
    const result = await leaveEvent(eventId, userId)

    return NextResponse.json({ message: "Successfully left event" })
  } catch (error) {
    console.error("Error leaving event:", error)
    return NextResponse.json({ error: "Failed to leave event" }, { status: 500 })
  }
}

