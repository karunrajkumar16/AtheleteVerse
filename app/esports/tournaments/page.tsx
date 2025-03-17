import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Trophy, ArrowRight, Filter } from "lucide-react"
import { getTournaments, getGames } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search parameters
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
  const limit = 9
  const skip = (page - 1) * limit
  
  // Build filter based on search parameters
  const filter: any = {}
  
  if (searchParams.game) {
    filter.gameId = searchParams.game
  }
  
  if (searchParams.format) {
    filter.format = searchParams.format
  }
  
  if (searchParams.status === 'upcoming') {
    filter.date = { $gte: new Date() }
  } else if (searchParams.status === 'past') {
    filter.date = { $lt: new Date() }
  }
  
  if (searchParams.registration === 'open') {
    filter.registrationOpen = true
  } else if (searchParams.registration === 'closed') {
    filter.registrationOpen = false
  }
  
  // Fetch tournaments with pagination and filtering
  const tournaments = await getTournaments(limit, skip, filter)
  
  // Fetch total count for pagination
  const totalTournaments = tournaments.length // In a real app, you would get the total count from the database
  const totalPages = Math.ceil(totalTournaments / limit)
  
  // Fetch games for filter dropdown
  const games = await getGames(100, 0)
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">eSports Tournaments</h1>
              <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find and join competitive gaming tournaments across various games and skill levels.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/esports/tournaments/create">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                  Create Tournament
                  <Trophy className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/esports/games">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Browse Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full py-6 md:py-8 border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-medium">Filter Tournaments</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <div className="w-full sm:w-auto">
                <Select defaultValue={searchParams.game?.toString() || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Game" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Games</SelectItem>
                    {games.map((game) => (
                      <SelectItem key={game._id.toString()} value={game._id.toString()}>
                        {game.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select defaultValue={searchParams.format?.toString() || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Formats</SelectItem>
                    <SelectItem value="single-elimination">Single Elimination</SelectItem>
                    <SelectItem value="double-elimination">Double Elimination</SelectItem>
                    <SelectItem value="round-robin">Round Robin</SelectItem>
                    <SelectItem value="swiss">Swiss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select defaultValue={searchParams.status?.toString() || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select defaultValue={searchParams.registration?.toString() || ""}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Registration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full md:w-auto">
              Apply Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Tournaments List */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {tournaments.length > 0 
                ? `${totalTournaments} Tournament${totalTournaments !== 1 ? 's' : ''} Found` 
                : 'Tournaments'}
            </h2>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="prize-high">Highest Prize Pool</SelectItem>
                <SelectItem value="prize-low">Lowest Prize Pool</SelectItem>
                <SelectItem value="participants-high">Most Participants</SelectItem>
                <SelectItem value="participants-low">Fewest Participants</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {tournaments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      {tournament.registrationOpen ? (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                          Registration Open
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                          Registration Closed
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {tournament.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {tournament.date ? formatDate(new Date(tournament.date), "MMM d, yyyy") : "Date TBD"}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Tournaments Found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your filters or create a new tournament.</p>
              <Link href="/esports/tournaments/create" className="mt-4 inline-block">
                <Button>
                  Create Tournament
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
          
          {/* Pagination */}
          {tournaments.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    // This would be handled by client-side navigation in a real app
                  }}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => {
                        // This would be handled by client-side navigation in a real app
                      }}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => {
                    // This would be handled by client-side navigation in a real app
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Host Your Own Tournament</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create and manage your own eSports tournaments, invite players, and build your community.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/esports/tournaments/create">
                <Button size="lg">
                  Create Tournament
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/esports/organizer">
                <Button size="lg" variant="outline">
                  Organizer Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 