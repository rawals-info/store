"use server"

import { getRegion } from "@lib/data/regions"
import Image from "next/image"
import { notFound } from "next/navigation"

interface AboutPageProps {
  params: {
    countryCode: string
  }
}

export default async function AboutPage(props: AboutPageProps) {
  const params = await props.params
  const countryCode = params.countryCode
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-charcoal mb-4">
          Our Craftsmanship
        </h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto">
          For generations, our master craftsmen have preserved the ancient art of marble sculpting,
          combining time-honored techniques with contemporary precision to create pieces of extraordinary beauty.
        </p>
      </div>

      {/* Our Story section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Heritage</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          <div className="text-serif-regular text-luxury-charcoal/80 space-y-4">
            <p>
              Founded in 1978, Imperial Craft Of India began as a small family workshop dedicated to preserving the ancient traditions of marble craftsmanship. Our founder, Master Craftsman Raj Sharma, learned the art from his father and grandfather, carrying forward techniques that have been passed down through generations.
            </p>
            <p>
              What started as a modest operation has grown into an internationally recognized atelier, renowned for creating some of the world's most exquisite marble artworks while maintaining the same dedication to craftsmanship that defined our beginnings.
            </p>
            <p>
              Today, we continue to honor this legacy by combining age-old techniques with contemporary design sensibilities, creating timeless pieces that bridge the past and present.
            </p>
          </div>
        </div>
        <div className="relative h-96 luxury-image-hover overflow-hidden">
          <div className="absolute inset-0 bg-[url('/craftsman-1.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
        </div>
      </div>

      {/* Process section */}
      <div className="mb-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Process</h2>
          <div className="h-px w-16 bg-luxury-gold mx-auto mb-8"></div>
          <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto">
            Every Imperial Craft Of India creation undergoes a meticulous process that honors traditional craftsmanship while embracing modern techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">1</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Selection</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              We hand-select the finest marble from ethical quarries, choosing blocks with optimal veining, color, and structural integrity for each piece we create.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">2</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Sculpting</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Our master artisans use traditional tools and techniques to shape the marble, meticulously carving each detail by hand to ensure precision and artistry.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">3</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Finishing</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Each piece undergoes extensive polishing and finishing, using progressively finer abrasives to achieve a luminous surface that highlights the natural beauty of the stone.
            </p>
          </div>
        </div>
      </div>

      {/* Our Artisans section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="order-2 lg:order-1 relative h-96 luxury-image-hover overflow-hidden">
          <div className="absolute inset-0 bg-[url('/craftsman-2.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Artisans</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          <div className="text-serif-regular text-luxury-charcoal/80 space-y-4">
            <p>
              Behind every Imperial Craft Of India creation is a team of dedicated artisans who have devoted their lives to mastering the art of marble craftsmanship. Many have trained with us for decades, developing an intuitive understanding of the stone and its possibilities.
            </p>
            <p>
              Our workshop functions as both a production studio and a training ground, where senior master craftsmen pass their knowledge to the next generation through rigorous apprenticeships lasting 5-7 years.
            </p>
            <p>
              This commitment to preserving and evolving our craft ensures that the ancient art of marble sculpting continues to thrive in the modern world, producing works that honor tradition while embracing innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Quality Promise */}
      <div className="bg-luxury-cream/30 p-12 mb-12">
        <div className="text-center">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Quality Promise</h2>
          <div className="h-px w-16 bg-luxury-gold mx-auto mb-8"></div>
          <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto mb-8">
            Every piece that leaves our workshop meets our exacting standards of quality and craftsmanship.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-2">Authenticity</h3>
              <p className="text-serif-regular text-luxury-charcoal/80 text-center">
                100% genuine materials with certification of origin and authenticity.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-2">Craftsmanship</h3>
              <p className="text-serif-regular text-luxury-charcoal/80 text-center">
                Meticulously handcrafted by expert artisans with decades of experience.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-2">Longevity</h3>
              <p className="text-serif-regular text-luxury-charcoal/80 text-center">
                Built to last generations with proper care and maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 