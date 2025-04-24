import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { getUserById } from "./db"
import authConfig from "../config/auth.json"

// Get JWT secret from config file or fallback to environment variable
const JWT_SECRET = authConfig.jwtSecret || process.env.JWT_SECRET || "your-secret-key"

export async function getCurrentUser() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    // Verify the token
    const decoded = verify(token, JWT_SECRET) as {
      id: string
      email: string
      name: string
    }

    // Get the user from the database
    const user = await getUserById(decoded.id)

    if (!user) {
      return null
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
} 