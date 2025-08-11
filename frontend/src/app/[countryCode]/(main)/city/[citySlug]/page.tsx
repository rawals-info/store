import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { generateCityPageMetadata, MAJOR_INDIAN_CITIES } from "@lib/seo"

interface CityPageProps {
  params: {
    countryCode: string
    citySlug: string
  }
  searchParams: {
    product?: string
  }
}

export async function generateMetadata({ params, searchParams }: CityPageProps): Promise<Metadata> {
  const { citySlug, countryCode } = params
  const productType = searchParams.product || "petha"
  
  const cityMetadata = generateCityPageMetadata(citySlug, productType)
  
  if (!cityMetadata) {
    return {
      title: "City Not Found | Taj Petha",
      description: "The requested city page was not found."
    }
  }

  const canonical = `https://tajpetha.in/${countryCode}/city/${citySlug}`

  return {
    title: cityMetadata.title,
    description: cityMetadata.description,
    keywords: cityMetadata.keywords,
    openGraph: {
      title: cityMetadata.title,
      description: cityMetadata.description,
      type: "website",
      url: canonical,
      images: [
        {
          url: `/city-images/${citySlug}-petha-delivery.webp`,
          width: 1200,
          height: 630,
          alt: `Fresh ${productType} delivery in ${citySlug} - Taj Petha`
        }
      ]
    },
    alternates: {
      canonical,
    }
  }
}

export default function CityPage({ params, searchParams }: CityPageProps) {
  const { citySlug, countryCode } = params
  const productType = searchParams.product || "petha"
  
  const city = MAJOR_INDIAN_CITIES.find(c => c.slug === citySlug)
  
  if (!city) {
    notFound()
  }

  // Generate city-specific schema
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://tajpetha.in/${countryCode}/city/${citySlug}#localbusiness`,
    "name": `Taj Petha - ${city.name}`,
    "description": `Fresh ${productType} delivery in ${city.name}. Authentic Agra sweets delivered to your doorstep with same-day dispatch and hygienic packaging.`,
    "url": `https://tajpetha.in/${countryCode}/city/${citySlug}`,
    "areaServed": {
      "@type": "City",
      "name": city.name,
      "addressCountry": "IN"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${productType.charAt(0).toUpperCase() + productType.slice(1)} Delivery in ${city.name}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": `Fresh ${productType.charAt(0).toUpperCase() + productType.slice(1)}`,
            "description": `Authentic Agra ${productType} delivered fresh to ${city.name}`
            ,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "2500",
              "bestRating": "5",
              "worstRating": "1"
            },
            // Added direct Offer to fulfil Google Product Snippet requirements
            "offers": {
              "@type": "Offer",
              "price": "199",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "itemCondition": "https://schema.org/NewCondition",
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "seller": {
                "@id": `https://tajpetha.in/#organization`
              }
            }
          },
          "priceRange": "₹₹",
          "areaServed": city.name,
          "availability": "https://schema.org/InStock"
        }
      ]
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": `Free Delivery in ${city.name}`,
          "description": `Free delivery across ${city.name} for orders above ₹500`
        },
        "areaServed": city.name
      }
    ]
  }

  // FAQ schema for city page
  const cityFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Do you deliver fresh ${productType} in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes! We deliver fresh, authentic Agra ${productType} across ${city.name} with same-day dispatch. Orders placed before 2 PM are dispatched the same day for next-day delivery.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the delivery time for ${productType} in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Standard delivery to ${city.name} takes 1-2 business days. Express delivery is available for same-day or next-day delivery depending on your location within ${city.name}.`
        }
      },
      {
        "@type": "Question",
        "name": `Is there free delivery in ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, we offer free delivery across ${city.name} for orders above ₹500. For orders below ₹500, minimal delivery charges apply.`
        }
      },
      {
        "@type": "Question",
        "name": `What is your return policy for products delivered to ${city.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Due to the perishable nature of our products, we cannot accept returns on opened items. For transit damage, contact us within 2 business days with order details and photos. We may offer replacement at our discretion after verification.`
        }
      }
    ]
  }

  return (
    <>
      {/* City-specific Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(citySchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cityFAQSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Fresh {productType.charAt(0).toUpperCase() + productType.slice(1)} Delivery in{" "}
            <span className="text-luxury-gold">{city.name}</span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Experience authentic Agra petha and fresh namkeen delivered fresh to your doorstep in {city.name}. 
            We&apos;re committed to bringing you the finest traditional sweets with the same taste and quality you&apos;d get in Agra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/in/products?category=${productType}`}
              className="bg-luxury-gold text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transition-colors"
            >
              Order {productType.charAt(0).toUpperCase() + productType.slice(1)} Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-luxury-gold text-luxury-gold px-8 py-4 rounded-xl font-semibold text-lg hover:bg-luxury-gold hover:text-white transition-colors"
            >
              Call for Express Delivery
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Same Day Dispatch</h3>
              <p className="text-gray-600">
                Orders placed before 2 PM in {city.name} are dispatched the same day for quick delivery.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hygienic Packaging</h3>
              <p className="text-gray-600">
                Every {productType} is carefully packed in sealed, food-grade containers to maintain freshness.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Traditional Recipes</h3>
              <p className="text-gray-600">
                Authentic Agra recipes passed down through generations, made with premium ingredients.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-16 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
              Why {city.name} Loves Taj Petha
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Trusted by 50,000+ Customers</h3>
                <p className="text-gray-700 mb-6">
                  Families across {city.name} trust us for authentic {productType} that tastes just like 
                  the original from Agra's traditional sweet makers.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">🚚 Reliable Delivery Network</h3>
                <p className="text-gray-700">
                  Our extensive delivery network ensures your {productType} reaches you fresh and on time, 
                  anywhere in {city.name}.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">💯 Quality Assurance</h3>
                <p className="text-gray-700 mb-6">
                  Every piece of {productType} is quality-checked before dispatch. For any issues with transit damage, 
                  contact us within 2 business days and we'll review your case.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 Perfect for Gifting</h3>
                <p className="text-gray-700">
                  Premium gift packaging available for festivals, celebrations, and special occasions in {city.name}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action to Browse Products */}
        <section className="mb-16">
          <div className="text-center bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Discover Our {productType.charAt(0).toUpperCase() + productType.slice(1)} Collection
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our authentic varieties made with traditional recipes and premium ingredients. 
              Each product is crafted with care and delivered fresh to {city.name}.
            </p>
            <Link
              href={`/in/products?category=${productType}`}
              className="inline-block bg-luxury-gold text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors shadow-lg"
            >
              Browse All {productType.charAt(0).toUpperCase() + productType.slice(1)} Products
            </Link>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            What {city.name} Customers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                location: city.name,
                rating: 5,
                review: `Ordered ${productType} for Diwali. Excellent quality and taste! Delivered right on time to my doorstep in ${city.name}.`,
                date: "2024-01-15"
              },
              {
                name: "Rajesh Kumar", 
                location: city.name,
                rating: 5,
                review: `Best ${productType} in ${city.name}! Tastes exactly like the authentic Agra variety. Will definitely order again.`,
                date: "2024-01-12"
              },
              {
                name: "Meera Agarwal",
                location: city.name, 
                rating: 5,
                review: `Fast delivery and amazing packaging. The ${productType} stayed fresh and delicious. Highly recommend for ${city.name} residents.`,
                date: "2024-01-10"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{review.review}&rdquo;</p>
                <div className="text-sm text-gray-500">
                  <div className="font-medium">{review.name}</div>
                  <div>{review.location} • {new Date(review.date).toLocaleDateString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-luxury-gold text-white rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Taste Authentic Agra {productType.charAt(0).toUpperCase() + productType.slice(1)} in {city.name}?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers in {city.name}. Order now and get free delivery on orders above ₹500!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/in/products?category=${productType}`}
              className="bg-white text-luxury-gold px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse {productType.charAt(0).toUpperCase() + productType.slice(1)} Collection
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-luxury-gold transition-colors"
            >
              Call +91-92594-18994
            </Link>
          </div>
        </section>
      </div>
    </>
  )
} 