import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge-rewrite every request that DOESN'T already start with `/in` so that
 * we can serve existing pages without exposing the countryCode in the URL.
 *
 * Example: `/products` → `/in/products` (invisibly)
 *          `/`         → `/in`
 *
 * Static assets, API routes and Next.js internals are skipped for performance.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Ignore special cases ----------------------------------------------
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(?:jpg|jpeg|png|webp|avif|svg|gif|ico|css|js|woff2?|ttf)$/)
  ) {
    return
  }

  // Already under /in → let it pass
  if (pathname.startsWith('/in')) {
    return
  }

  // Rewrite keeping original query‐string intact
  const url = req.nextUrl.clone()
  url.pathname = pathname === '/' ? '/in' : `/in${pathname}`
  return NextResponse.rewrite(url)
}

// Run middleware for all routes (except the ones we exclude manually above)
export const config = {
  matcher: '/:path*'
} 