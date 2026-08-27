"use client"

import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { clx } from "@medusajs/ui"
import CartButton from "@modules/layout/components/cart-button"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RegionSelector from "@modules/layout/components/region-selector"
import { listRegions } from "@lib/data/regions"
import { listIndiaRegions } from "@lib/constants/india-region"
import { StoreRegion } from "@medusajs/types"
// Currency switcher removed
import { usePathname } from "next/navigation"
import SearchBar from "@modules/search/components/search-bar"
import CategoryDropdown from "@modules/layout/components/category-dropdown/index"
import { X } from "@medusajs/icons"
import { Sparkles } from "lucide-react"
import CountdownTimer from "@components/CountdownTimer"
import { STORE_PROMOTION } from "@lib/config/promotions"

const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const { scrollY } = useScroll()
  const pathname = usePathname()

  // Check localStorage for banner dismissal state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return // ✅ SSR safety
    const dismissed = localStorage.getItem('promotional-banner-dismissed') === 'true'
    setBannerDismissed(dismissed)
  }, [])

  const [activePromo, setActivePromo] = useState<{ code: string; discountPercent: number } | null>(null)

  // Fetch live active promotion from Medusa backend dynamically
  useEffect(() => {
    fetch("/api/promotions/active")
      .then((res) => res.json())
      .then((data) => {
        if (data?.promotion && data.promotion.code && data.promotion.discountPercent > 0) {
          setActivePromo({
            code: data.promotion.code,
            discountPercent: data.promotion.discountPercent,
          })
        }
      })
      .catch((err) => console.error("Error loading active promotion:", err))
  }, [])

  // Premium promotional messages - dynamic & elegant from live database
  const promoMessages = [
    "Free Shipping on Orders Above ₹500",
    activePromo
      ? `Use code ${activePromo.code} for ${activePromo.discountPercent}% off your order`
      : "100% Authentic Agra Petha & Gourmet Dalmoth",
    "Handcrafted Fresh Daily in Agra — Delivered Nationwide"
  ]

  // Function to handle banner dismissal
  const handleBannerDismiss = () => {
    setBannerDismissed(true)
    if (typeof window !== 'undefined') { // ✅ SSR safety
      localStorage.setItem('promotional-banner-dismissed', 'true')
      // Dispatch custom event to notify layout immediately
      window.dispatchEvent(new CustomEvent('bannerDismissed'))
    }
  }

  // Function to show banner again
  const handleShowBanner = () => {
    setBannerDismissed(false)
    if (typeof window !== 'undefined') { // ✅ SSR safety
      localStorage.removeItem('promotional-banner-dismissed')
      // Dispatch custom event to notify layout immediately
      window.dispatchEvent(new CustomEvent('bannerShown'))
    }
  }

  // Extract country code from pathname
  const countryCode = pathname?.split('/')[1] || 'us'
  const isCheckout = pathname?.includes('/checkout')


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

  // Header background: clean light ivory/white across all pages
  const headerBg = useTransform(
    scrollY,
    [0, 60],
    isHomePage
      ? ["rgba(255,253,249,0.9)", "rgba(255,253,249,0.98)"]
      : ["rgba(255,253,249,0.98)", "rgba(255,253,249,0.98)"]
  )

  // Nav link colors: slate-700 hover petha-amber everywhere
  const navTextClass = "text-slate-700 hover:text-petha-amber font-jakarta font-semibold"

  // Default links so the header still renders without Tina
  const defaultNavLinks = [
    { href: "/products", label: "All Sweets", testId: "nav-shop-link" },
    { href: "/products?category=petha", label: "Petha", testId: "nav-petha-link" },
    { href: "/products?category=dalmoth", label: "Dalmoth", testId: "nav-dalmoth-link" },
    { href: "/products?category=namkeen", label: "Namkeen", testId: "nav-namkeen-link" },
    { href: "/about", label: "Our Story", testId: "nav-about-link" },
    { href: "/blog", label: "Blog", testId: "nav-blog-link" },
  ]

  const defaultRightLinks = [
    { href: "/account", label: "Account", testId: "nav-account-link" },
    { href: "/contact", label: "Help", testId: "nav-contact-link" },
  ]

  const [navLinks] = useState(() => defaultNavLinks)
  const [rightLinks] = useState(() => defaultRightLinks)

  // Animation variants for links with refined motion
  const linkVariants: any = {
    hover: {
      y: -1,
      transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] }
    }
  }

  // Animation variants for mobile menu items
  const menuVariants: any = {
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
      const regionsData = listIndiaRegions()
      setRegions(regionsData)
    }
    fetchRegions()
  }, [])

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Text color for the header container — consistent slate-800 across all pages
  const getTextColor = () => "text-slate-800"

  // Hide store header & promotional marquee completely on checkout pages
  if (isCheckout) {
    return null
  }

  return (
    <>
      {/* Promotional Banner */}
      <AnimatePresence>
        {!bannerDismissed && (
          <motion.div
            className="fixed top-0 inset-x-0 z-[50] bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white h-12 flex items-center overflow-hidden border-b border-amber-800/40 shadow-sm"
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Mobile optimized content */}
            <div className="relative w-full px-3 sm:px-6 pr-9 sm:pr-6">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Left: Countdown Timer (Desktop) */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">Next batch ships:</span>
                  <CountdownTimer />
                </div>

                {/* Center: Scrolling Messages */}
                <div className="flex-1 overflow-hidden mx-1 md:mx-6">
                  <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: [0, -1500] }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 35,
                        ease: "linear",
                      },
                    }}
                  >
                    {[...Array(3)].map((_, repeatIndex) => (
                      <div key={repeatIndex} className="flex items-center">
                        {promoMessages.map((message, index) => (
                          <span
                            key={`${repeatIndex}-${index}`}
                            className="font-jakarta font-bold text-xs sm:text-sm text-white px-4 sm:px-6 flex items-center gap-2"
                          >
                            <span>{message}</span>
                            <span className="text-amber-300/60 mx-3">•</span>
                          </span>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Sleek Modern Dismiss Button */}
            <button
              onClick={handleBannerDismiss}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 text-white/90 hover:text-white flex items-center justify-center transition-all duration-200 z-10 cursor-pointer border border-white/10"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Floating Offer Pill (Centered when banner is dismissed) */}
      <AnimatePresence>
        {bannerDismissed && (
          <motion.button
            onClick={handleShowBanner}
            className="fixed top-2 sm:top-2.5 left-1/2 -translate-x-1/2 z-[45] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-[11px] font-jakarta font-bold px-3.5 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-1.5 border border-amber-300/40 cursor-pointer whitespace-nowrap"
            initial={{ y: -20, x: "-50%", opacity: 0, scale: 0.8 }}
            animate={{ y: 0, x: "-50%", opacity: 1, scale: 1 }}
            exit={{ y: -20, x: "-50%", opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05, x: "-50%" }}
            whileTap={{ scale: 0.95, x: "-50%" }}
            aria-label="Show royal sweet offers"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>
              {STORE_PROMOTION.enabled && STORE_PROMOTION.discountPercent > 0 && STORE_PROMOTION.code
                ? `Offers • Code: ${STORE_PROMOTION.code}`
                : "Royal Sweet Offers"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.header
        className={clx(
          "fixed inset-x-0 z-[40] group transition-colors duration-500 w-full overflow-visible",
          {
            "border-b": isScrolled,
            "border-petha-border": isScrolled && isHomePage,
            "border-luxury-gold/10": isScrolled && !isHomePage,
            "backdrop-blur-sm": isScrolled,
          }
        )}
        style={{
          top: bannerDismissed ? 0 : 48,
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
        {/* Decorative accent line */}
        <motion.div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isHomePage ? "bg-petha-amber/30" : "gold-gradient opacity-30"
          }`}
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

        <div className={`w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 ${getTextColor()} h-full transition-all duration-300 box-border ${isScrolled ? "py-1 h-20" : "py-2 h-24"
          }`}>
          <div className="w-full flex items-center justify-between h-full relative gap-4">
            
            {/* Left: Logo */}
            <div className="flex items-center flex-shrink-0">
              {/* Mobile menu button */}
              <div className="small:hidden mr-2">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1.5 rounded-lg transition-colors text-slate-800 hover:text-petha-amber"
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
              </div>

              {/* Brand / Logo */}
              <LocalizedClientLink href="/" className="flex items-center gap-2.5 group mr-4 lg:mr-8">
                <Image
                  src="/logo.webp"
                  alt="Taj Petha Logo"
                  width={36}
                  height={36}
                  className="w-8 h-8 small:w-9 small:h-9 object-contain group-hover:scale-105 transition-transform"
                />
                <span className="font-cormorant text-xl small:text-2xl tracking-wide uppercase font-bold text-slate-900 group-hover:text-petha-amber transition-colors whitespace-nowrap">
                  TAJ PETHA
                </span>
              </LocalizedClientLink>
            </div>

            {/* Center: Navigation links - desktop */}
            <div className="hidden small:flex items-center gap-x-5 lg:gap-x-7 h-full flex-shrink-0">
              {(navLinks || []).filter(l => l.href !== "/categories" && l.label?.toLowerCase() !== "categories").map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href))

                return (
                  <motion.div
                    key={link.href}
                    className="relative"
                    whileHover="hover"
                    variants={linkVariants}
                  >
                    <LocalizedClientLink
                      className={`text-xs lg:text-sm font-semibold font-jakarta transition-colors duration-200 tracking-wide py-2 whitespace-nowrap text-slate-800 hover:text-petha-amber ${isActive ? 'text-petha-amber font-bold' : ''}`}
                      href={link.href}
                      data-testid={link.testId}
                      onMouseEnter={() => setHoveredLink(link.href)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {link.label}
                    </LocalizedClientLink>
                    {(hoveredLink === link.href || isActive) && (
                      <motion.div
                        className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full bg-petha-amber"
                        layoutId="underline"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "100%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Right: Search Bar + Account + Cart */}
            <div className="flex items-center justify-end gap-x-3 sm:gap-x-5 flex-1 max-w-xl">
              {/* Search Bar */}
              <div className="hidden small:block w-full max-w-[280px] lg:max-w-[340px]">
                <Suspense fallback={<div className="h-9 w-full bg-slate-100 rounded-full" />}>
                  <SearchBar
                    isHomePage={isHomePage}
                    isScrolled={isScrolled}
                    autoSearch={true}
                  />
                </Suspense>
              </div>

              {/* Account & Help links */}
              <div className="hidden lg:flex items-center gap-x-4 flex-shrink-0">
                {rightLinks.map((link) => (
                  <LocalizedClientLink
                    key={link.href}
                    className="text-xs font-semibold font-jakarta transition-colors duration-200 tracking-wide whitespace-nowrap text-slate-700 hover:text-petha-amber"
                    href={link.href}
                    data-testid={link.testId}
                  >
                    {link.label}
                  </LocalizedClientLink>
                ))}
              </div>

              {/* Mobile Search Icon */}
              <div className="small:hidden flex items-center">
                <button
                  onClick={() => setMobileSearchOpen(true)}
                  className="p-1.5 transition-colors text-slate-800 hover:text-petha-amber"
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
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
              <div className="flex items-center flex-shrink-0">
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
            <Suspense fallback={<div className="h-9 w-full bg-luxury-cream/40 rounded" />}>
              <SearchBar autoSearch={true} autoFocus={true} useCharcoal={true} />
            </Suspense>
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
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-petha-cream z-[60] shadow-xl overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
              <div className="flex flex-col h-full w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-luxury-lightgold/20 w-full">
                  <h2 className="font-cormorant text-xl font-semibold text-petha-text">Menu</h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-petha-slate hover:text-petha-amber transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-6 w-full">
                  <nav className="flex flex-col gap-y-6 w-full">
                    {(navLinks || []).filter(l => l.href !== "/categories" && l.label?.toLowerCase() !== "categories").map((link, i) => (
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
                          className="text-lg font-jakarta font-medium text-petha-slate hover:text-petha-amber transition-colors duration-300"
                          onClick={closeMobileMenu}
                        >
                          {link.label}
                        </LocalizedClientLink>
                      </motion.div>
                    ))}
                    <div className="h-px w-full bg-luxury-lightgold/20 my-2" />
                    {(rightLinks || []).map((link, i) => (
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
                          className="text-lg font-jakarta font-medium text-petha-slate hover:text-petha-amber transition-colors duration-300"
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
                      <SearchBar autoSearch={true} useCharcoal={true} />
                    </motion.div>

                    {/* Currency switcher removed */}
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