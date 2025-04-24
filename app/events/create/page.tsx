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
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    date: "",
    time: "",
    location: "",
    address: "",
    description: "",
    maxParticipants: "",
    skillLevel: "",
    image: "",
    organizerName: "",
    organizerEmail: "",
  })

  // Fetch current user if available
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/auth/me")
        const data = await response.json()
        setCurrentUser(data.user)
      } catch (error) {
        console.error("Error fetching current user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [router])

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

    // Validate form for anonymous users
    if (!currentUser && (!formData.organizerName || !formData.organizerEmail)) {
      toast.error("Please provide your name and email")
      return
    }

    try {
      setIsSubmitting(true)

      // Create a proper date-time string by combining date and time
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : 0,
          organizerId: currentUser ? currentUser._id : "anonymous",
          isAnonymous: !currentUser,
          dateTime: eventDateTime.toISOString(), // Send as ISO string
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create event")
      }

      const data = await response.json()
      toast.success("Event created successfully!")
      router.push(`/events/${data.eventId}`)
    } catch (error: any) {
      console.error("Error creating event:", error)
      toast.error(error.message || "Failed to create event. Please try again.")
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
          <Link href="/events">
            <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Fill in the details to create a new sports event</CardDescription>
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
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport</Label>
                  <Select value={formData.sport} onValueChange={(value) => handleSelectChange("sport", value)} required>
                    <SelectTrigger id="sport">
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Soccer">Football</SelectItem>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Volleyball">Volleyball</SelectItem>
                      <SelectItem value="Running">Running</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                      <SelectItem value="Table Tennis">Table Tennis</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select
                    value={formData.skillLevel}
                    onValueChange={(value) => handleSelectChange("skillLevel", value)}
                    required
                  >
                    <SelectTrigger id="skillLevel">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="All Levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location Name</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Central Park Courts"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  placeholder="Leave empty for unlimited"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event, rules, what to bring, etc."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Event Image</Label>
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
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

