import { type NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const body = await req.json()

    // Don't allow password updates through this endpoint
    const { password, ...updateData } = body

    const result = await updateUser(userId, updateData)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

