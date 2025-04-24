import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      message: "Logged out successfully",
    })

    // auth cookie clr
    response.cookies.set({
      name: "auth-token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, 
    })

    return response
  } catch (error) {
    console.error("Error during logout:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
} 