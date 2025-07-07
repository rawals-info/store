"use client"

import { Button } from "@medusajs/ui"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const Hero = () => {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY
        setScrollY(scrollPosition * 0.3) // Adjust parallax speed
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div ref={heroRef} className="relative min-h-[100vh] w-full overflow-hidden">
      {/* Luxury background with parallax effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="relative w-full h-full"
          style={{
            transform: `translateY(${scrollY}px)`,
          }}
        >
          <Image 
            src="/marble-bg.jpg"
            alt="Luxury marble background"
            fill
            priority={true}
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
            style={{ filter: "brightness(0.9)" }}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
          />
        </div>
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-luxury-charcoal/90 via-luxury-charcoal/60 to-transparent"></div>
      
      {/* Gold decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 gold-gradient opacity-10 rounded-full blur-xl animate-gentle-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gold-gradient opacity-10 rounded-full blur-xl animate-gentle-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Overlapping marble texture */}
      <div className="absolute inset-0 z-2 bg-luxury-marble opacity-10 mix-blend-overlay"></div>
      
      {/* Main content container */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 small:p-24 max-w-7xl mx-auto">
        {/* Hero text section */}
        <div className="animate-fade-in mb-12 px-4 small:px-0">
          <div className="mb-6">
            <span className="font-serif text-sm uppercase tracking-[0.3em] text-luxury-gold">Luxury Marble Creations</span>
            <div className="h-px w-24 bg-luxury-gold mx-auto my-6"></div>
          </div>
          
          <h1 className="text-display-large mb-4 text-luxury-ivory font-medium leading-tight">
            <span className="block">Artistry in</span>
            <span className="gold-text font-display text-[4rem] italic">Marble</span>
          </h1>
          
          <p className="text-serif-regular text-luxury-ivory/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Each piece a masterpiece, handcrafted by artisans with centuries of tradition.
            Our marble collections transform spaces into sanctuaries of elegance and sophistication.
          </p>
          
          <div className="flex flex-col small:flex-row gap-6 justify-center mt-8">
            <Link href="/collections" passHref>
              <Button
                className="luxury-btn px-8 py-4 text-base"
                variant="secondary"
              >
                Explore Collection
              </Button>
            </Link>
            <Link href="/products" passHref>
              <Button
                className="luxury-btn-outline px-8 py-4 text-base hover:bg-transparent hover:text-luxury-gold border-2"
                variant="secondary"
              >
                View Signature Pieces
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-gentle-float">
          <span className="text-luxury-ivory/60 text-xs mb-2 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-luxury-gold to-transparent"></div>
        </div>
      </div>
      
      {/* Featured categories section */}
      <div className="relative z-20 w-full bg-luxury-ivory py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl mb-4">Exquisite Collections</h2>
            <div className="h-px w-24 bg-luxury-gold mx-auto"></div>
            <p className="text-serif-regular text-luxury-charcoal/80 mt-6 max-w-xl mx-auto">
              Discover our handcrafted luxury marble creations, each piece telling a story of craftsmanship and heritage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Category 1 */}
            <div className="luxury-card elegant-hover group">
              <div className="relative h-80 w-full mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-luxury-cream/50 flex items-center justify-center">
                  <div className="text-center z-10 transition-all duration-500 transform group-hover:scale-110">
                    <span className="text-luxury-gold font-display text-2xl">Architectural Marvels</span>
                    <div className="h-px w-12 bg-luxury-gold mx-auto my-4"></div>
                  </div>
                </div>
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/categories/monuments.jpg" 
                    alt="Architectural Marvels" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-40"
                    loading="eager"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl mb-2">Taj Mahal & Monuments</h3>
                <p className="text-serif-italic text-sm text-luxury-charcoal/80 mb-5">Timeless recreations of world heritage</p>
                <Link href="/categories/monuments" className="text-luxury-gold uppercase text-xs tracking-wider font-medium hover:opacity-80 transition-opacity">
                  Explore Collection
                </Link>
              </div>
            </div>
            
            {/* Category 2 */}
            <div className="luxury-card elegant-hover group">
              <div className="relative h-80 w-full mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-luxury-cream/50 flex items-center justify-center">
                  <div className="text-center z-10 transition-all duration-500 transform group-hover:scale-110">
                    <span className="text-luxury-gold font-display text-2xl">Divine Sculptures</span>
                    <div className="h-px w-12 bg-luxury-gold mx-auto my-4"></div>
                  </div>
                </div>
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/categories/sculptures.jpg" 
                    alt="Divine Sculptures" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-40"
                    loading="eager"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl mb-2">Spiritual Artifacts</h3>
                <p className="text-serif-italic text-sm text-luxury-charcoal/80 mb-5">Sacred art with meticulous detail</p>
                <Link href="/categories/sculptures" className="text-luxury-gold uppercase text-xs tracking-wider font-medium hover:opacity-80 transition-opacity">
                  Explore Collection
                </Link>
              </div>
            </div>
            
            {/* Category 3 */}
            <div className="luxury-card elegant-hover group">
              <div className="relative h-80 w-full mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-luxury-cream/50 flex items-center justify-center">
                  <div className="text-center z-10 transition-all duration-500 transform group-hover:scale-110">
                    <span className="text-luxury-gold font-display text-2xl">Epoxy Tables</span>
                    <div className="h-px w-12 bg-luxury-gold mx-auto my-4"></div>
                  </div>
                </div>
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/categories/tables.jpg" 
                    alt="Epoxy Tables" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-40"
                    loading="eager"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl mb-2">Functional Artwork</h3>
                <p className="text-serif-italic text-sm text-luxury-charcoal/80 mb-5">Where art meets everyday luxury</p>
                <Link href="/categories/tables" className="text-luxury-gold uppercase text-xs tracking-wider font-medium hover:opacity-80 transition-opacity">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
