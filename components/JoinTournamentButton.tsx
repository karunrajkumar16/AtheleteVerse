"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface JoinTournamentButtonProps {
  tournamentId: string
  isRegistered: boolean
  registrationOpen: boolean
  className?: string
}

export default function JoinTournamentButton({
  tournamentId,
  isRegistered,
  registrationOpen,
  className = ""
}: JoinTournamentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isParticipant, setIsParticipant] = useState(isRegistered)
  const router = useRouter()

  const handleJoinTournament = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to join tournament")
      }
      
      setIsParticipant(true)
      toast.success("Successfully registered for tournament!")
      router.refresh()
    } catch (error: any) {
      console.error("Error joining tournament:", error)
      
      if (error.message.includes("Authentication required")) {
        toast.error("Please sign in to register for tournaments")
        router.push(`/login?returnUrl=/esports/tournaments/${tournamentId}`)
      } else {
        toast.error(error.message || "Failed to register for tournament")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveTournament = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to leave tournament")
      }
      
      setIsParticipant(false)
      toast.success("Successfully unregistered from tournament")
      router.refresh()
    } catch (error: any) {
      console.error("Error leaving tournament:", error)
      toast.error(error.message || "Failed to unregister from tournament")
    } finally {
      setIsLoading(false)
    }
  }

  if (isParticipant) {
    return (
      <Button 
        onClick={handleLeaveTournament} 
        variant="outline" 
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Trophy className="h-4 w-4 mr-2" />
        )}
        Leave Tournament
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleJoinTournament} 
      variant="default" 
      className={className}
      disabled={isLoading || !registrationOpen}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Trophy className="h-4 w-4 mr-2" />
      )}
      {registrationOpen ? "Register Now" : "Registration Closed"}
    </Button>
  )
} 
