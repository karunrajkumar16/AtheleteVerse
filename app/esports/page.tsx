import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Calendar, Users, Trophy, ArrowRight } from "lucide-react"
import { getGamesByCategory, getTournaments } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function EsportsPage() {
  // Fetch games by category

  const fpsGames = await getGamesByCategory("fps", 4, 0)
  const mobaGames = await getGamesByCategory("moba", 4, 0)
  const battleRoyaleGames = await getGamesByCategory("battle-royale", 4, 0)
  const sportsGames = await getGamesByCategory("sports", 4, 0)
  
  // Define filter for only esports type tournaments (without date filtering)
  const tournamentFilter = {
    type: "esports"
  };
  
  // Fetch all esports tournaments
  const allTournaments = await getTournaments(6, 0, tournamentFilter);
  
  // For debugging - log the tournaments that were found
  console.log(`Found ${allTournaments.length} eSports tournaments`);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Join Our eSports Community
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Connect with fellow gamers, join tournaments, and level up your gaming experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/esports/tournaments">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                    Browse Tournaments
                    <Trophy className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/esports/players">
                  <Button size="lg"  className="bg-white text-purple-600 hover:bg-white/90">
                    Find Players
                  </Button>
                </Link>
              </div>
            </div>
            <Image
              src="/download.jpg?height=400&width=500"
              width={500}
              height={400}
              alt="eSports gaming"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>



      {/* Upcoming Tournaments */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">All Tournaments</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                View and join eSports tournaments or create your own.
              </p>
              <div className="mt-4">
                <Link href="/esports/tournaments/create">
                  <Button className="bg-primary hover:bg-primary/90">
                    Create Tournament
                    <Trophy className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {allTournaments.length > 0 ? (
              allTournaments.map((tournament) => (
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
                        {tournament.game}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {tournament.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {tournament.startDateTime ? formatDate(new Date(tournament.startDateTime), "MMM d, yyyy • h:mm a") : 
                         (tournament.date ? formatDate(new Date(tournament.date), "MMM d, yyyy") : "Date TBD")}
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
                          Format: <span className="text-primary">{tournament.format || "TBD"}</span>
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
                <p className="text-muted-foreground">No tournaments found.</p>
                <div className="mt-4">
                  <Link href="/esports/tournaments/create">
                    <Button>
                      Create the First Tournament
                      <Trophy className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Community</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with other gamers, share strategies, and find teammates.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg">
                  Create Account
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

