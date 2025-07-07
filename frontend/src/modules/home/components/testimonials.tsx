"use client"

import { Heading, Text } from "@medusajs/ui"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <ScrollReveal>
          <Heading level="h2" className="text-3xl md:text-4xl mb-12 text-center">
            Client Testimonials
          </Heading>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal className="p-8 border border-gray-200 rounded-lg">
            <Text className="italic mb-4">
              "The marble centerpiece I purchased is absolutely stunning. The craftsmanship is impeccable and it has become the focal point of my dining room."
            </Text>
            <Text className="font-medium">— Sarah J., Interior Designer</Text>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="p-8 border border-gray-200 rounded-lg">
            <Text className="italic mb-4">
              "I've been collecting marble pieces for years, and the quality of these handicrafts is truly exceptional. Each piece tells a story of artistry and tradition."
            </Text>
            <Text className="font-medium">— Michael T., Art Collector</Text>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
} 