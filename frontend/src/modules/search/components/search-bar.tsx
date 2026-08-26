"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
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
  /**
   * Set to true to render the search bar with charcoal-colored text and placeholder
   * (useful when placing the component on light backgrounds like the mobile menu).
   */
  useCharcoal?: boolean
}

const SearchBar = ({
  className,
  isHomePage = false,
  isScrolled = false,
  onSearchChange,
  autoSearch = false,
  autoFocus = false,
  useCharcoal = false,
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
    if (useCharcoal) {
      return "!text-luxury-charcoal placeholder:!text-luxury-charcoal/60"
    }
    // Default white text when on dark header backgrounds
    return isHomePage && !isScrolled
      ? "text-white placeholder:text-white/70"
      : "text-white placeholder:text-white/60"
  }

  return (
    <form
      onSubmit={handleSearch}
      className={clx(
        "relative flex items-center w-full",
        className
      )}
    >
      <div className={clx(
        "flex items-center w-full rounded-full border transition-all duration-200 px-3.5 py-1.5",
        isFocused
          ? "border-petha-amber bg-white shadow-md ring-2 ring-petha-amber/20"
          : "border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/70 hover:border-amber-300 shadow-sm"
      )}>
        <MagnifyingGlass className="w-4 h-4 mr-2.5 flex-shrink-0 text-petha-amber" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 250)}
          placeholder="Search fresh Agra petha, namkeen, gift boxes..."
          className="bg-transparent outline-none text-xs sm:text-sm w-full font-jakarta text-slate-800 placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMark className="w-3.5 h-3.5" />
          </button>
        )}
        {isSearching && (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent border-petha-amber animate-spin ml-1 flex-shrink-0" />
        )}
      </div>

      {isFocused && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl z-50 border border-slate-100 w-full sm:w-[500px] overflow-hidden">
          <div className="p-2 max-h-96 overflow-y-auto divide-y divide-slate-100">
            <div className="py-2">
              <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-jakarta">
                Live Suggestions
              </div>
              {loadingSuggest ? (
                <div className="px-3 py-3 text-xs text-slate-500 font-jakarta flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-t-transparent border-petha-amber animate-spin" />
                  Searching fresh sweets...
                </div>
              ) : suggestions.length ? (
                suggestions.map((p: HttpTypes.StoreProduct) => (
                  <button
                    key={`sugg-${p.id}`}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50/70 rounded-xl text-xs sm:text-sm text-slate-800 flex items-center justify-between group transition-colors"
                    onMouseDown={() => {
                      router.push(`/${currentCountryCode}/products/${p.handle}`)
                    }}
                  >
                    <span className="font-medium group-hover:text-petha-amber transition-colors font-jakarta truncate">
                      {p.title}
                    </span>
                    <span className="text-[11px] font-semibold text-petha-amber ml-2 flex-shrink-0 uppercase tracking-wider">
                      View →
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-slate-400 font-jakarta">No matching sweets found</div>
              )}
            </div>
          </div>

          {/* Footer search shortcut */}
          <button
            onMouseDown={() => {
              router.push(`/${currentCountryCode}/search?q=${encodeURIComponent(searchTerm.trim())}`)
              setIsFocused(false)
            }}
            className="block w-full text-center py-2.5 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-petha-amber border-t border-amber-100 transition-colors font-jakarta"
          >
            See all results for "{searchTerm}" →
          </button>
        </div>
      )}
    </form>
  )
}

export default SearchBar 