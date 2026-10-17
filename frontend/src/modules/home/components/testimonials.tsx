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
              "Gifting ke liye bhi perfect hai. Presentation outstanding and sweets arrived completely fresh in Delhi. Everyone at home loved the authentic taste."
            </Text>
            <Text className="font-medium">— Sushma Sharma, Verified Buyer</Text>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} className="p-8 border border-gray-200 rounded-lg">
            <Text className="italic mb-4">
              "Kesar Angoori Petha is top tier standard. Authentic saffron aroma, melts in mouth like original Agra quality."
            </Text>
            <Text className="font-medium">— Manish Singh, Verified Buyer</Text>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
} 