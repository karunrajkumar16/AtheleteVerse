import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Calendar, Users, Trophy, ArrowRight, Star, Clock } from "lucide-react"
import { getGameById, getTournamentsByGame } from "@/lib/db"
import { formatDate } from "@/lib/utils"


export default async function GameDetailPage({ params }: { params: { id: string } }) {
  // Fetch game data
  const game = await getGameById(params.id)
  
  if (!game) {
    notFound()
  }
  
  // Fetch tournaments for this game
  const tournaments = await getTournamentsByGame(params.id, 3, 0)
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  {game.title}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">{game.category}</Badge>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white">
                    <Users className="mr-1 h-4 w-4" />
                    {game.activePlayers || 0} players
                  </Badge>
                </div>
                <p className="max-w-[600px] text-white/90 md:text-xl mt-4">
                  {game.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-4">
                <Link href={`/esports/games/${params.id}/tournaments`}>
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                    View Tournaments
                    <Trophy className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/esports/games/${params.id}/players`}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Find Players
                    <Users className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <Image
                src={game.image || "/placeholder.svg?height=400&width=500"}
                alt={game.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Game Details */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Game Details</CardTitle>
                    <CardDescription>Information about {game.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                      <p>{game.category}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Release Date</h4>
                      <p>{game.releaseDate ? formatDate(new Date(game.releaseDate), "MMMM d, yyyy") : "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Developer</h4>
                      <p>{game.developer || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Publisher</h4>
                      <p>{game.publisher || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Platforms</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {game.platforms && game.platforms.length > 0 ? (
                          game.platforms.map((platform: string, index: number) => (
                            <Badge key={index} variant="outline">{platform}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No platforms listed</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Player Stats</CardTitle>
                    <CardDescription>Community statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Active Players</h4>
                      <p className="font-bold">{game.activePlayers || 0}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Teams</h4>
                      <p className="font-bold">{game.teams || 0}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Tournaments</h4>
                      <p className="font-bold">{tournaments.length}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Average Skill Level</h4>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <p className="font-bold">{game.averageSkillLevel || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Game Description</CardTitle>
                    <CardDescription>About {game.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {game.longDescription || game.description || "No description available."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tournaments" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Upcoming Tournaments</h2>
                  <Link href={`/esports/games/${params.id}/tournaments`}>
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                {tournaments.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tournaments.map((tournament) => (
                      <Link key={tournament._id.toString()} href={`/esports/tournaments/${tournament._id.toString()}`} className="block group">
                        <div className="overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                          <div className="relative h-48">
                            <Image
                              src={tournament.image || "/placeholder.svg?height=300&width=400"}
                              alt={tournament.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
                              {tournament.format || "TBD"}
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {tournament.title}
                            </h3>
                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {tournament.date ? formatDate(new Date(tournament.date), "MMM d-d, yyyy") : "Date TBD"}
                            </div>
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                              <Users className="mr-1 h-4 w-4" />
                              {tournament.participants ? tournament.participants.length : 0} participants
                            </div>
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                              <Trophy className="mr-1 h-4 w-4" />
                              Prize pool: {tournament.prizePool || "$0"}
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-sm font-medium">
                                Registration: <span className="text-primary">{tournament.registrationOpen ? "Open" : "Closed"}</span>
                              </span>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Tournaments Found</h3>
                    <p className="text-muted-foreground mt-1">There are no upcoming tournaments for this game.</p>
                    <Link href="/esports/tournaments/create" className="mt-4 inline-block">
                      <Button>
                        Create Tournament
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="community" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Community</h2>
                  <Link href={`/esports/games/${params.id}/community`}>
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Players</CardTitle>
                      <CardDescription>Players with the highest skill level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {game.topPlayers && game.topPlayers.length > 0 ? (
                        <div className="space-y-4">
                          {game.topPlayers.map((player: any, index: number) => (
                            <Link key={index} href={`/players/${player.id}`} className="flex items-center space-x-4 group">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={player.avatar || "/placeholder.svg?height=40&width=40"}
                                  alt={player.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium group-hover:text-primary transition-colors">{player.name}</p>
                                <p className="text-sm text-muted-foreground">Skill Level: {player.skillLevel}</p>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>{player.rating || "N/A"}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No top players found for this game.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Teams</CardTitle>
                      <CardDescription>Teams competing in this game</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {game.activeTeams && game.activeTeams.length > 0 ? (
                        <div className="space-y-4">
                          {game.activeTeams.map((team: any, index: number) => (
                            <Link key={index} href={`/esports/teams/${team.id}`} className="flex items-center space-x-4 group">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={team.logo || "/placeholder.svg?height=40&width=40"}
                                  alt={team.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium group-hover:text-primary transition-colors">{team.name}</p>
                                <p className="text-sm text-muted-foreground">Members: {team.memberCount || 0}</p>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <Trophy className="h-4 w-4 text-primary mr-1" />
                                <span>{team.wins || 0} wins</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No active teams found for this game.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Join Community Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join the {game.title} Community</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with other players, join tournaments, and improve your skills.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/esports/games/${params.id}/discord`}>
                <Button size="lg" variant="outline">
                  Join Discord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 