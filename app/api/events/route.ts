import { type NextRequest, NextResponse } from "next/server"
import { createEvent, getEvents } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      title,
      sport,
      date,
      time,
      dateTime,
      location,
      address,
      description,
      maxParticipants,
      skillLevel,
      image,
      organizerId,
      isAnonymous,
      organizerName,
      organizerEmail,
    } = body

    // Check if required fields are provided
    if (!title || !sport || !(date || dateTime) || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if anonymous user provided name and email
    if (isAnonymous && (!organizerName || !organizerEmail)) {
      return NextResponse.json({ error: "Organizer name and email are required" }, { status: 400 })
    }

    // Use dateTime if available, otherwise use separate date and time
    const eventDate = dateTime ? new Date(dateTime) : new Date(date);

    // Create event
    const result = await createEvent({
      title,
      sport,
      date: eventDate,
      time,
      location,
      address,
      description,
      maxParticipants: maxParticipants || 0,
      participants: organizerId !== "anonymous" ? [organizerId] : [], // Organizer is automatically a participant if registered
      skillLevel: skillLevel || "All Levels",
      image,
      organizerId,
      isAnonymous: isAnonymous || false,
      organizerName: isAnonymous ? organizerName : undefined,
      organizerEmail: isAnonymous ? organizerEmail : undefined,
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "Event created successfully",
        eventId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")
    const sport = searchParams.get("sport")
    const skillLevel = searchParams.get("skillLevel")

    // Build filter
    const filter: any = {}
    if (sport) filter.sport = sport
    if (skillLevel) filter.skillLevel = skillLevel

    // Only show future events by default
    if (!searchParams.get("showPast")) {
      filter.date = { $gte: new Date() }
    }

    const events = await getEvents(limit, skip, filter)

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

