import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Star, Trophy, Users, Calendar, Mail, MessageSquare } from "lucide-react"
import { getUserById, getEvents } from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"

export default async function PlayerDetailPage({ params }: { params: { id: string } }) {
  const userId = params.id
  const user = await getUserById(userId)
  
  if (!user) {
    notFound()
  }
  
  let userEvents: any[] = []
  if (user.eventsJoined && user.eventsJoined.length > 0) {
    const allEvents = await getEvents(100, 0, { date: { $gte: new Date() } })
    userEvents = allEvents.filter(event => 
      user.eventsJoined.some((eventId: string) => event._id.toString() === eventId)
    ).slice(0, 2)
  }
  
  const memberSince = user.createdAt ? formatDate(new Date(user.createdAt), "MMMM yyyy") : "Unknown"
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <Link href="/players">
            <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Players
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="relative h-32 w-32 md:h-48 md:w-48">
            <Image
              src={user.avatar || "/placeholder.svg?height=200&width=200"}
              alt={user.name}
              width={200}
              height={200}
              className="rounded-full object-cover border-4 border-background"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Message
                </Button>
                <Button className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Invite to Team
                </Button>
              </div>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {user.location || "Location not specified"}
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <span>Member since {memberSince}</span>
            </div>
            <p className="text-muted-foreground">{user.bio || "No bio provided."}</p>
            {user.sports && user.sports.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {user.sports.map((sport: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {sport}
                    {user.skillLevels && user.skillLevels.find((s: any) => s.sport === sport) && (
                      <div className="ml-1 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < (user.skillLevels.find((s: any) => s.sport === sport)?.level || 0) 
                                ? "fill-primary text-primary" 
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="sports">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="events">Events & Teams</TabsTrigger>
            <TabsTrigger value="esports">eSports</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="sports" className="mt-6">
            {user.skillLevels && user.skillLevels.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {user.skillLevels.map((skill: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{skill.sport}</CardTitle>
                      <CardDescription>{skill.experience || `${skill.sport} enthusiast`}</CardDescription>
                      <div className="mt-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < skill.level ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {skill.achievements && skill.achievements.length > 0 ? (
                        <>
                          <h3 className="font-semibold mb-2">Achievements</h3>
                          <ul className="space-y-2">
                            {skill.achievements.map((achievement: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <Trophy className="mr-2 h-5 w-5 text-primary" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="text-muted-foreground">No achievements listed yet.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sports information available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events {user.name} is participating in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userEvents.length > 0 ? (
                      userEvents.map((event) => (
                        <div key={event._id.toString()} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {event.date ? formatDate(new Date(event.date), "EEE, MMM d, yyyy • h:mm a") : "Date TBD"}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.location || "Location TBD"}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No upcoming events</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>Teams {user.name} is a member of</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.teams && user.teams.length > 0 ? (
                    <div className="space-y-4">
                      {user.teams.map((team: any) => (
                        <div key={team.id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{team.name}</h3>
                            <p className="text-xs text-muted-foreground">{team.sport}</p>
                            <p className="text-xs text-muted-foreground">{team.members} members</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">Not a member of any teams</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="esports" className="mt-6">
            {user.games && user.games.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {user.games.map((game: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{game.name}</CardTitle>
                      <CardDescription>{game.platform}</CardDescription>
                      <div className="mt-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < game.level ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Play time</span>
                        <span className="font-medium">{game.playTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No gaming information available.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {user.reviews && user.reviews.length > 0 ? (
              <div className="space-y-6">
                {user.reviews.map((review: any) => (
                  <div key={review.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={review.avatar || "/download.jpg?height=40&width=40"}
                        alt={review.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{review.author}</div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No reviews yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

