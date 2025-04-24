import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, ArrowRight, MapPin, Clock, Info, Shield } from "lucide-react"
import { getTournamentById, getGameById } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"
import JoinTournamentButton from "@/components/JoinTournamentButton"
import { ReactNode } from "react"

export default async function TournamentDetailPage({ params }: { params: { id: string } }): Promise<ReactNode> {
  // Get the id for param ok ryuk
  const id = params.id
  
  const tournament = await getTournamentById(id)
  
  if (!tournament) {
    notFound()
  }
  
  let game = null
  if (tournament.gameId) {
    game = await getGameById(tournament.gameId)
  }
  
  const currentUser = await getCurrentUser()
  
  const isRegistered = currentUser ? 
    tournament.participants?.includes(currentUser._id.toString()) : 
    false

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {tournament.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {game && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white">{game.title}</Badge>
                  )}
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    <Trophy className="mr-1 h-4 w-4" />
                    {tournament.format || "Format TBD"}
                  </Badge>
                </div>
                <p className="max-w-[600px] text-white/90 md:text-xl mt-4">
                  {tournament.description || "No description available."}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                <JoinTournamentButton 
                  tournamentId={tournament._id.toString()}
                  isRegistered={isRegistered}
                  registrationOpen={!!tournament.registrationOpen}
                  className="bg-white text-purple-600 hover:bg-white/90"
                />
                <Link href={tournament.discordLink || "#"}>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                    Join Discord
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <Image
                src={tournament.image || "/placeholder.svg?height=400&width=500"}
                alt={tournament.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Tournament Details</CardTitle>
                    <CardDescription>Information about {tournament.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Date</h4>
                      <p>{tournament.date ? formatDate(new Date(tournament.date), "MMMM d, yyyy") : "Date TBD"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Time</h4>
                      <p>{tournament.time || "Time TBD"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
                      <p>{tournament.location || "Online"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Format</h4>
                      <p>{tournament.format || "Format TBD"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Prize Pool</h4>
                      <p className="font-bold text-primary">{tournament.prizePool || "$0"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Registration</h4>
                      <p className={tournament.registrationOpen ? "text-green-600" : "text-red-600"}>
                        {tournament.registrationOpen ? "Open" : "Closed"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Participation</CardTitle>
                    <CardDescription>Who can join and how</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Entry Fee</h4>
                      <p>{tournament.entryFee || "Free"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Team Size</h4>
                      <p>{tournament.teamSize || "Individual"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Skill Level</h4>
                      <p>{tournament.skillLevel || "All Levels"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Participants</h4>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <p>
                          {tournament.participants ? tournament.participants.length : 0} / 
                          {tournament.maxParticipants || "∞"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Registration Deadline</h4>
                      <p>
                        {tournament.registrationDeadline 
                          ? formatDate(new Date(tournament.registrationDeadline), "MMMM d, yyyy") 
                          : "No deadline"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                    <CardDescription>Tournament host information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tournament.organizer ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image
                              src={tournament.organizer.logo || "/placeholder.svg?height=48&width=48"}
                              alt={tournament.organizer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{tournament.organizer.name}</h3>
                            <p className="text-sm text-muted-foreground">{tournament.organizer.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {tournament.organizer.website && (
                            <Link href={tournament.organizer.website} className="text-sm text-primary hover:underline flex items-center">
                              <Info className="h-4 w-4 mr-1" />
                              Visit Website
                            </Link>
                          )}
                          {tournament.organizer.email && (
                            <p className="text-sm text-muted-foreground">
                              Contact: {tournament.organizer.email}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Organizer information not available.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Schedule</CardTitle>
                  <CardDescription>Timeline of events</CardDescription>
                </CardHeader>
                <CardContent>
                  {tournament.schedule && tournament.schedule.length > 0 ? (
                    <div className="space-y-6">
                      {tournament.schedule.map((event: any, index: number) => (
                        <div key={index} className="relative pl-6 pb-6 border-l border-muted last:border-0 last:pb-0">
                          <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-primary -translate-x-1"></div>
                          <div className="space-y-1">
                            <h3 className="font-medium">{event.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              {event.date ? formatDate(new Date(event.date), "MMMM d, yyyy") : "Date TBD"}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {event.time || "Time TBD"}
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Schedule Not Available</h3>
                      <p className="text-muted-foreground mt-1">The tournament schedule has not been published yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="participants" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Participants</CardTitle>
                  <CardDescription>
                    {tournament.participants ? tournament.participants.length : 0} 
                    {tournament.maxParticipants ? ` / ${tournament.maxParticipants}` : ""} registered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tournament.participants && tournament.participants.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {tournament.participants.map((participant: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={participant.avatar || "/placeholder.svg?height=40&width=40"}
                              alt={participant.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            {participant.team && (
                              <p className="text-sm text-muted-foreground">Team: {participant.team}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Participants Yet</h3>
                      <p className="text-muted-foreground mt-1">Be the first to register for this tournament!</p>
                      {tournament.registrationOpen && (
                        <Button className="mt-4">
                          Register Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rules" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Rules</CardTitle>
                  <CardDescription>Guidelines and regulations</CardDescription>
                </CardHeader>
                <CardContent>
                  {tournament.rules && Array.isArray(tournament.rules) && tournament.rules.length > 0 ? (
                    <div className="space-y-6">
                      {tournament.rules.map((rule: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-medium flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-primary" />
                            {rule.title}
                          </h3>
                          <p className="text-muted-foreground pl-6">{rule.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <p>The tournament will follow standard competitive rules for {game ? game.title : "this game"}.</p>
                      
                      <h3 className="text-lg font-medium mt-6">General Rules</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>All participants must register before the deadline.</li>
                        <li>Players must be on time for their scheduled matches.</li>
                        <li>Unsportsmanlike behavior will result in disqualification.</li>
                        <li>Tournament administrators have the final say in all disputes.</li>
                        <li>The tournament format and schedule are subject to change.</li>
                      </ul>
                      
                      <h3 className="text-lg font-medium mt-6">Technical Requirements</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Players are responsible for their own equipment and internet connection.</li>
                        <li>In case of technical issues, players have up to 10 minutes to resolve them.</li>
                        <li>Intentional disconnects will result in a forfeit of the current match.</li>
                      </ul>
                      
                      <p className="mt-6 text-muted-foreground">
                        For detailed rules and regulations, please join our Discord server or contact the tournament organizers.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Compete?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the tournament, showcase your skills, and win prizes!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <JoinTournamentButton 
                tournamentId={tournament._id.toString()}
                isRegistered={isRegistered}
                registrationOpen={!!tournament.registrationOpen}
                className="size-lg"
              />
              <Link href="/esports/tournaments">
                <Button size="lg" variant="outline">
                  Browse More Tournaments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 