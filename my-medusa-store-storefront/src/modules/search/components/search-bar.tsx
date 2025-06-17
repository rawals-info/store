"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
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
}

const SearchBar = ({
  className,
  isHomePage = false,
  isScrolled = false,
  onSearchChange,
  autoSearch = false,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Load search term from URL if present
  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchTerm(query)
    }
  }, [searchParams])

  // Create debounced search handler
  const debouncedSearch = useCallback(
    debounceSearch((value: string) => {
      if (onSearchChange) {
        onSearchChange(value)
      }
      
      if (autoSearch && value.trim()) {
        setIsSearching(false)
        router.push(`/search?q=${encodeURIComponent(value.trim())}`)
      }
    }),
    [router, onSearchChange, autoSearch]
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
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setIsSearching(false)
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md py-2 px-1 z-50 border border-luxury-lightgold/20">
          <div className="px-2 py-1 text-xs text-luxury-charcoal/70">
            Press Enter to search for "{searchTerm}"
          </div>
        </div>
      )}
    </form>
  )
}

export default SearchBar 