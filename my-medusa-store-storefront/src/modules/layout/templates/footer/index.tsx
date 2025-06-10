"use client"

import { useEffect, useState } from "react"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"
import Image from "next/image"
import RegionSelector from "@modules/layout/components/region-selector"
import { listRegions } from "@lib/data/regions"
import CurrencySwitcher from "@modules/layout/components/currency-switcher"

export default function Footer() {
  const [collections, setCollections] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [regions, setRegions] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const collectionsData = await listCollections({
        fields: "*products",
      })
      setCollections(collectionsData.collections || [])
      
      const categoriesData = await listCategories()
      setCategories(categoriesData || [])
      
      const regionsData = await listRegions()
      setRegions(regionsData || [])
    }
    
    fetchData()
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setEmail("")
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1000)
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <footer className="border-t border-luxury-lightgold w-full bg-luxury-ivory">
      {/* Decorative gold pattern */}
      <div className="w-full h-px gold-gradient"></div>
      
      {/* Craftsmanship banner */}
      <div className="py-12 bg-luxury-cream/30">
        <div className="content-container">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg mb-2 text-luxury-charcoal">Master Craftsmanship</h3>
              <p className="text-luxury-charcoal/70 text-sm">Each piece is meticulously handcrafted by our skilled artisans with decades of experience.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg mb-2 text-luxury-charcoal">Premium Materials</h3>
              <p className="text-luxury-charcoal/70 text-sm">We source only the finest marble from renowned quarries, selected for unique veining and character.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg mb-2 text-luxury-charcoal">Lifetime Guarantee</h3>
              <p className="text-luxury-charcoal/70 text-sm">Every purchase is protected by our craftsmanship guarantee, ensuring heirloom quality pieces.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 xsmall:flex-row items-start justify-between py-16">
          <div className="flex flex-col items-start">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl text-luxury-gold mb-4 relative group"
            >
              <span>MARBLE LUXE</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-500 ease-in-out"></span>
            </LocalizedClientLink>
            
            <p className="text-serif-regular text-luxury-charcoal/80 max-w-xs mb-6">
              Exquisite handcrafted marble artifacts that embody timeless elegance and unparalleled artistry.
            </p>
            
            <div className="flex space-x-4 mb-8">
              {["Instagram", "Facebook", "Pinterest"].map((platform) => (
                <a 
                  key={platform}
                  href="#" 
                  className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300 relative group"
                  aria-label={platform}
                >
                  <span className="sr-only">{platform}</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {platform === "Instagram" && (
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    )}
                    {platform === "Facebook" && (
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    )}
                    {platform === "Pinterest" && (
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                    )}
                  </svg>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </a>
              ))}
            </div>
            
            {/* Quality badge */}
            <div className="flex items-center bg-luxury-cream p-4 border border-luxury-gold/20 text-luxury-charcoal/90 rounded-sm hover:border-luxury-gold/40 transition-colors duration-300">
              <svg className="w-10 h-10 text-luxury-gold mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <div>
                <p className="font-display text-sm text-luxury-charcoal">Artisan Craftsmanship Guarantee</p>
                <p className="text-xs text-luxury-charcoal/70 mt-1">Every piece is individually handcrafted and comes with a certificate of authenticity</p>
              </div>
            </div>
          </div>
          
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-1 sm:grid-cols-3">
            {categories && categories?.length > 0 && (
              <div className="flex flex-col gap-y-3">
                <span className="font-display text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                  Collections
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {categories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return null
                    }

                    const children =
                      c.category_children?.map((child: any) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-luxury-charcoal/80 text-serif-regular"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-luxury-gold transition-colors duration-300 relative group",
                            children && "font-medium"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          <span>{c.name}</span>
                          <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child: { id: string; name: string; handle: string }) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-luxury-gold transition-colors duration-300 relative group"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    <span>{child.name}</span>
                                    <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col gap-y-3">
              <span className="font-display text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                Information
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-luxury-charcoal/80 text-serif-regular">
                {[
                  { href: "/about", label: "Our Story" },
                  { href: "/craftmanship", label: "Craftsmanship" },
                  { href: "/sustainability", label: "Sustainability" },
                  { href: "/care", label: "Product Care" },
                  { href: "/faq", label: "FAQ" }
                ].map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink 
                      href={link.href} 
                      className="hover:text-luxury-gold transition-colors duration-300 relative group"
                    >
                      <span>{link.label}</span>
                      <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-y-3">
              <span className="font-display text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                Customer Service
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-luxury-charcoal/80 text-serif-regular">
                {[
                  { href: "/contact", label: "Contact Us" },
                  { href: "/shipping", label: "Shipping & Delivery" },
                  { href: "/returns", label: "Returns & Exchanges" },
                  { href: "/terms", label: "Terms & Conditions" },
                  { href: "/privacy", label: "Privacy Policy" }
                ].map((link) => (
                  <li key={link.href}>
                    <LocalizedClientLink 
                      href={link.href} 
                      className="hover:text-luxury-gold transition-colors duration-300 relative group"
                    >
                      <span>{link.label}</span>
                      <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Currency Switcher */}
            <div className="flex flex-col gap-y-3">
              <span className="font-display text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                Currency
              </span>
              <div className="text-luxury-charcoal/80 text-serif-regular">
                <CurrencySwitcher variant="footer" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-luxury-lightgold py-12 mb-8">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl mb-3 text-luxury-gold">Join Our Exclusive List</h3>
              <p className="text-serif-regular text-luxury-charcoal/80 mb-4">
                Subscribe to receive updates on new collections, special offers, and styling inspiration.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
              <div className="flex-grow relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className="w-full bg-luxury-ivory border border-luxury-lightgold px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors duration-300"
                  required
                />
                {isSubmitted && (
                  <motion.div 
                    className="absolute -top-8 left-0 right-0 bg-green-100 text-green-800 text-xs py-1 px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Thank you for subscribing!
                  </motion.div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || !email}
                className={`mt-2 sm:mt-0 bg-luxury-gold text-luxury-ivory px-6 py-3 font-medium uppercase tracking-wider text-sm transition-all duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-luxury-gold/90'
                }`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col small:flex-row w-full py-6 justify-between text-luxury-charcoal/60 border-t border-luxury-lightgold">
          <Text className="text-small-regular">
            © {new Date().getFullYear()} Marble Luxe. All rights reserved.
          </Text>
          <div className="flex gap-x-6 text-small-regular">
            {["Terms", "Privacy", "Cookies"].map((label) => (
              <a 
                key={label}
                href="#" 
                className="hover:text-luxury-gold transition-colors duration-300 relative group"
              >
                <span>{label}</span>
                <span className="absolute -bottom-px left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
