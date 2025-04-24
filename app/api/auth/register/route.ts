import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"
import { hash } from "bcrypt"
import { sign } from "jsonwebtoken"
import authConfig from "@/config/auth.json"

const JWT_SECRET = authConfig.jwtSecret || process.env.JWT_SECRET || "your-secret-key"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, location, sports } = body

   
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const result = await createUser({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      location: location || "",
      sports: sports || [],
      skillLevels: [],
      eventsJoined: [],
      avatar: "/placeholder.svg?height=200&width=200",
      bio: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    //  JWT token
    const token = sign(
      {
        id: result.insertedId,
        email: email.toLowerCase(),
        name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Create response
    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: result.insertedId,
          name,
          email: email.toLowerCase(),
        },
      },
      { status: 201 }
    )

  
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
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
} 