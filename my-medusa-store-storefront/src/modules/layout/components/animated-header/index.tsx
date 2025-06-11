"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { clx } from "@medusajs/ui"
import CartButton from "@modules/layout/components/cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RegionSelector from "@modules/layout/components/region-selector"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CountrySwitcher from "@modules/layout/components/country-switcher"
import CurrencySwitcher from "@modules/layout/components/currency-switcher"

const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  
  // Transform values based on scroll position with more subtle luxury animations
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.98])
  const headerScale = useTransform(scrollY, [0, 50], [1, 0.99])
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 6px 24px rgba(0,0,0,0.03), 0px 2px 8px rgba(212,175,55,0.1)"]
  )
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255,255,245,0.85)", "rgba(255,255,245,0.97)"]
  )
  
  // Navigation links data with refined labeling
  const navLinks = [
    { href: "/", label: "Home", testId: "nav-home-link" },
    { href: "/categories", label: "Categories", testId: "nav-categories-link" },
    { href: "/products", label: "Products", testId: "nav-products-link" },
    { href: "/about", label: "About Us", testId: "nav-about-link" },
  ]
  
  const rightLinks = [
    { href: "/account", label: "Account", testId: "nav-account-link" },
    { href: "/contact", label: "Contact", testId: "nav-contact-link" },
  ]

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

  return (
    <>
      <motion.header
        className={clx(
          "sticky top-0 inset-x-0 z-[40] group transition-all duration-500 backdrop-blur-sm",
          {
            "border-b border-luxury-gold/10": isScrolled,
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
        
        <div className={`max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 text-luxury-charcoal h-full transition-all duration-300 ${
          isScrolled ? "py-0 h-16" : "py-1 h-20"
        }`}>
          <div className="w-full flex items-center justify-between h-full">
            <div className="flex-1 basis-0 h-full flex items-center">
              {/* Mobile menu button */}
              <div className="small:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center text-sm font-medium tracking-wide text-luxury-charcoal hover:text-luxury-gold group transition-colors duration-300"
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
                {navLinks.map((link) => (
                  <motion.div 
                    key={link.href} 
                    className="relative"
                    whileHover="hover"
                    variants={linkVariants}
                  >
                    <LocalizedClientLink
                      className="font-medium text-sm hover:text-luxury-gold transition-colors duration-200 tracking-wide py-2"
                      href={link.href}
                      data-testid={link.testId}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.label}
                    </LocalizedClientLink>
                    {hoveredLink === link.href && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold"
                        layoutId="underline"
                        initial={{ width: 0, opacity: 0, left: "25%" }}
                        animate={{ width: "100%", opacity: 1, left: 0 }}
                        exit={{ width: 0, opacity: 0, left: "75%" }}
                        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Logo with refined animations */}
            <motion.div 
              className="flex items-center h-full"
              animate={{ 
                scale: isScrolled ? 0.95 : 1,
                y: isScrolled ? -1 : 0
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <LocalizedClientLink
                href="/"
                className="flex flex-col items-center"
                data-testid="nav-store-link"
              >
                <motion.span 
                  className="font-display text-2xl text-luxury-gold hover:opacity-90 transition-all duration-200 relative group"
                  whileHover={{ scale: 1.02, letterSpacing: "0.01em" }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  MARBLE LUXE
                  <motion.span 
                    className="absolute -bottom-px left-0 h-0.5 bg-luxury-gold/80"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  />
                </motion.span>
                <motion.span 
                  className={`text-luxury-charcoal/80 text-[10px] uppercase tracking-[0.15em] mt-0.5 transition-all duration-300 ${isScrolled ? 'opacity-0 translate-y-1' : 'opacity-100'}`}
                  animate={{ opacity: isScrolled ? 0 : 1, y: isScrolled ? 5 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  FINE HANDICRAFTS
                </motion.span>
              </LocalizedClientLink>
            </motion.div>

            {/* Right side links with refined hover effects */}
            <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
              <div className="hidden small:flex items-center gap-x-8 h-full">
                {rightLinks.map((link) => (
                  <motion.div 
                    key={link.href} 
                    className="relative"
                    whileHover="hover"
                    variants={linkVariants}
                  >
                    <LocalizedClientLink
                      className="font-medium text-sm hover:text-luxury-gold transition-colors duration-200 tracking-wide py-2"
                      href={link.href}
                      data-testid={link.testId}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.label}
                    </LocalizedClientLink>
                    {hoveredLink === link.href && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold"
                        layoutId="underline-right"
                        initial={{ width: 0, opacity: 0, left: "25%" }}
                        animate={{ width: "100%", opacity: 1, left: 0 }}
                        exit={{ width: 0, opacity: 0, left: "75%" }}
                        transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="hidden small:flex items-center gap-x-4">
                <CurrencySwitcher />
              </div>
              <div className="h-full flex items-center">
                <CartButton />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-luxury-ivory z-50 flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top section with close button */}
            <div className="flex justify-between items-center p-5 border-b border-luxury-gold/10">
              <motion.h3 
                className="font-display text-2xl text-luxury-gold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                MARBLE LUXE
              </motion.h3>
              <button 
                className="p-2 focus:outline-none text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300" 
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Menu items with staggered animation */}
            <div className="flex flex-col items-center justify-center flex-1 gap-6 py-8">
              {[...navLinks, ...rightLinks].map((item, i) => (
                <motion.div
                  key={item.href}
                  custom={i}
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="w-full text-center"
                >
                  <LocalizedClientLink 
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block py-3 text-xl relative overflow-hidden group text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300"
                  >
                    <div className="relative z-10">
                      <span className="font-display tracking-wider">{item.label}</span>
                    </div>
                    {/* Animated underline effect */}
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-luxury-gold"
                      initial={{ width: "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </LocalizedClientLink>
                </motion.div>
              ))}
            </div>

            {/* Region and country selectors in mobile menu */}
            <div className="p-6 border-t border-luxury-gold/10 flex justify-center gap-6">
              <CurrencySwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AnimatedHeader 