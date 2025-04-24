import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin, Users, Gamepad2 } from "lucide-react"
import { getEvents } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function Home() {
  const featuredEvents = await getEvents(3, 0, { date: { $gte: new Date() } });
  
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Connect with Local Athletes
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Create and join sports events, connect with players of your skill level, and build your local sports
                  community.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/events">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/events">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                    Explore Events
                  </Button>
                </Link>
              </div>
            </div>
            <Image
              src="/home athelete.avif?height=400&width=500"
              width={500}
              height={400}
              alt="Athletes playing sports"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Events</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join upcoming sports events in your area and connect with local athletes.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
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
                <p className="text-muted-foreground">No upcoming events found. Check back later!</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/events">
              <Button size="lg">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <Image
              src="/download.jpg?height=400&width=500"
              width={500}
              height={400}
              alt="eSports gaming"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover order-2 lg:order-1"
            />
            <div className="flex flex-col justify-center space-y-4 order-1 lg:order-2">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm">New Feature</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">eSports Community</h2>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Connect with fellow gamers, join eSports tournaments, and level up your gaming experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/esports">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                    Explore eSports
                    <Gamepad2 className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
   
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with local athletes in just a few simple steps.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Create Your Profile</h3>
              <p className="mt-2 text-muted-foreground">
                Sign up and create your athlete profile with your sports preferences and skill levels.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Create or Join Events</h3>
              <p className="mt-2 text-muted-foreground">
                Create your own sports events or browse and join events created by other athletes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Play & Connect</h3>
              <p className="mt-2 text-muted-foreground">
                Meet up with other athletes, play your favorite sports, and build your local sports network.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Connect with Local Athletes?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community today and start playing your favorite sports with people in your area.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

