"use client"

import { motion } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useState, useCallback, memo, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

// Animation variants with minimal complexity for better performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02, // Minimal stagger for better performance
      delayChildren: 0.05,
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 5 }, // Minimal animation distance
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 } // Faster animation
  }
}

// Memoize the component for better performance
const CategoryItem = memo(({ 
  category, 
  isNavigating, 
  onCategoryClick,
  isLoadingAny
}: { 
  category: HttpTypes.StoreProductCategory,
  isNavigating: boolean,
  onCategoryClick: (id: string, handle: string) => void,
  isLoadingAny: boolean
}) => {
  // Prevent all interactions when any category is loading
  const isDisabled = isNavigating || isLoadingAny;
  
  // Handle click with React state instead of direct navigation
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onCategoryClick(category.id, category.handle);
    }
  }, [category.handle, category.id, isDisabled, onCategoryClick]);
  
  return (
    <motion.div 
      variants={itemVariants} 
      layout
      className={isDisabled ? "pointer-events-none" : ""}
      data-testid={`category-item-${category.handle}`}
    >
      <div
        className={`block bg-luxury-ivory border border-luxury-gold/20 hover:border-luxury-gold/40 rounded-md overflow-hidden h-full transition-all duration-300 hover:shadow-md group relative ${
          isDisabled ? "opacity-70" : ""
        }`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View ${category.name} category`}
      >
        <div className="p-6 flex flex-col h-full">
          <h3 className="font-display text-xl text-luxury-charcoal mb-3 group-hover:text-luxury-gold transition-colors duration-300">
            {category.name}
          </h3>
          <div className="h-px w-12 bg-luxury-gold/40 mb-3 transition-all duration-300 group-hover:w-16 group-hover:bg-luxury-gold"></div>
          <p className="text-sm text-luxury-charcoal/70 mb-4 flex-grow">
            {category.description || `Discover our exquisite collection of ${category.name.toLowerCase()} pieces.`}
          </p>
          <div className="mt-auto">
            <span className="inline-flex items-center text-luxury-gold text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              {isNavigating ? "Loading..." : "Explore Collection"}
              {!isNavigating && (
                <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              )}
              {isNavigating && (
                <svg className="animate-spin ml-2 h-4 w-4 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
});

// Add display name to avoid React warnings
CategoryItem.displayName = "CategoryItem";

export const ClientCategoriesWrapper = ({ 
  categories 
}: { 
  categories: HttpTypes.StoreProductCategory[] 
}) => {
  const router = useRouter();
  // Track navigation state with a single ID
  const [navigatingId, setNavigatingId] = useState<string | null>(null);
  // Track if any navigation is in progress
  const [isNavigating, setIsNavigating] = useState(false);
  // Use a ref to track the debounce timeout
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track last navigation time to prevent rapid clicks
  const lastNavigationRef = useRef<number>(0);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);
  
  // Debounced click handler with error recovery
  const handleCategoryClick = useCallback((categoryId: string, handle: string) => {
    // Prevent multiple clicks within 1000ms
    const now = Date.now();
    if (isNavigating || (now - lastNavigationRef.current < 1000)) {
      return;
    }
    
    // Update last navigation time
    lastNavigationRef.current = now;
    
    // Set both individual and global navigation states
    setNavigatingId(categoryId);
    setIsNavigating(true);
    
    try {
      // Use a timestamp query param to force a fresh navigation
      // This avoids Next.js caching issues with dynamic routes
      const uniqueTimestamp = Date.now();
      const targetPath = `/categories/${handle}?timestamp=${uniqueTimestamp}`;
      
      // First, prefetch the target page
      router.prefetch(targetPath);
      
      // Add slight delay between prefetch and navigation
      setTimeout(() => {
        // Use replace instead of push to avoid history stack buildup
        router.replace(targetPath);
        
        // Set a timeout to reset the navigation state
        // This ensures the UI returns to normal if navigation takes too long
        navigationTimeoutRef.current = setTimeout(() => {
          setNavigatingId(null);
          setIsNavigating(false);
        }, 3000); // 3 second timeout as a safety measure
      }, 50);
    } catch (error) {
      console.error("Navigation error:", error);
      // Reset navigation state on error
      setNavigatingId(null);
      setIsNavigating(false);
      
      // Show error to user with alert
      alert("Navigation error. Please try again.");
    }
  }, [isNavigating, router]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }} // Trigger animation earlier
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {categories.map((category) => (
        <CategoryItem 
          key={`category-${category.id}-item`}
          category={category}
          isNavigating={navigatingId === category.id}
          onCategoryClick={handleCategoryClick}
          isLoadingAny={isNavigating}
        />
      ))}
    </motion.div>
  )
} 