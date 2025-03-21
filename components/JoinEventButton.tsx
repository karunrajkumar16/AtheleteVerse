"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface JoinEventButtonProps {
  eventId: string
  isFull: boolean
  isParticipant: boolean
  userId?: string
}

export default function JoinEventButton({ 
  eventId, 
  isFull, 
  isParticipant, 
  userId 
}: JoinEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const joinEvent = async () => {
    if (!userId) {
      // Redirect to login if user is not logged in
      router.push(`/login?redirect=/events/${eventId}`)
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join event")
      }

      // Show success message
      toast.success("Successfully joined event!", {
        description: "You have been added to the participants list.",
        action: {
          label: "View Details",
          onClick: () => router.push(`/events/${eventId}`),
        },
      })

      // Refresh the page to show updated data
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to join event", {
        description: error.message || "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const leaveEvent = async () => {
    if (!userId) {
      return
    }

    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/events/${eventId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to leave event")
      }

      // Show success message
      toast.success("Successfully left event", {
        description: "You have been removed from the participants list.",
      })

      // Refresh the page to show updated data
      router.refresh()
    } catch (error: any) {
      toast.error("Failed to leave event", {
        description: error.message || "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isParticipant) {
    return (
      <Button 
        className="w-full"
        variant="outline"
        onClick={leaveEvent}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Leave Event"}
      </Button>
    )
  }

  return (
    <Button 
      className="w-full"
      onClick={joinEvent}
      disabled={isFull || isLoading}
    >
      {isLoading ? "Processing..." : "Join Event"}
    </Button>
  )
} 