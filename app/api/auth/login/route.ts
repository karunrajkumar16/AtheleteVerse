import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/db"
import { compare } from "bcrypt"
import { sign } from "jsonwebtoken"
import authConfig from "@/config/auth.json"

// Get JWT secret from config file or fallback to environment variable
const JWT_SECRET = authConfig.jwtSecret || process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Check if required fields are provided
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get user by email
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Compare password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token
    const token = sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })

    // Set cookie in the response
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
} 