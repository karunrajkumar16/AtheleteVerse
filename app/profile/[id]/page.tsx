import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  User, Calendar, Trophy, Medal, MapPin, 
  Mail, Gamepad2, Clock, ChevronRight
} from "lucide-react"
import { getUserById, getUserParticipationHistory } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  // Fetch user data
  const user = await getUserById(params.id)
  
  if (!user) {
    notFound()
  }
  
  // Get current user if logged in
  const currentUser = await getCurrentUser()
  const isOwnProfile = currentUser?._id.toString() === params.id
  
  // Fetch participation history
  const { events, tournaments, eventCount, tournamentCount } = 
    await getUserParticipationHistory(params.id)
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-md">
            <Image 
              src={user.avatar || "/placeholder.svg?height=160&width=160"}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Medal className="h-3 w-3" />
                {eventCount} Sports Events
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {tournamentCount} eSports Tournaments
              </Badge>
              {user.location && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {user.location}
                </Badge>
              )}
            </div>
            
            <p className="mt-4 text-muted-foreground">
              {user.bio || "No bio available."}
            </p>
            
            {isOwnProfile && (
              <div className="mt-4">
                <Link href="/profile/edit">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Participation History */}
        <Tabs defaultValue="sports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="sports">Sports Events</TabsTrigger>
            <TabsTrigger value="esports">eSports Tournaments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Sports Events Participation
                </CardTitle>
                <CardDescription>
                  Events that {isOwnProfile ? "you have" : `${user.name} has`} participated in
                </CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {events.map((event) => (
                      <Link key={event._id.toString()} href={`/events/${event._id.toString()}`} className="block group">
                        <div className="flex gap-4 p-4 border rounded-lg transition-colors hover:bg-muted/50">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                              src={event.image || "/placeholder.svg?height=64&width=64"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {event.date ? formatDate(new Date(event.date), "MMM d, yyyy") : "Date TBD"}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location || "Location TBD"}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No Events Yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      {isOwnProfile 
                        ? "You haven't joined any sports events yet." 
                        : `${user.name} hasn't joined any sports events yet.`}
                    </p>
                    <Link href="/events">
                      <Button>
                        Browse Events
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="esports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  eSports Tournament Participation
                </CardTitle>
                <CardDescription>
                  Tournaments that {isOwnProfile ? "you have" : `${user.name} has`} participated in
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tournaments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tournaments.map((tournament) => (
                      <Link key={tournament._id.toString()} href={`/esports/tournaments/${tournament._id.toString()}`} className="block group">
                        <div className="flex gap-4 p-4 border rounded-lg transition-colors hover:bg-muted/50">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                              src={tournament.image || "/placeholder.svg?height=64&width=64"}
                              alt={tournament.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors">
                              {tournament.title}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {tournament.startDateTime 
                                ? formatDate(new Date(tournament.startDateTime), "MMM d, yyyy") 
                                : (tournament.date ? formatDate(new Date(tournament.date), "MMM d, yyyy") : "Date TBD")}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Trophy className="h-3 w-3 mr-1" />
                              {tournament.game}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
                      <Gamepad2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No Tournaments Yet</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      {isOwnProfile 
                        ? "You haven't joined any eSports tournaments yet." 
                        : `${user.name} hasn't joined any eSports tournaments yet.`}
                    </p>
                    <Link href="/esports/tournaments">
                      <Button>
                        Browse Tournaments
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 