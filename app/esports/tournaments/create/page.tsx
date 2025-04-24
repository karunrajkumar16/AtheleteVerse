"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getGames } from "@/lib/db"

export default function CreateTournamentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [games, setGames] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    game: "",
    gameMode: "",
    platform: "",
    format: "Single Elimination",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "Online",
    description: "",
    maxParticipants: "",
    prizePool: "",
    entryFee: "0",
    rules: "",
    image: "",
    organizerName: "",
    organizerEmail: "",
    discordLink: "",
    gameType: "fps",
  })

  // Fetch current user and games
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch current user
        const userResponse = await fetch("/api/auth/me")
        const userData = await userResponse.json()
        setCurrentUser(userData.user)
        
        // Fetch games
        const gamesResponse = await fetch("/api/games")
        const gamesData = await gamesResponse.json()
        setGames(gamesData || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error loading data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validation
      if (!formData.title || !formData.game || !formData.startDate || !formData.startTime) {
        toast.error("Please fill in all required fields")
        return
      }
      
      setIsSubmitting(true)
      
      // Parse dates and times
      let startDateTime
      let endDateTime = null
      
      try {
        // Parse start date and time
        const [startYear, startMonth, startDay] = formData.startDate.split("-").map(Number)
        const [startHour, startMinute] = formData.startTime.split(":").map(Number)
        startDateTime = new Date(startYear, startMonth - 1, startDay, startHour, startMinute)
        
        // Parse end date and time if provided
        if (formData.endDate && formData.endTime) {
          const [endYear, endMonth, endDay] = formData.endDate.split("-").map(Number)
          const [endHour, endMinute] = formData.endTime.split(":").map(Number)
          endDateTime = new Date(endYear, endMonth - 1, endDay, endHour, endMinute)
        }
      } catch (e) {
        toast.error("Invalid date or time format")
        setIsSubmitting(false)
        return
      }
      
      // Process rules - convert from text to structured format
      let processedRules: { title: string; description: string }[] = [];
      if (formData.rules) {
        // If rules is a simple text, convert it to an array of rule objects
        const rulesText = formData.rules.trim();
        if (rulesText) {
          // Split by newlines to create separate rules
          const ruleLines = rulesText.split('\n').filter(line => line.trim().length > 0);
          
          processedRules = ruleLines.map((line, index) => ({
            title: `Rule ${index + 1}`,
            description: line.trim()
          }));
        }
      }
      
      // Generate a clearer tournament object with all required fields
      const tournamentData = {
        title: formData.title,
        game: formData.game,
        gameMode: formData.gameMode,
        platform: formData.platform,
        format: formData.format || "Single Elimination",
        startDate: formData.startDate, // Keep for backward compatibility
        startTime: formData.startTime, // Keep for backward compatibility
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime ? endDateTime.toISOString() : null,
        location: formData.location || "Online",
        description: formData.description,
        maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : 0,
        prizePool: formData.prizePool || "0",
        entryFee: formData.entryFee || "0",
        rules: processedRules, // Use the processed rules array
        image: formData.image,
        organizerName: formData.organizerName || (currentUser ? currentUser.name : ""),
        organizerEmail: formData.organizerEmail || (currentUser ? currentUser.email : ""),
        discordLink: formData.discordLink,
        gameType: formData.gameType,
        type: "esports",
        organizerId: currentUser ? currentUser._id : "anonymous",
        isAnonymous: !currentUser,
        registrationOpen: true, // Default to open registration
      }

      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tournamentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tournament")
      }

      const data = await response.json()
      toast.success("Tournament created successfully!")
      router.push(`/esports/tournaments/${data.tournamentId}`)
    } catch (error: any) {
      console.error("Error creating tournament:", error)
      toast.error(error.message || "Failed to create tournament. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Back button */}
        <div>
          <Link href="/esports/tournaments">
            <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Tournaments
            </Button>
          </Link>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" /> Create New Tournament
            </CardTitle>
            <CardDescription>Fill in the details to create a new eSports tournament</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Organizer info for anonymous users */}
              {!currentUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="organizerName">Your Name</Label>
                    <Input
                      id="organizerName"
                      name="organizerName"
                      placeholder="Enter your name"
                      value={formData.organizerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizerEmail">Your Email</Label>
                    <Input
                      id="organizerEmail"
                      name="organizerEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.organizerEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Tournament Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter tournament title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="game">Game</Label>
                  <Select value={formData.game} onValueChange={(value) => handleSelectChange("game", value)} required>
                    <SelectTrigger id="game">
                      <SelectValue placeholder="Select game" />
                    </SelectTrigger>
                    <SelectContent>
                      {games.length > 0 ? (
                        games.map((game) => (
                          <SelectItem key={game._id} value={game.title}>
                            {game.title}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="Valorant">Valorant</SelectItem>
                          <SelectItem value="League of Legends">League of Legends</SelectItem>
                          <SelectItem value="Dota 2">Dota 2</SelectItem>
                          <SelectItem value="Counter-Strike 2">Counter-Strike 2</SelectItem>
                          <SelectItem value="Fortnite">Fortnite</SelectItem>
                          <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                          <SelectItem value="FIFA">FIFA</SelectItem>
                          <SelectItem value="Rocket League">Rocket League</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gameType">Game Category</Label>
                  <Select
                    value={formData.gameType}
                    onValueChange={(value) => handleSelectChange("gameType", value)}
                    required
                  >
                    <SelectTrigger id="gameType">
                      <SelectValue placeholder="Select game category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fps">FPS</SelectItem>
                      <SelectItem value="moba">MOBA</SelectItem>
                      <SelectItem value="battle-royale">Battle Royale</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => handleSelectChange("platform", value)}
                    required
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="PlayStation">PlayStation</SelectItem>
                      <SelectItem value="Xbox">Xbox</SelectItem>
                      <SelectItem value="Nintendo Switch">Nintendo Switch</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Cross Platform">Cross Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gameMode">Game Mode</Label>
                  <Input
                    id="gameMode"
                    name="gameMode"
                    placeholder="e.g. 5v5, Battle Royale"
                    value={formData.gameMode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Tournament Format</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => handleSelectChange("format", value)}
                    required
                  >
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Elimination">Single Elimination</SelectItem>
                      <SelectItem value="Double Elimination">Double Elimination</SelectItem>
                      <SelectItem value="Round Robin">Round Robin</SelectItem>
                      <SelectItem value="Swiss System">Swiss System</SelectItem>
                      <SelectItem value="Group Stage">Group Stage + Playoffs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    value={formData.startDate} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    name="startTime" 
                    type="time" 
                    value={formData.startTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date" 
                    value={formData.endDate} 
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input 
                    id="endTime" 
                    name="endTime" 
                    type="time" 
                    value={formData.endTime} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Maximum Participants</Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    placeholder="e.g. 64, 128"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="2"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prizePool">Prize Pool (Optional)</Label>
                  <Input
                    id="prizePool"
                    name="prizePool"
                    placeholder="e.g. $500, Merchandise"
                    value={formData.prizePool}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryFee">Entry Fee</Label>
                  <Input
                    id="entryFee"
                    name="entryFee"
                    placeholder="0 for free entry"
                    value={formData.entryFee}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discordLink">Discord Link (Optional)</Label>
                  <Input
                    id="discordLink"
                    name="discordLink"
                    placeholder="Discord server link"
                    value={formData.discordLink}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your tournament"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Rules & Guidelines</Label>
                <Textarea
                  id="rules"
                  name="rules"
                  placeholder="Tournament rules, guidelines, and additional information"
                  value={formData.rules}
                  onChange={handleChange}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Tournament Banner</Label>
                <ImageUpload onImageUploaded={handleImageUploaded} />
                {formData.image && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Image uploaded successfully
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Tournament..." : "Create Tournament"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 