import { NextRequest, NextResponse } from "next/server"
import { getDefaultCountry } from "./lib/util/get-default-country"
import { getValidCountries } from "./lib/util/get-valid-countries"

// Cache for valid countries and default country
let cachedValidCountries: string[] | null = null
let cachedDefaultCountry: string | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60 * 1000 // 1 minute

// Paths that should have longer cache times (static content)
const STATIC_PATHS = [
  '/api/static',
  '/_next/static',
  '/images',
  '/fonts',
  '/icons',
  '/favicon.ico',
]

// Paths that should never be cached
const DYNAMIC_PATHS = [
  '/api/auth',
  '/api/checkout',
  '/api/cart',
]

/**
 * Get the default country and valid countries with caching
 */
async function getCountryData() {
  const now = Date.now()
  
  // Use cached data if available and not expired
  if (cachedValidCountries && cachedDefaultCountry && (now - cacheTimestamp < CACHE_TTL)) {
    return {
      validCountries: cachedValidCountries,
      defaultCountry: cachedDefaultCountry
    }
  }
  
  // Otherwise fetch fresh data
  try {
    const [validCountries, defaultCountry] = await Promise.all([
      getValidCountries(),
      getDefaultCountry()
    ])
    
    // Update cache
    cachedValidCountries = validCountries
    cachedDefaultCountry = defaultCountry
    cacheTimestamp = now
    
    return {
      validCountries,
      defaultCountry
    }
  } catch (error) {
    console.error("Error fetching country data:", error)
    
    // Fallback to whatever we have in cache, or empty arrays if nothing
    return {
      validCountries: cachedValidCountries || [],
      defaultCountry: cachedDefaultCountry || "in"
    }
  }
}

/**
 * Utility: best-effort extraction of the visitor's ISO-2 country code.
 * 1. Prefer Next.js Edge `request.geo` (works on Vercel/Cloudflare).
 * 2. Fallback to common CDN headers.
 */
function extractCountry(req: NextRequest): string | null {
  // Edge Runtime provides `request.geo`, but the typings may not include it.
  // Cast to `any` to avoid TypeScript issues in environments where it's missing.
  const geoCountry = (req as any).geo?.country ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country-code") ||
    req.headers.get("cf-ipcountry")

  if (geoCountry) {
    return geoCountry.toLowerCase()
  }

  // Fallback: try to parse region from Accept-Language (e.g., "en-IN,en;q=0.9")
  const acceptLang = req.headers.get("accept-language")
  if (acceptLang) {
    const match = acceptLang.match(/-([A-Za-z]{2})\b/)
    if (match?.[1]) {
      return match[1].toLowerCase()
    }
  }

  return null
}

/**
 * Middleware to handle region selection, caching, and performance optimization.
 */
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Skip middleware for paths that should be handled by next.config.js redirects
    // Let next.config.js redirects handle non-country paths like /about → /in/about
    const skipPaths = [
      /^\/api\//,
      /^\/\_next\//,
      /^\/favicon\.ico$/,
      /^\/sitemap\.xml$/,
      /^\/robots\.txt$/,
      /^\/server-sitemap\.xml$/,
      /^\/blog-sitemap\.xml$/,
    ]
    if (skipPaths.some((re) => re.test(pathname))) {
      return NextResponse.next()
    }

    // 1) Host normalization: force apex domain (no www)
    const currentHost = request.nextUrl.hostname
    if (currentHost && currentHost.toLowerCase().startsWith('www.')) {
      const apexHost = currentHost.replace(/^www\./i, '')
      const url = new URL(request.url)
      url.hostname = apexHost
      return NextResponse.redirect(url, 308)
    }

    // Check if the URL has Builder.io preview parameters
    const isPreviewing =
      request.nextUrl.searchParams.has("builder.preview") ||
      request.nextUrl.searchParams.has("__builder_editing__");

    // If the page is in Builder.io preview mode, skip redirect logic
    if (isPreviewing) {
      return NextResponse.next();
    }

    // Strip empty ?q parameters to avoid duplicate-URL crawl noise
    if (request.nextUrl.searchParams.has("q") && (request.nextUrl.searchParams.get("q") ?? "") === "") {
      const cleanUrl = new URL(request.url)
      cleanUrl.searchParams.delete("q")
      return NextResponse.redirect(cleanUrl, 308)
    }
    
    // Get country data from backend (cached)
    const { validCountries, defaultCountry } = await getCountryData()
    
    // Determine visitor country from request
    const visitorCountry = extractCountry(request)
    
    // First, check for nested country codes like /us/in or /us/ae
    const nestedCountryMatch = pathname.match(/^\/([a-z]{2})\/([a-z]{2})($|\/)/)
    
    if (nestedCountryMatch) {
      // Get the second country code
      const secondCountryCode = nestedCountryMatch[2]
      
      // Only redirect if the second code is a valid country code
      if (validCountries.includes(secondCountryCode)) {
        // Get the rest of the path after the second country code
        const restOfPath = pathname.substring(pathname.indexOf(secondCountryCode) + 2)
        
        // Create a new URL with just the second country code
        const newUrl = new URL(`/${secondCountryCode}${restOfPath}`, request.url)
        
        // Redirect to the normalized URL
        return NextResponse.redirect(newUrl)
      }
    }
    
    // Get country code from URL
    const urlCountryCode = pathname.split("/")[1]?.toLowerCase()
    
    // Create a response object we can modify
    let response = NextResponse.next()
    
    // Add cache headers based on path
    if (process.env.NODE_ENV === 'production') {
      // Check if the path is for static assets
      if (STATIC_PATHS.some(path => pathname.startsWith(path))) {
        // Static assets can be cached longer
        response.headers.set(
          'Cache-Control',
          'public, max-age=31536000, immutable'
        )
      } 
      // Never cache dynamic endpoints
      else if (DYNAMIC_PATHS.some(path => pathname.startsWith(path))) {
        response.headers.set(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, proxy-revalidate'
        )
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
      } 
      // For regular pages, use a balanced approach
      else {
        response.headers.set(
          'Cache-Control',
          'public, max-age=10, s-maxage=30, stale-while-revalidate=59'
        )
      }
    }

    // If URL has a cart_id parameter (from abandoned cart recovery email/link), set the cookie
    const recoveryCartId = request.nextUrl.searchParams.get("cart_id")
    if (recoveryCartId) {
      response.cookies.set("_medusa_cart_id", recoveryCartId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      })
    }

    // If URL already has a valid country code, just proceed with cache headers
    if (validCountries.includes(urlCountryCode)) {
      // Set cache ID cookie if not already set
      let cacheIdCookie = request.cookies.get("_medusa_cache_id")
      if (!cacheIdCookie) {
        response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
          maxAge: 60 * 60 * 24,
        })
      }
      return response
    }

    // Check if the URL is a static asset
    if (pathname.includes(".")) {
      return response
    }

    // Decide where to send the visitor
    const preferredCountry = visitorCountry && validCountries.includes(visitorCountry)
      ? visitorCountry
      : defaultCountry

    const isUnsupportedVisitor = !visitorCountry || !validCountries.includes(visitorCountry)

    const redirectPath = pathname === "/" ? "" : pathname
    const queryString = request.nextUrl.search ? request.nextUrl.search : ""
    const redirectUrl = `${request.nextUrl.origin}/${preferredCountry}${redirectPath}${queryString}`

    // Use permanent 308 to consolidate SEO signals on country-scoped URLs
    response = NextResponse.redirect(redirectUrl, 308)

    if (recoveryCartId) {
      response.cookies.set("_medusa_cart_id", recoveryCartId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      })
    }

    // Set cache ID cookie
    response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
      maxAge: 60 * 60 * 24,
    })

    // Flag unsupported visitors so the client can show a notice once
    if (isUnsupportedVisitor) {
      response.cookies.set("unsupported_country", "1", {
        path: "/",
        maxAge: 60 * 5, // 5 minutes is enough for first page-load
      })
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of any error, just proceed with the request
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
