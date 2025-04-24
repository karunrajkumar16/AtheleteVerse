import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, getCollection } from "@/lib/db"
import { hash } from "bcrypt"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, location, sports } = body

    // Check if required fields are provided
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
      location,
      sports: sports || [],
      eventsJoined: [],
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const users = await getCollection("users")
    const result = await users
      .find({}, { projection: { password: 0 } }) // Exclude password
      .limit(limit)
      .skip(skip)
      .toArray()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

