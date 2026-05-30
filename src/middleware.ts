import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isApplications = req.nextUrl.pathname.startsWith('/applications')

  if ((isDashboard || isApplications) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/applications/:path*', '/auth/:path*'],
}