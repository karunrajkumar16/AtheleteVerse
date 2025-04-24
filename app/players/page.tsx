import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, MapPin, Trophy } from "lucide-react"
import { getUsers } from "@/lib/db"

export default async function PlayersPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Parse search parameters
  const page = Number(searchParams.page) || 1
  const limit = 9
  const skip = (page - 1) * limit
  
  // Build filter based on search parameters
  const filter: any = {}
  
  // Fetch users from the database
  const users = await getUsers(limit, skip, filter)
  
  // Fetch total count for pagination (in a real app, you would use a separate count query)
  const totalUsers = users.length // This is a simplification
  const totalPages = Math.ceil(totalUsers / limit)
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Players</h1>
          <p className="text-muted-foreground">
            Find and connect with local athletes based on sports and skill levels.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search Players
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="search" placeholder="Search by name, sport, or location..." className="pl-8" />
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
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
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
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Select>
                <SelectTrigger id="location" className="w-full md:w-[150px]">
                  <SelectValue placeholder="Any Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Location</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="north">North Side</SelectItem>
                  <SelectItem value="south">South Side</SelectItem>
                  <SelectItem value="east">East Side</SelectItem>
                  <SelectItem value="west">West Side</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2 md:self-end">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.length > 0 ? (
            users.map((user) => (
              <Link key={user._id.toString()} href={`/players/${user._id.toString()}`} className="block group">
                <div className="overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={user.avatar || "/placeholder.svg?height=64&width=64"}
                        alt={user.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {user.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {user.location || "Location not specified"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-medium">Favorite Sports</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {user.sports && user.sports.length > 0 ? (
                            user.sports.map((sport: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                              >
                                {sport}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No sports specified</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium">Skill Levels</h4>
                        <div className="mt-1 space-y-1">
                          {user.skillLevels && user.skillLevels.length > 0 ? (
                            user.skillLevels.map((skill: { sport: string; level: number }, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-xs">{skill.sport}</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < skill.level ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No skill levels specified</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t">
                        <div className="flex items-center text-sm">
                          <Trophy className="mr-1 h-4 w-4 text-primary" />
                          <span>{user.eventsJoined ? user.eventsJoined.length : 0} events joined</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No players found. Try adjusting your filters.</p>
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
                <Link href={`/players?page=${page - 1}`}>&lt;</Link>
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
                  <Link href={`/players?page=${pageNum}`}>{pageNum}</Link>
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
                <Link href={`/players?page=${page + 1}`}>&gt;</Link>
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