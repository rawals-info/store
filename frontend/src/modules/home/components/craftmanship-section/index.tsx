"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@medusajs/ui"

export default function CraftmanshipSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add animation class when section is in view
          entry.target.classList.add('animate-fade-in')
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-24 relative overflow-hidden opacity-0"
    >
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Image columns */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-4 transform translate-y-8">
              <div className="h-64 bg-luxury-cream/50 overflow-hidden luxury-image-hover">
                <div className="w-full h-full bg-[url('/craftsman-1.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
              </div>
              <div className="h-48 bg-luxury-cream/50 overflow-hidden luxury-image-hover">
                <div className="w-full h-full bg-[url('/craftsman-2.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-luxury-cream/50 overflow-hidden luxury-image-hover">
                <div className="w-full h-full bg-[url('/craftsman-3.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
              </div>
              <div className="h-64 bg-luxury-cream/50 overflow-hidden luxury-image-hover">
                <div className="w-full h-full bg-[url('/craftsman-4.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 gold-gradient opacity-30 rounded-full blur-md"></div>
            <div className="absolute -top-6 -right-6 w-24 h-24 gold-gradient opacity-30 rounded-full blur-md"></div>
          </div>
          
          {/* Right side - Content */}
          <div className="pl-0 md:pl-12">
            <span className="font-serif text-sm uppercase tracking-[0.3em] text-luxury-gold">Our Heritage</span>
            <div className="h-px w-16 bg-luxury-gold my-6"></div>
            <h2 className="font-display text-3xl mb-6">The Art of Marble Craftsmanship</h2>
            
            <div className="space-y-6 text-luxury-charcoal/80">
              <p className="text-serif-regular leading-relaxed">
                Each piece in our collection represents generations of artisanal tradition, combining time-honored techniques with contemporary precision.
              </p>
              
              <p className="text-serif-regular leading-relaxed">
                Our master craftsmen meticulously hand-carve every detail, spending hundreds of hours to transform raw marble into masterpieces of extraordinary beauty and elegance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">100% Authentic</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                  </div>
                  <span className="font-medium">Premium Materials</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-luxury-cream flex items-center justify-center">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                  </div>
                  <span className="font-medium">Expert Finishing</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link href="/about" passHref>
                <Button
                  className="luxury-btn-outline border-2 px-8 py-4"
                  variant="secondary"
                >
                  Discover Our Process
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 