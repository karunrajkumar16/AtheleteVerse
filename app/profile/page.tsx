"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Star, Trophy, Users, Edit, Gamepad2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userEvents, setUserEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const userResponse = await fetch("/api/auth/me")
        const userData = await userResponse.json()

        if (!userData.user) {
          
          router.push("/login")
          return
        }

        setUser(userData.user)

        // Get user's events
        const eventsResponse = await fetch(`/api/events?participants=${userData.user._id}`)
        const eventsData = await eventsResponse.json()
        setUserEvents(eventsData || [])
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // This prevents flash of content before redirect
  }

  // Split events into upcoming and past
  const now = new Date()
  const upcomingEvents = userEvents.filter(event => new Date(event.date) >= now)
  const pastEvents = userEvents.filter(event => new Date(event.date) < now)

  // Mock data for achievements (to be replaced with real data later)
  const achievements = [
    {
      title: "City Tennis Tournament",
      date: "June 2023",
      description: "Runner-up in the city tennis tournament"
    },
    {
      title: "Basketball League",
      date: "March 2023",
      description: "MVP in the local basketball league"
    }
  ]

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="relative h-32 w-32 md:h-40 md:w-40">
            <Image
              src={user.avatar || "/placeholder.svg?height=160&width=160"}
              alt="Profile picture"
              fill
              className="rounded-full object-cover border-4 border-background"
            />
            <Link href="/profile/edit">
              <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full bg-background">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit profile picture</span>
              </Button>
            </Link>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <Link href="/profile/edit">
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {user.location || "No location set"}
            </div>
            <p className="text-muted-foreground">
              {user.bio || "No bio yet. Click Edit Profile to add one."}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Trophy className="h-3 w-3" />
                {userEvents.length} Events Joined
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Users className="h-3 w-3" />
                {user.teams?.length || 0} Teams
              </div>
              {user.sports?.includes("esports") && (
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Gamepad2 className="h-3 w-3" />
                  eSports Player
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs defaultValue="sports">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="esports">eSports</TabsTrigger>
          </TabsList>

          {/* Sports Tab */}
          <TabsContent value="sports" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>My Sports</CardTitle>
                  <CardDescription>Sports you play and your skill levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.sports && user.sports.length > 0 ? (
                      user.sports.map((sport: string, index: number) => {
                        const skillLevel = user.skillLevels?.find((s: { sport: string, level: number }) => s.sport === sport)?.level || 1;
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Trophy className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">{sport}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {skillLevel <= 2 ? "Beginner" : skillLevel <= 4 ? "Intermediate" : "Advanced"}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < skillLevel ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No sports added yet.</p>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-2">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Sports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your sports accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-xs text-muted-foreground">{achievement.date}</p>
                          <p className="text-sm mt-1">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      <Edit className="mr-2 h-4 w-4" />
                      Add Achievement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upcoming Events</CardTitle>
                      <CardDescription>Events you've registered for</CardDescription>
                    </div>
                    <Link href="/events">
                      <Button>Find Events</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <div
                          key={event._id.toString()}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <Link href={`/events/${event._id.toString()}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="font-medium">No upcoming events</h3>
                        <p className="text-sm text-muted-foreground">You haven't registered for any events yet.</p>
                        <Link href="/events" className="mt-4">
                          <Button>Browse Events</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Past Events</CardTitle>
                  <CardDescription>Events you've participated in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastEvents.length > 0 ? (
                      pastEvents.map((event) => (
                        <div
                          key={event._id.toString()}
                          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="mr-1 h-3 w-3" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                          <Link href={`/events/${event._id.toString()}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
                        <h3 className="font-medium">No past events</h3>
                        <p className="text-sm text-muted-foreground">You haven't participated in any events yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Teams</CardTitle>
                    <CardDescription>Teams you're a member of</CardDescription>
                  </div>
                  <Link href="/teams/create">
                    <Button>Create Team</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No teams yet</h3>
                  <p className="text-sm text-muted-foreground">You haven't joined any teams yet.</p>
                  <Link href="/teams" className="mt-4">
                    <Button>Browse Teams</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* eSports Tab */}
          <TabsContent value="esports" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My eSports</CardTitle>
                    <CardDescription>Games you play and tournaments</CardDescription>
                  </div>
                  <Link href="/esports">
                    <Button>Browse Games</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No eSports data yet</h3>
                  <p className="text-sm text-muted-foreground">You haven't added any games or joined tournaments yet.</p>
                  <Link href="/esports" className="mt-4">
                    <Button>Explore eSports</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

