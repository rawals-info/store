"use client"

import { Heading, Text } from "@medusajs/ui"
import { motion } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import AnimatedButton from "@modules/common/components/animated-button"
import { staggerContainer, fadeIn } from "@lib/util/animations"
import Link from "next/link"

export default function Hero() {
  const heroRef = useRef(null)

  return (
    <motion.section
      ref={heroRef}
      className="relative h-[80vh] flex items-center justify-center overflow-hidden"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Background with marble texture and overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/marble-bg-light.jpg"
          alt="Marble background"
          fill
          priority={true}
          sizes="100vw"
          className="object-cover opacity-30"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 to-transparent"></div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-24 left-10 w-32 h-32 rounded-full border border-luxury-gold/20"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 4 }}
      />

      <motion.div
        className="absolute bottom-24 right-10 w-48 h-48 rounded-full border border-luxury-gold/20"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ repeat: Infinity, duration: 6, delay: 1 }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div variants={fadeIn} className="mb-6">
          <Heading level="h1" className="text-4xl md:text-6xl mb-4 font-serif">
            <span className="luxury-gold">Exquisite Marble</span> Handicrafts
          </Heading>
        </motion.div>
        
        <motion.div variants={fadeIn} className="mb-8">
          <Text className="text-lg md:text-xl max-w-2xl mx-auto text-luxury-charcoal/90">
            Discover our collection of handcrafted marble pieces, meticulously created by master artisans for your luxury home.
          </Text>
        </motion.div>
        
        <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4">
          <Link href="/products">
            <AnimatedButton variant="gold" size="large">
              Browse Collection
            </AnimatedButton>
          </Link>
          <Link href="/about">
            <AnimatedButton variant="outline" size="large">
              Our Heritage
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.section>
  )
} 