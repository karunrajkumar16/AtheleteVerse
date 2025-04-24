import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Trophy, ArrowRight, Filter, Search } from "lucide-react"
import { getTournaments } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function TournamentsPage() {
  // Fetch all eSports tournaments
  const tournaments = await getTournaments(20, 0, { type: "esports" });
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">eSports Tournaments</h1>
          <p className="text-muted-foreground">Browse, join or create eSports tournaments</p>
          
          <div className="flex flex-col md:flex-row gap-4 mt-4 md:items-center md:justify-between">
            <Link href="/esports/tournaments/create">
              <Button className="bg-primary hover:bg-primary/90">
                Create New Tournament
                <Trophy className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            {/* For a future implementation - search & filter */}
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search tournaments..."
                  className="pl-8 h-10 w-full md:w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <Button variant="outline" className="flex gap-1.5">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
        
        {tournaments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <Link key={tournament._id.toString()} href={`/esports/tournaments/${tournament._id.toString()}`} className="block group">
                <Card className="overflow-hidden h-full transition-all hover:shadow-md">
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
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{tournament.title}</CardTitle>
                    <CardDescription>
                      {tournament.startDateTime ? formatDate(new Date(tournament.startDateTime), "EEEE, MMMM d, yyyy • h:mm a") : 
                       (tournament.date ? formatDate(new Date(tournament.date), "MMMM d, yyyy") : "Date TBD")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{tournament.participants ? tournament.participants.length : 0} participants</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-1 h-4 w-4" />
                        <span>Prize: {tournament.prizePool || "$0"}</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <span>Format: <span className="text-foreground">{tournament.format || "Format TBD"}</span></span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No Tournaments Found</h3>
            <p className="text-muted-foreground mt-1 mb-4">Be the first to create an eSports tournament!</p>
            <Link href="/esports/tournaments/create">
              <Button>
                Create Tournament
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}