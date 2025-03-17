import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"
import authConfig from "./config/auth.json"

// Get JWT secret from config file or fallback to environment variable
const JWT_SECRET = authConfig.jwtSecret || process.env.JWT_SECRET || "your-secret-key"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = 
    path === "/" || 
    path === "/login" || 
    path === "/signup" || 
    path.startsWith("/api/") ||
    path.startsWith("/_next/") ||
    path.startsWith("/static/") ||
    path.startsWith("/events") ||
    path.startsWith("/players") ||
    path.startsWith("/esports") ||
    path.includes(".")

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Protected paths that require authentication
  const protectedPaths = [
    "/profile",
    "/profile/edit",
    "/teams/create",
  ]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  )

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || ""

  // If there's no token and the path is protected, redirect to login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If there's a token, try to verify it
  if (token) {
    try {
      // Verify the token
      verify(token, JWT_SECRET)
      
      // If the token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // If the token is invalid and the path is protected, redirect to login
      if (isProtectedPath) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }
  }
  
  // Allow access by default
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
} 