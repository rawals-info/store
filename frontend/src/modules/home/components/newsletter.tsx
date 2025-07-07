"use client"

import { Heading, Text } from "@medusajs/ui"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"

export default function Newsletter() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ScrollReveal>
          <Heading level="h2" className="text-3xl md:text-4xl mb-6">
            Join Our Exclusive List
          </Heading>
        </ScrollReveal>
        
        <ScrollReveal delay={0.1}>
          <Text className="mb-8 text-gray-300">
            Subscribe to receive updates on new collections, limited editions, and exclusive events.
          </Text>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white w-full sm:w-auto sm:flex-1 max-w-md"
              aria-label="Email address"
            />
            <AnimatedButton variant="gold">Subscribe</AnimatedButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
} 