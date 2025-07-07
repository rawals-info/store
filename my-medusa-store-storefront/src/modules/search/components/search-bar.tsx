"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { debounceSearch } from "@lib/client/search-utils"

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
  const [suggestions, setSuggestions] = useState<HttpTypes.StoreProduct[]>([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname() || ""
  // Determine current country code from url (expects /{countryCode}/...)
  const currentCountryCode = pathname.split("/")[1] || ""

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
      fetchSuggestions(value)
      
      // Removed auto navigation to search page
      setIsSearching(false)
    }),
    [router, onSearchChange, currentCountryCode]
  )

  const fetchSuggestions = useCallback(
    debounceSearch(async (value: string) => {
      if (!value.trim()) {
        setSuggestions([])
        return
      }
      try {
        setLoadingSuggest(true)
        const res = await fetch(
          `/api/search-suggest?q=${encodeURIComponent(value.trim())}&countryCode=${currentCountryCode}`
        )
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.products || [])
        }
      } catch (e) {
        console.error("Suggestion fetch error", e)
      } finally {
        setLoadingSuggest(false)
      }
    }, 300),
    [currentCountryCode]
  )

  // Handle input change with debounce
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
    setSuggestions([])
    if (onSearchChange) {
      onSearchChange("")
    }
    inputRef.current?.focus()
  }

  // Determine text color based on scroll and page
  const getTextColor = () => {
    if (isHomePage && !isScrolled) {
      return "text-white placeholder:text-white/70" // White text on transparent background for homepage
    }
    return "text-luxury-charcoal placeholder:text-luxury-charcoal/50" // Dark text for all other cases
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
          isFocused ? "border-luxury-gold" : isHomePage && !isScrolled ? "border-white/30" : "border-luxury-charcoal/20",
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
          isHomePage && !isScrolled ? "text-white/70 hover:text-white" : "text-luxury-charcoal/50 hover:text-luxury-gold"
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
                suggestions.map((p) => (
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
                suggestions.map((product) => (
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