import { type NextRequest, NextResponse } from "next/server"
import { getEventById, joinEvent } from "@/lib/db"

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

    // Check if event is full
    if (event.maxParticipants > 0 && event.participants.length >= event.maxParticipants) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Join event
    const result = await joinEvent(eventId, userId)

    return NextResponse.json({ message: "Successfully joined event" })
  } catch (error) {
    console.error("Error joining event:", error)
    return NextResponse.json({ error: "Failed to join event" }, { status: 500 })
  }
}

