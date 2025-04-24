import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Filter, Search, Plus } from "lucide-react"
import { getEvents } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function EventsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Parse search parameters
  const page = Number(searchParams.page) || 1
  const limit = 9
  const skip = (page - 1) * limit
  

  
  // Build filter based on search parameters
  const filter: any = {}
  
  // Only show future events by default
  filter.date = { $gte: new Date() }
  
  // Fetch events from the database
  const events = await getEvents(limit, skip, filter)
  
  // Fetch total count for pagination (in a real app, you would use a separate count query)
  const totalEvents = events.length // This is a simplification
  const totalPages = Math.ceil(totalEvents / limit)
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Discover and join sports events in your area or create your own.</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search Events
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="search" placeholder="Search by event name, sport, or location..." className="pl-8" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:flex md:flex-row">
            <div className="space-y-2">
              <label htmlFor="sport" className="text-sm font-medium">
                Sport
              </label>
              <Select>
                <SelectTrigger id="sport" className="w-full md:w-[150px]">
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="soccer">cricket</SelectItem>
                  <SelectItem value="tennis">Batmantion</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="skill" className="text-sm font-medium">
                Skill Level
              </label>
              <Select>
                <SelectTrigger id="skill" className="w-full md:w-[150px]">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Select>
                <SelectTrigger id="date" className="w-full md:w-[150px]">
                  <SelectValue placeholder="Any Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2 md:self-end">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-end">
          <Link href="/events/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.length > 0 ? (
            events.map((event) => (
              <Link key={event._id.toString()} href={`/events/${event._id.toString()}`} className="block group">
                <div className="overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                  <div className="relative h-48">
                    <Image src={event.image || "/placeholder.svg?height=300&width=400"} alt={event.title} fill className="object-cover" />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
                      {event.sport}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      {event.date ? formatDate(new Date(event.date), "EEE, MMM d, yyyy • h:mm a") : "Date TBD"}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {event.location || "Location TBD"}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {event.participants ? event.participants.length : 0} participants
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Skill level: <span className="text-primary">{event.skillLevel || "All Levels"}</span>
                      </span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No events found. Try adjusting your filters or create a new event!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button 
              variant="outline" 
              size="icon" 
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={`/events?page=${page - 1}`}>&lt;</Link>
              ) : (
                <>&lt;</>
              )}
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button 
                key={pageNum}
                variant="outline" 
                size="sm" 
                className={pageNum === page ? "bg-primary text-primary-foreground" : ""}
                asChild={pageNum !== page}
              >
                {pageNum !== page ? (
                  <Link href={`/events?page=${pageNum}`}>{pageNum}</Link>
                ) : (
                  <>{pageNum}</>
                )}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="icon"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link href={`/events?page=${page + 1}`}>&gt;</Link>
              ) : (
                <>&gt;</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

