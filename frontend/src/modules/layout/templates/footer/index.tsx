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
// Currency switcher removed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faPaypal,
} from "@fortawesome/free-brands-svg-icons"

let tinaClientPromise: Promise<any> | null = null
const getTinaClient = async () => {
  if (!tinaClientPromise) {
    tinaClientPromise = import("../../../../../tina/__generated__/client").then(m => m.default || m)
  }
  return tinaClientPromise
}

export default function Footer() {
  const [collections, setCollections] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [regions, setRegions] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [companyName, setCompanyName] = useState("TAJ PETHA")
  const [companyDescription, setCompanyDescription] = useState("Authentic Agra Petha crafted in small batches since 1870. Fragrant, melt-in-the-mouth bites steeped in heritage.")
  const defaultSocial: { platform: string; href: string }[] = [
    { platform: "Instagram", href: "https://instagram.com" },
    { platform: "Facebook", href: "https://facebook.com" },
  ]
  const [socialLinks, setSocialLinks] = useState<{ platform: string; href: string }[]>(defaultSocial)

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
  
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const client = await getTinaClient()
        const res = await client.queries.site({ relativePath: "footer.json" })
        const footer = res?.data?.site?.footer
        if (footer) {
          if (footer.company) setCompanyName(footer.company)
          if (footer.description) setCompanyDescription(footer.description)
          if (footer.social?.length) setSocialLinks(footer.social as any)
        }
      } catch (e) {
        // keep defaults
      }
    }
    if (typeof window !== "undefined") fetchFooter()
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
    <footer className="border-t border-luxury-gold/20 w-full bg-black text-white">
      {/* Decorative gold pattern */}
      <div className="w-full h-px gold-gradient"></div>
      
      {/* Features section */}
      <div className="py-12 bg-black/80">
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
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4 text-2xl">🥄</div>
              <h3 className="font-serif text-lg mb-2 text-white">Artisanal Small Batches</h3>
              <p className="text-white/70 text-sm">We cook each batch slowly for melt-in-the-mouth texture.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4 text-2xl">🌱</div>
              <h3 className="font-serif text-lg mb-2 text-white">Pure Ingredients</h3>
              <p className="text-white/70 text-sm">Only farm-fresh ash gourd, cane sugar & rose water.</p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <div className="w-16 h-16 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4 text-2xl">📦</div>
              <h3 className="font-serif text-lg mb-2 text-white">Nationwide Fresh Shipping</h3>
              <p className="text-white/70 text-sm">Vacuum-sealed & white-glove packaging for perfect delivery.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-12 xsmall:flex-row items-start justify-between py-16">
          <div className="flex flex-col items-start">
            <LocalizedClientLink
              href="/"
              className="font-serif text-2xl text-luxury-gold mb-4 relative group"
            >
              <span>{companyName}</span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-500 ease-in-out"></span>
            </LocalizedClientLink>
            
            <p className="text-white/80 max-w-xs mb-6">
              {companyDescription}
            </p>
            
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social: { platform: string; href: string }) => {
                const platform = social.platform || "Social"
                return (
                  <a 
                    key={platform}
                    href={social.href || "#"} 
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
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  </a>
                )
              })}
            </div>
          </div>
          
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-1 sm:grid-cols-3">
            <div className="flex flex-col gap-y-3">
              <span className="font-serif text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                Shop
              </span>
              <ul className="grid grid-cols-1 gap-2 text-white">
                <li>
                  <LocalizedClientLink href="/categories/table-top" className="text-white hover:text-luxury-gold transition-colors duration-300">
                    Table Top
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/categories/jewelry" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Jewelry
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/categories/home-decor" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Home Decor
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/categories/sculpture" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Sculpture
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-y-3">
              <span className="font-serif text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                Company
              </span>
              <ul className="grid grid-cols-1 gap-2">
                <li>
                  <LocalizedClientLink href="/about" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    About
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/contact" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Contact
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/csr-policy" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    CSR Policy
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-y-3">
              <span className="font-serif text-base text-luxury-gold border-b border-luxury-gold/20 pb-1 mb-2">
                Support
              </span>
              <ul className="grid grid-cols-1 gap-2">
                <li>
                  <LocalizedClientLink href="/shipping" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Shipping
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/returns" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Returns
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/faqs" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    FAQs
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/terms" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Terms & Conditions
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink href="/privacy" className="text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300">
                    Privacy Policy
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-luxury-lightgold/20 py-6 px-4 sm:px-8 overflow-x-auto">
        <div className="content-container flex flex-col-reverse gap-y-4 xsmall:flex-row items-center justify-between min-w-max">
          <div className="text-small-regular text-luxury-charcoal/60">
            © 2025 Imperial Craft Of India. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Currency switcher removed */}
            <div className="hidden xsmall:block h-6 w-px bg-luxury-lightgold/20"></div>
            <div className="flex items-center gap-x-4 text-2xl text-luxury-charcoal opacity-80">
              <FontAwesomeIcon icon={faCcVisa} />
              <FontAwesomeIcon icon={faCcMastercard} />
              <FontAwesomeIcon icon={faCcAmex} />
              <FontAwesomeIcon icon={faPaypal} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
