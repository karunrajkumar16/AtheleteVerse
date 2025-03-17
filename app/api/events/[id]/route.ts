import { type NextRequest, NextResponse } from "next/server"
import { getEventById, updateEvent, deleteEvent } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const event = await getEventById(eventId)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const body = await req.json()

    // If date is provided, convert it to Date object
    if (body.date) {
      body.date = new Date(body.date)
    }

    const result = await updateEvent(eventId, body)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event updated successfully" })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const result = await deleteEvent(eventId)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

