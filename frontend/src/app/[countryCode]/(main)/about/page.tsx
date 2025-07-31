"use server"

import { getRegion } from "@lib/data/regions"
import { getIndiaRegion } from "@lib/constants/india-region"
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
  const region = getIndiaRegion()

  if (!region) {
    notFound()
  }

  return (
    <div className="content-container py-12">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mb-20">
        <h1 className="font-display text-4xl text-luxury-charcoal mb-4">
          About Taj Petha
        </h1>
        <div className="h-px w-20 bg-luxury-gold mb-8"></div>
        <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto">
          Experience the true taste of Agra—one crystal-clear piece at a time!
        </p>
      </div>

      {/* Our Story section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Story</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          <div className="text-serif-regular text-luxury-charcoal/80 space-y-4">
            <p>
              Founded in 2013 by Siddharth Rawal, Taj Petha was born from a passion for preserving Agra's most beloved sweet: the iconic petha. Nestled in the historic lanes of Agra, we set out with one goal—to craft the finest, most authentic Agra petha while blending time-honored recipes with modern hygiene and packaging standards.
            </p>
            <p>
              Over the past decade, Taj Petha has grown from a single shop into a household name, delighting petha lovers across India and around the world.
            </p>
          </div>
        </div>
        <div className="relative h-96 luxury-image-hover overflow-hidden">
          <div className="absolute inset-0 bg-[url('/petha-craftsman.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
        </div>
      </div>

      {/* Our Mission section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="order-2 lg:order-1 relative h-96 luxury-image-hover overflow-hidden">
          <div className="absolute inset-0 bg-[url('/petha-varieties.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Mission</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          <div className="text-serif-regular text-luxury-charcoal/80 space-y-4">
            <p>
              At Taj Petha, our mission is simple: to treat every customer like royalty and to exceed expectations with every bite. We honor the legacy of Agra's sweet artisans by using only premium ingredients, meticulous quality controls, and eco-friendly packaging.
            </p>
            <p>
              Whether you're seeking classic crystal-white Kesar Petha, exotic flavours like Rose and Elaichi, or limited-edition gourmet blends, our commitment remains the same—unmatched taste, nutrition, and purity.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Taj Petha section */}
      <div className="mb-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Why Choose Taj Petha?</h2>
          <div className="h-px w-16 bg-luxury-gold mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-6 bg-luxury-cream/30">
            <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Authentic Agra Heritage</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Handcrafted in the heart of Agra using recipes perfected over centuries, our pethas capture the city's royal legacy and Mughal flavors.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-6 bg-luxury-cream/30">
            <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Premium Ingredients</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              We source only Grade A ash gourd, fragrant saffron, natural rose extracts, and 100% pure sugar to ensure every piece delivers irresistible taste and nutrition.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-6 bg-luxury-cream/30">
            <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Stringent Quality Control</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              From washing and peeling to cooking and packaging, each step undergoes rigorous, in-house quality checks to guarantee freshness, hygiene, and consistency.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center p-6 bg-luxury-cream/30">
            <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">State-of-the-Art Facilities</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Our modern production units blend traditional karigari (craftsmanship) with automated grinding and packaging lines, assuring safe, tamper-proof products.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="flex flex-col items-center text-center p-6 bg-luxury-cream/30">
            <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Eco-Friendly Packaging & Fast Delivery</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              We use recyclable boxes and air-sealed pouches to lock in flavor and freshness, with pan-India and international shipping options to bring Agra's best sweets right to your doorstep.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="flex flex-col items-center text-center p-6 bg-luxury-cream/30">
            <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Competitive Pricing</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              By controlling every stage of production, we offer premium petha at affordable prices—so everyone can enjoy a taste of Agra.
            </p>
          </div>
        </div>
      </div>

      {/* Our Process section */}
      <div className="mb-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Our Process</h2>
          <div className="h-px w-16 bg-luxury-gold mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">1</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Selection & Washing</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Fresh ash gourds are hand-picked and thoroughly cleaned to remove impurities.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">2</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Cooking & Flavouring</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Gourds are simmered in a light sugar syrup, then infused with natural essences such as saffron, rose, and cardamom.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">3</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Crystalizing & Cutting</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Each piece is carefully crystalized to achieve that signature translucent look, then cut into perfect bite-sized chunks.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-luxury-cream flex items-center justify-center mb-4">
              <span className="font-display text-2xl text-luxury-gold">4</span>
            </div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Packaging & Dispatch</h3>
            <p className="text-serif-regular text-luxury-charcoal/80">
              Once cooled and quality-checked, pethas are sealed in hygienic pouches and packed in sturdy, eco-friendly boxes for delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Meet the Founder section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Meet the Founder</h2>
          <div className="h-px w-16 bg-luxury-gold mb-8"></div>
          <div className="text-serif-regular text-luxury-charcoal/80 space-y-4">
            <p>
              Siddharth Rawal's vision was to showcase Agra's culinary heritage while embracing innovation. A true Agra native, Siddharth combines respect for traditional recipes with a forward-thinking approach to quality, branding, and customer experience.
            </p>
            <p>
              His dedication to excellence has driven Taj Petha to become one of the most trusted names in premium sweets.
            </p>
          </div>
        </div>
        <div className="relative h-96 luxury-image-hover overflow-hidden">
          <div className="absolute inset-0 bg-[url('/founder.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-700"></div>
        </div>
      </div>

      {/* Get in Touch */}
      <div className="bg-luxury-cream/30 p-12">
        <div className="text-center">
          <h2 className="font-display text-2xl text-luxury-charcoal mb-4">Get in Touch</h2>
          <div className="h-px w-16 bg-luxury-gold mx-auto mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-2">Website</h3>
              <a href="https://tajpetha.in" className="text-serif-regular text-luxury-gold hover:text-luxury-gold/80 transition-colors">
                tajpetha.in
              </a>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-2">Email</h3>
              <a href="mailto:support@tajpetha.in" className="text-serif-regular text-luxury-gold hover:text-luxury-gold/80 transition-colors">
                support@tajpetha.in
              </a>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-luxury-ivory border border-luxury-gold/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="font-display text-lg text-luxury-charcoal mb-2">Phone</h3>
              <p className="text-serif-regular text-luxury-gold">
                +91-92594-18994
              </p>
            </div>
          </div>

          <p className="text-serif-regular text-luxury-charcoal/80 max-w-2xl mx-auto mt-10">
            Experience the true taste of Agra—one crystal-clear piece at a time!
          </p>
        </div>
      </div>
    </div>
  )
} 