import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { csrfProtection } from './lib/middleware/csrf.middleware'

export async function middleware(request: NextRequest): Promise<NextResponse> {

  // console.log('AUTH: ', request.auth)
  if (request.method === "GET") {
    const response = NextResponse.next()
    // const token = request.cookies.get("session")?.value ?? null

    // if (token !== null) {
    //   // Only extend cookie expiration on GET requests since we can be sure a new session wasn't set when handling the request.
    //   response.cookies.set("session", token, {
    //     path: "/",
    //     maxAge: 60 * 60 * 24 * 30,
    //     sameSite: "lax",
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production"
    //   })
    // }

    // if (token === null) {
    //   // return NextResponse.json({ error: 'No tiene los permisos para ver esta página' }, { status: 401 })
    //   return NextResponse.redirect(new URL('/login', request.url))
    // }

    return response
  }

  await csrfProtection(request)

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!login|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}