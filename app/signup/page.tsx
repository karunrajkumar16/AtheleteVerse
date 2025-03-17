"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    favoriteSports: "",
    esportsInterest: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          location: formData.location,
          sports: formData.favoriteSports ? [formData.favoriteSports] : [],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Show success message
      toast.success("Account created successfully!")

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create an account on AthleteVerse</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  placeholder="John" 
                  required 
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  placeholder="Doe" 
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                placeholder="m@example.com" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword"
                type="password" 
                required 
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location"
                placeholder="City, State" 
                required 
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favoriteSports">Favorite Sports</Label>
              <Select 
                value={formData.favoriteSports}
                onValueChange={(value) => handleSelectChange("favoriteSports", value)}
              >
                <SelectTrigger id="favoriteSports">
                  <SelectValue placeholder="Select your favorite sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="cricket">Cricket</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="badminton">Badminton</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                You can add more sports to your profile after signing up
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="esportsInterest">Interested in eSports?</Label>
              <Select
                value={formData.esportsInterest}
                onValueChange={(value) => handleSelectChange("esportsInterest", value)}
              >
                <SelectTrigger id="esportsInterest">
                  <SelectValue placeholder="Select your interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

