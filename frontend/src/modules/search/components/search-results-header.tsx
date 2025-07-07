"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "@medusajs/icons"
import SearchBar from "./search-bar"
import { Button } from "@medusajs/ui"
import { RefreshCw } from "lucide-react"

type SearchResultsHeaderProps = {
  query: string
  count: number
}

const SearchResultsHeader = ({ query, count }: SearchResultsHeaderProps) => {
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const refreshSearch = () => {
    // Force a refresh of the current page
    router.refresh()
  }

  const displayCount = (count: number) => {
    if (count === 0) return "No results"
    if (count === 1) return "1 result"
    return `${count} results`
  }

  return (
    <div className="flex flex-col gap-y-4 mb-8">
      <div className="flex items-center gap-x-2">
        <button
          onClick={goBack}
          className="w-8 h-8 flex items-center justify-center text-luxury-charcoal/60 hover:text-luxury-gold transition-colors rounded-md hover:bg-luxury-ivory"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-serif">Search results</h1>
        
        <button
          onClick={refreshSearch}
          className="ml-auto w-8 h-8 flex items-center justify-center text-luxury-charcoal/60 hover:text-luxury-gold transition-colors rounded-md hover:bg-luxury-ivory"
          aria-label="Refresh search"
          title="Refresh search results"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <motion.div 
        className="max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <SearchBar autoSearch={true} />
      </motion.div>
      
      {query && (
        <motion.div
          className="flex items-center gap-x-2 text-luxury-charcoal/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <span className="text-sm">
            {displayCount(count)} for <span className="font-medium text-luxury-charcoal">"{query}"</span>
          </span>

          {count === 0 && (
            <div className="ml-4">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => {
                  // Handle chess search specially
                  if (query.toLowerCase().includes('chess')) {
                    router.push(`/categories/marble-chess-board`)
                    return
                  }
                  
                  // Default browse redirect
                  router.push(`/?q=${encodeURIComponent(query)}`)
                }}
              >
                Try browsing instead
              </Button>
            </div>
          )}
        </motion.div>
      )}
      
      <div className="h-px w-full bg-luxury-lightgold/20 mt-2" />
    </div>
  )
}

export default SearchResultsHeader 