"use client"

import { motion } from "framer-motion"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import { Heading, Text } from "@medusajs/ui"

export default function Features() {
  return (
    <section className="py-16 bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Heading level="h2" className="text-3xl md:text-4xl mb-3 font-serif">
              Our Commitment
            </Heading>
            <div className="h-px w-24 bg-luxury-gold mx-auto mb-4"></div>
            <Text className="text-luxury-charcoal/80 max-w-2xl mx-auto">
              We believe in creating pieces that are not only beautiful, but ethically crafted and delivered with care.
            </Text>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path>
                </svg>
              </div>
              <Heading level="h3" className="text-xl mb-3 font-serif text-luxury-charcoal">
                Master-Level Hand Carving
              </Heading>
              <Text className="text-luxury-charcoal/80">
                Award-winning artisans craft every intricate detail
              </Text>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <Heading level="h3" className="text-xl mb-3 font-serif text-luxury-charcoal">
                Ethically Mined Marble
              </Heading>
              <Text className="text-luxury-charcoal/80">
                Responsibly sourced premium-grade stone
              </Text>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </div>
              <Heading level="h3" className="text-xl mb-3 font-serif text-luxury-charcoal">
                White-Glove Worldwide Delivery
              </Heading>
              <Text className="text-luxury-charcoal/80">
                Museum-quality packing for a flawless arrival
              </Text>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
} 