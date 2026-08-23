import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['id', 'en']
const defaultLocale = 'id'

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  
  // Exclude static files or internal routes just in case the matcher didn't catch them
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/upload') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/export-csv') ||
    pathname.includes('.')
  ) {
    return
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  // e.g. incoming request is /artikel
  // The new URL is now /id/artikel
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and explicitly ignored paths
    '/((?!_next|upload|uploads|export-csv|api|favicon.ico).*)',
  ],
}
