"use client"

import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"

export default function Craftsmanship() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <ScrollReveal className="flex-1">
            <div className="aspect-square rounded-lg overflow-hidden relative">
              <Image
                src="/craftsmanship.jpg"
                alt="Marble craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            </div>
          </ScrollReveal>
          
          <div className="flex-1">
            <ScrollReveal>
              <Heading level="h2" className="text-3xl md:text-4xl mb-6">
                About Our Craftsmanship
              </Heading>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <Text className="mb-4">
                Each piece in our collection is handcrafted by master artisans with decades of experience working with the finest marble from around the world.
              </Text>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <Text className="mb-6">
                Our commitment to traditional techniques combined with modern design creates timeless pieces that will be cherished for generations.
              </Text>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <AnimatedButton variant="gold">About Us</AnimatedButton>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
} 