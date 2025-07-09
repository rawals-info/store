"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { clx } from "@medusajs/ui"
import CartButton from "@modules/layout/components/cart-button"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RegionSelector from "@modules/layout/components/region-selector"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CurrencySwitcher from "@modules/layout/components/currency-switcher"
import { usePathname } from "next/navigation"
import SearchBar from "@modules/search/components/search-bar"
import CategoryDropdown from "@modules/layout/components/category-dropdown/index"

const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()
  
  // Extract country code from pathname
  const countryCode = pathname?.split('/')[1] || 'us'
  
  // Check if we're on the homepage (root country path)
  const isHomePage = pathname?.split('/').length === 2
  
  // Transform values based on scroll position with more subtle luxury animations
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.98])
  const headerScale = useTransform(scrollY, [0, 50], [1, 0.99])
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 6px 24px rgba(0,0,0,0.03), 0px 2px 8px rgba(212,175,55,0.1)"]
  )
  
  // Use transparent background for homepage initially, solid after scroll
  // For other pages, always use solid background
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    isHomePage ? ["rgba(255,255,255,0)", "rgba(255,255,255,0.97)"] : ["rgb(255,255,255)", "rgb(255,255,255)"]
  )
  
  // Default links so the header still renders without Tina
  const defaultNavLinks = [
    { href: "/", label: "Home", testId: "nav-home-link" },
    { href: "/products", label: "Shop", testId: "nav-shop-link" },
    { href: "/categories", label: "Categories", testId: "nav-categories-link" },
    { href: "/about", label: "About", testId: "nav-about-link" },
  ]
  
  const defaultRightLinks = [
    { href: "/account", label: "Account", testId: "nav-account-link" },
    { href: "/contact", label: "Contact", testId: "nav-contact-link" },
  ]
  
  // Dynamically import Tina client only in browser so build doesn't fail
  let tinaClientPromise: Promise<any> | null = null
  const getTinaClient = async () => {
    if (!tinaClientPromise) {
      tinaClientPromise = import("../../../../../tina/__generated__/client").then(m => m.default || m)
    }
    return tinaClientPromise
  }
  
  const [navLinks, setNavLinks] = useState(() => defaultNavLinks)
  const [rightLinks, setRightLinks] = useState(() => defaultRightLinks)

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const client = await getTinaClient()
        const res = await client.queries.site({ relativePath: "header.json" })
        const header = res?.data?.site?.header
        if (header) {
          if (header.links?.length) setNavLinks(header.links as any)
          if (header.rightLinks?.length) setRightLinks(header.rightLinks as any)
        }
      } catch (e) {
        // silent – keeps defaults
      }
    }
    if (typeof window !== "undefined") fetchHeader()
  }, [])

  // Animation variants for links with refined motion
  const linkVariants = {
    hover: {
      y: -1,
      transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] }
    }
  }

  // Animation variants for mobile menu items
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }
  
  // Update isScrolled state based on scroll position
  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", updateScrollState)
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      const regionsData = await listRegions()
      setRegions(regionsData)
    }
    fetchRegions()
  }, [])

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Determine text color based on scroll and page
  const getTextColor = () => {
    if (isHomePage && !isScrolled) {
      return "text-white" // White text on transparent background for homepage
    }
    return "text-luxury-charcoal" // Dark text for all other cases
  }

  return (
    <>
      <motion.header
        className={clx(
          "fixed top-0 inset-x-0 z-[40] group transition-colors duration-500 w-full overflow-visible",
          {
            "border-b border-luxury-gold/10": isScrolled,
            "backdrop-blur-sm": isScrolled,
          }
        )}
        style={{
          opacity: headerOpacity,
          scale: headerScale,
          boxShadow: headerShadow,
          backgroundColor: headerBg,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.7, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1
        }}
      >
        {/* Decorative gold gradient line that appears when scrolled */}
        <motion.div 
          className={`absolute top-0 left-0 right-0 h-[2px] ${isScrolled ? 'gold-gradient opacity-80' : 'gold-gradient opacity-30'}`}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        />
        
        {/* Subtle glow effect that appears when scrolled */}
        {isScrolled && (
          <motion.div 
            className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-luxury-gold/30 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
        
        <div className={`w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ${getTextColor()} h-full transition-all duration-300 box-border ${
          isScrolled ? "py-0 h-16" : "py-1 h-20"
        }`}>
          <div className="w-full flex items-center justify-between h-full relative">
            <div className="flex-1 basis-0 h-full flex items-center">
              {/* Mobile menu button */}
              <div className="small:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={`flex items-center text-sm font-medium tracking-wide group transition-colors duration-300 ${
                    isHomePage && !isScrolled ? "text-white hover:text-luxury-lightgold" : "text-luxury-charcoal hover:text-luxury-gold"
                  }`}
                  aria-label="Open menu"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                  <span className="sr-only small:not-sr-only">Menu</span>
                </button>
              </div>
              
              {/* Navigation links - desktop */}
              <div className="hidden small:flex items-center gap-x-8 h-full">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href || 
                    (link.href !== "/" && pathname?.startsWith(link.href))
                  const isCategories = link.href === "/categories"
                  
                  return (
                    <motion.div 
                      key={link.href} 
                      className="relative"
                      whileHover="hover"
                      variants={linkVariants}
                    >
                      <LocalizedClientLink
                        className={`text-sm hover:text-luxury-gold transition-colors duration-200 tracking-wide py-2 whitespace-nowrap ${
                          isHomePage && !isScrolled ? "text-white" : "text-luxury-charcoal"
                        } ${isActive ? "text-luxury-gold" : ""}`}
                        href={link.href}
                        data-testid={link.testId}
                        onMouseEnter={() => {
                          setHoveredLink(link.href)
                          if (isCategories) setCategoryDropdownOpen(true)
                        }}
                        onMouseLeave={() => {
                          setHoveredLink(null)
                          if (isCategories) setCategoryDropdownOpen(false)
                        }}
                      >
                        {link.label}
                      </LocalizedClientLink>
                      {(hoveredLink === link.href || isActive) && (
                        <motion.div 
                          className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-luxury-gold"
                          layoutId="underline"
                          initial={{ width: 0, opacity: 0, left: "25%" }}
                          animate={{ width: "100%", opacity: 1, left: 0 }}
                          exit={{ width: 0, opacity: 0, left: "75%" }}
                          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                        />
                      )}
                      
                      {/* Render category dropdown if this is the Categories link */}
                      {isCategories && (
                        <div className="relative">
                          <CategoryDropdown 
                            countryCode={countryCode}
                            isOpen={categoryDropdownOpen}
                            onMouseEnter={() => setCategoryDropdownOpen(true)}
                            onMouseLeave={() => setCategoryDropdownOpen(false)}
                          />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Logo with refined animations */}
            <motion.div 
              className="flex items-center h-full"
              animate={{ 
                scale: isScrolled ? 0.95 : 1,
                y: isScrolled ? -1 : 0
              }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <LocalizedClientLink href="/" className="relative group">
                <h1 className={`font-serif text-xl md:text-2xl tracking-wide ${
                  isHomePage && !isScrolled ? "text-white" : "text-luxury-charcoal"
                }`}>
                  IMPERIAL CRAFT OF INDIA
                </h1>
                <div className={`text-[10px] tracking-widest uppercase text-center -mt-1 opacity-80 ${
                  isHomePage && !isScrolled ? "text-white" : "text-luxury-charcoal"
                }`}>
                  Fine Hand-Crafts
                </div>
                <motion.div 
                  className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold group-hover:w-full"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </LocalizedClientLink>
            </motion.div>
            
            {/* Right side items: Account, Cart, etc. */}
            <div className="flex-1 basis-0 flex items-center justify-end gap-x-3 sm:gap-x-6">
              {/* Search Bar - Added to desktop view */}
              <div className="hidden small:block w-1/2 ml-8">
                <SearchBar
                  isHomePage={isHomePage}
                  isScrolled={isScrolled}
                  autoSearch={true}
                />
              </div>
              
              <div className="hidden small:flex items-center gap-x-6">
                {rightLinks.map((link, i) => (
                  <motion.div 
                    key={link.href} 
                    className="relative"
                    whileHover="hover"
                    variants={linkVariants}
                  >
                    <LocalizedClientLink
                      className={`text-sm hover:text-luxury-gold transition-colors duration-200 tracking-wide py-2 whitespace-nowrap ${
                        isHomePage && !isScrolled ? "text-white" : "text-luxury-charcoal"
                      }`}
                      href={link.href}
                      data-testid={link.testId}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.label}
                    </LocalizedClientLink>
                    {hoveredLink === link.href && (
                      <motion.div 
                        className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-luxury-gold"
                        layoutId="navIndicator"
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="hidden small:flex items-center">
                <CurrencySwitcher />
              </div>
              
              {/* Mobile Search Icon */}
              <div className="small:hidden flex items-center">
                <button
                  onClick={() => setMobileSearchOpen(true)}
                  className="p-2 text-inherit hover:text-luxury-gold transition-colors"
                  aria-label="Search"
                >
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-6 h-6 ${isHomePage && !isScrolled ? 'text-white' : 'text-luxury-charcoal'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                  </svg>

                </button>
              </div>

              {/* Cart */}
              <div className="flex items-center">
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[55] bg-white p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-lg">Search</h2>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-luxury-charcoal hover:text-luxury-gold"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <SearchBar autoSearch={true} autoFocus={true} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay - Set max width to viewport width */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-luxury-charcoal/50 backdrop-blur-sm z-[50] w-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-luxury-ivory z-[60] shadow-xl overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className="flex flex-col h-full w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-lightgold/20 w-full">
                  <h2 className="font-serif text-xl text-luxury-charcoal">Menu</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-luxury-charcoal hover:text-luxury-gold transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-6 w-full">
                  <nav className="flex flex-col gap-y-6 w-full">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        custom={i}
                        initial="closed"
                        animate="open"
                        variants={menuVariants}
                        className="w-full"
                      >
                        <LocalizedClientLink
                          href={link.href}
                          className="text-lg font-medium text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300"
                          onClick={closeMobileMenu}
                        >
                          {link.label}
                        </LocalizedClientLink>
                      </motion.div>
                    ))}
                    <div className="h-px w-full bg-luxury-lightgold/20 my-2" />
                    {rightLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        custom={i + navLinks.length}
                        initial="closed"
                        animate="open"
                        variants={menuVariants}
                        className="w-full"
                      >
                        <LocalizedClientLink
                          href={link.href}
                          className="text-lg font-medium text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300"
                          onClick={closeMobileMenu}
                        >
                          {link.label}
                        </LocalizedClientLink>
                      </motion.div>
                    ))}
                  </nav>
                  <div className="h-px w-full bg-luxury-lightgold/20 my-6" />
                  <div className="flex flex-col gap-y-6 w-full">
                    {/* Add Search to mobile menu */}
                    <motion.div
                      custom={navLinks.length + rightLinks.length}
                      initial="closed"
                      animate="open"
                      variants={menuVariants}
                      className="w-full"
                    >
                      <SearchBar autoSearch={true} />
                    </motion.div>
                    
                    <motion.div
                      custom={navLinks.length + rightLinks.length + 1}
                      initial="closed"
                      animate="open"
                      variants={menuVariants}
                      className="w-full"
                    >
                      <div className="flex items-center gap-x-2 text-luxury-charcoal">
                        <span className="text-sm font-medium">Currency:</span>
                        <CurrencySwitcher />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AnimatedHeader 