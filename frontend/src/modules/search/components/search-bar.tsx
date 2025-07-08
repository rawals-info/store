"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { debounceSearch } from "@lib/client/search-utils"
import useSWR from "swr"

// Simple in-memory cache for search suggestions scoped to the browser session.
// Keyed by `countryCode|query`, values contain `{ ts: number, data: HttpTypes.StoreProduct[] }`.
// We keep it small and rely on garbage collection when the page reloads.
const SUGGESTION_CACHE = new Map<string, { ts: number; data: HttpTypes.StoreProduct[] }>()

// Suggestions are re-fetched after this many ms.
const SUGGESTION_TTL = 30_000 // 30 seconds

// Fetcher using in-memory cache first
const suggestionFetcher = async (url: string) => {
  const [_, countryCode, query] = url.split("|")
  const cacheKey = `${countryCode}|${query}`
  const cached = SUGGESTION_CACHE.get(cacheKey)
  if (cached && Date.now() - cached.ts < SUGGESTION_TTL) {
    return cached.data
  }

  const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(query)}&countryCode=${countryCode}`)
  if (!res.ok) {
    throw new Error("Suggest fetch failed")
  }
  const data = await res.json()
  const products = data.products || []
  SUGGESTION_CACHE.set(cacheKey, { ts: Date.now(), data: products })
  return products
}

type SearchBarProps = {
  className?: string
  isHomePage?: boolean
  isScrolled?: boolean
  onSearchChange?: (value: string) => void
  autoSearch?: boolean
  autoFocus?: boolean
}

const SearchBar = ({
  className,
  isHomePage = false,
  isScrolled = false,
  onSearchChange,
  autoSearch = false,
  autoFocus = false,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() || ""
  const currentCountryCode = pathname.split("/")[1] || ""

  const {
    data: suggestions = [],
    isLoading: loadingSuggest,
  } = useSWR(debouncedQuery ? `suggest|${currentCountryCode}|${debouncedQuery}` : null, suggestionFetcher, {
    dedupingInterval: 5000,
    revalidateOnFocus: false,
  })
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search term from URL if present
  useEffect(() => {
    const query = searchParams?.get("q")
    if (query) {
      setSearchTerm(query)
    }
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchParams, autoFocus])

  // Create debounced search handler for suggestions only
  const debouncedSearch = useCallback(
    debounceSearch((value: string) => {
      if (onSearchChange) {
        onSearchChange(value)
      }
      // Fetch live suggestions
      setDebouncedQuery(value.trim())
      
      // Removed auto navigation to search page
      setIsSearching(false)
    }),
    [router, onSearchChange, currentCountryCode]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (onSearchChange || autoSearch) {
      setIsSearching(true)
      debouncedSearch(value)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearching(true)
      const prefix = currentCountryCode ? `/${currentCountryCode}` : ""
      router.push(`${prefix}/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsSearching(false)
    setDebouncedQuery("")
    if (onSearchChange) {
      onSearchChange("")
    }
    inputRef.current?.focus()
  }

  // Determine text color based on scroll and page
  const getTextColor = () => {
    // Header is now dark across the site; use white text for clarity.
    return isHomePage && !isScrolled ? "text-white placeholder:text-white/70" : "text-white placeholder:text-white/60"
  }

  return (
    <form
      onSubmit={handleSearch}
      className={clx(
        "relative flex items-center group",
        className
      )}
    >
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search products..."
        className={clx(
          "bg-transparent border-b transition-all duration-200 outline-none text-sm py-1 pr-8 w-full",
          getTextColor(),
          isFocused ? "border-luxury-gold" : isHomePage && !isScrolled ? "border-white/30" : "border-white/20",
          "focus:border-luxury-gold"
        )}
      />
      {searchTerm ? (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-8 text-luxury-charcoal/50 hover:text-luxury-gold transition-colors"
        >
          <XMark className="w-4 h-4" />
          <span className="sr-only">Clear search</span>
        </button>
      ) : null}
      <button
        type="submit"
        className={clx(
          "absolute right-0 transition-colors",
          isHomePage && !isScrolled ? "text-white/70 hover:text-white" : "text-white/70 hover:text-luxury-gold"
        )}
      >
        {isSearching ? (
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-luxury-gold animate-spin" />
        ) : (
          <MagnifyingGlass className="w-5 h-5" />
        )}
        <span className="sr-only">Search</span>
      </button>
      
      {isFocused && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 border border-luxury-lightgold/20 w-full sm:w-[540px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-luxury-lightgold/20 max-h-96 overflow-y-auto">
            {/* Suggestions column */}
            <div className="py-2">
              <h4 className="px-4 mb-2 text-xs font-medium text-luxury-charcoal/60 uppercase">Suggestions</h4>
              {loadingSuggest ? (
                <div className="px-4 py-2 text-sm text-luxury-charcoal/70">Searching…</div>
              ) : suggestions.length ? (
                suggestions.map((p: HttpTypes.StoreProduct) => (
                  <button
                    key={`sugg-${p.id}`}
                    className="w-full text-left px-4 py-2 hover:bg-luxury-cream/40 text-sm text-luxury-charcoal truncate"
                    onMouseDown={() => { // use onMouseDown to avoid blur before click
                      router.push(`/${currentCountryCode}/search?q=${encodeURIComponent(p.title)}`)
                      setIsFocused(false)
                    }}
                  >
                    {p.title}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-luxury-charcoal/70">No suggestions</div>
              )}
            </div>

            {/* Products column */}
            <div className="py-2">
              <h4 className="px-4 mb-2 text-xs font-medium text-luxury-charcoal/60 uppercase">Products</h4>
              {loadingSuggest ? (
                <div className="px-4 py-2 text-sm text-luxury-charcoal/70">Searching…</div>
              ) : suggestions.length ? (
                suggestions.map((product: HttpTypes.StoreProduct) => (
                  <LocalizedClientLink
                    key={product.id}
                    href={`/${currentCountryCode}/products/${product.handle}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-luxury-cream/40"
                    onClick={() => {
                      setIsFocused(false)
                    }}
                  >
                    {product.thumbnail && (
                      <img src={product.thumbnail} alt={product.title} className="w-10 h-10 object-cover rounded" />
                    )}
                    <span className="text-sm text-luxury-charcoal break-words whitespace-normal">
                      {product.title}
                    </span>
                  </LocalizedClientLink>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-luxury-charcoal/70">No products</div>
              )}
            </div>
          </div>

          {/* Footer search shortcut */}
          <button
            onMouseDown={() => {
              router.push(`/${currentCountryCode}/search?q=${encodeURIComponent(searchTerm.trim())}`)
              setIsFocused(false)
            }}
            className="block w-full text-left px-4 py-3 bg-luxury-cream/40 hover:bg-luxury-cream text-sm text-luxury-charcoal border-t border-luxury-lightgold/20"
          >
            Search for "{searchTerm}"
          </button>
        </div>
      )}
    </form>
  )
}

export default SearchBar 