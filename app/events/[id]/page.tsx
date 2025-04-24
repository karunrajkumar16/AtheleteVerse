import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEventById, getUserById } from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import JoinEventButton from "@/components/JoinEventButton"
import { ReactNode } from "react"

export default async function EventDetailPage({ params }: { params: { id: string } }): Promise<ReactNode> {
  
  if (!params?.id) {
    notFound()
  }
  
  const eventId = params.id
  
  try {
    const event = await getEventById(eventId)
    
    if (!event) {
      notFound()
    }
    
    const organizer = event.organizerId ? await getUserById(event.organizerId) : null
    
    const attendeePromises = event.participants 
      ? event.participants.slice(0, 6).map((participantId: string) => getUserById(participantId))
      : []
    const attendees = await Promise.all(attendeePromises)
    
    const eventDate = event.date ? new Date(event.date) : null
    const formattedDate = eventDate ? formatDate(eventDate, "EEE, MMM d, yyyy") : "Date not specified"
    
    const isFull = event.maxParticipants > 0 && 
      event.participants && 
      event.participants.length >= event.maxParticipants
    
    const isParticipant = false

    return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <Link href="/events">
              <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </Link>
          </div>

          <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-xl">
            <Image 
              src={event.image || "/placeholder.svg?height=400&width=800"} 
              alt={event.title} 
              fill 
              className="object-cover" 
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary" className="rounded-full">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground">{event.sport}</Badge>
                  <Badge variant="outline">{event.skillLevel}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <div className="flex flex-col gap-2 text-muted-foreground sm:flex-row sm:gap-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formattedDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {event.time || "Time not specified"}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location || "Location not specified"}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="participants">Participants</TabsTrigger>
                  {event.rules && event.rules.length > 0 && (
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div>
                    <h2 className="text-xl font-semibold">About this event</h2>
                    <p className="mt-2 text-muted-foreground">{event.description || "No description provided."}</p>
                  </div>
                  {event.address && (
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p className="mt-1 text-muted-foreground">{event.address}</p>
                      <div className="mt-2 h-[200px] w-full overflow-hidden rounded-md bg-muted">
                        <Image
                          src="/placeholder.svg?height=200&width=600"
                          alt="Map"
                          width={600}
                          height={200}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {event.amenities && event.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Amenities</h3>
                      <ul className="mt-1 grid grid-cols-2 gap-1 text-muted-foreground">
                        {event.amenities.map((amenity: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-2">•</span>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="participants" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Participants</h2>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {event.participants ? event.participants.length : 0} / {event.maxParticipants || "∞"}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {attendees.length > 0 ? (
                      attendees.map((attendee) => (
                        <div key={attendee._id.toString()} className="flex items-center gap-3 rounded-lg border p-3">
                          <Avatar>
                            <AvatarImage src={attendee.avatar || "/placeholder.svg?height=40&width=40"} alt={attendee.name} />
                            <AvatarFallback>{attendee.name ? attendee.name.charAt(0) : "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{attendee.name}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No participants yet.</p>
                    )}
                  </div>
                </TabsContent>
                {event.rules && event.rules.length > 0 && (
                  <TabsContent value="rules" className="space-y-4 pt-4">
                    <h2 className="text-xl font-semibold">Event Rules</h2>
                    <ul className="space-y-2">
                      {event.rules.map((rule: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {index + 1}
                          </span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Registration</h2>
                  <Badge 
                    variant="outline" 
                    className={
                      isFull
                        ? "text-red-600 bg-red-50"
                        : "text-green-600 bg-green-50"
                    }
                  >
                    {isFull ? "Full" : "Open"}
                  </Badge>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{event.price ? `$${event.price}` : "Free"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Spots left</span>
                    <span className="font-medium">
                      {event.maxParticipants 
                        ? event.maxParticipants - (event.participants ? event.participants.length : 0)
                        : "Unlimited"}
                    </span>
                  </div>
                  
                  <JoinEventButton 
                    eventId={eventId}
                    isFull={isFull}
                    isParticipant={isParticipant}
                  />
                  
                </div>
              </div>

              {organizer && (
                <div className="rounded-lg border p-4">
                  <h2 className="text-lg font-semibold">Organizer</h2>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={organizer.avatar || "/placeholder.svg?height=40&width=40"} alt={organizer.name} />
                      <AvatarFallback>{organizer.name ? organizer.name.charAt(0) : "O"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{organizer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {organizer.eventsOrganized ? `${organizer.eventsOrganized} events organized` : "Event organizer"}
                      </div>
                    </div>
                  </div>
                  {organizer.rating && (
                    <div className="mt-4 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-4 w-4 ${
                            star <= organizer.rating 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "fill-muted text-muted"
                          }`} 
                        />
                      ))}
                      {organizer.reviews && (
                        <span className="ml-1 text-sm">({organizer.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                  <Button variant="outline" className="mt-4 w-full">
                    View Profile
                  </Button>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <h2 className="text-lg font-semibold">Share this event</h2>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (err) {
    console.error("Error loading event:", err)
    return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-8">
          <div>
            <Link href="/events">
              <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Error Loading Event</h2>
            <p className="text-muted-foreground mt-2">We encountered an error loading this event. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }
}

