import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = ['/services', '/cart', '/orders', '/profile']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !token) {
    // Redirect to sign-in page if trying to access protected route without authentication
    const url = new URL('/auth/sign-in', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/services/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/profile/:path*'
  ]
} 