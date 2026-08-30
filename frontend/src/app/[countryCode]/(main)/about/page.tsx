import { getIndiaRegion } from "@lib/constants/india-region"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ShieldCheck, Truck, Leaf, Award, HeartHandshake, CheckCircle2, ArrowRight, Clock, Star } from "lucide-react"

import Breadcrumb from "@modules/common/components/breadcrumb"

interface AboutPageProps {
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { countryCode } = await params
  return {
    title: "About Taj Petha | Authentic Agra Petha Sweet Heritage Since 2013",
    description:
      "Discover the heritage of Taj Petha Agra. Handcrafted daily by master halwais with pure winter melon (ash gourd), royal saffron & pistachio. Fresh nationwide air express delivery.",
    keywords: [
      "About Taj Petha",
      "Authentic Agra Petha",
      "Best Petha in Agra",
      "Agra Sweets Heritage",
      "Buy Petha Online India",
      "Original Kesar Petha Agra",
      "Siddharth Rawal Taj Petha",
    ],
    alternates: {
      canonical: `https://tajpetha.in/${countryCode}/about`,
    },
    openGraph: {
      title: "About Taj Petha | Authentic Agra Sweet Legacy",
      description: "Discover Agra's purest GI-tagged petha and crispy dalmoth, handcrafted fresh daily and delivered across India in 24-48 hours.",
      url: `https://tajpetha.in/${countryCode}/about`,
      siteName: "Taj Petha",
      images: [
        {
          url: "https://tajpetha.in/hero_petha_square.jpg",
          width: 1200,
          height: 630,
          alt: "Taj Petha Agra Master Artisans",
        },
      ],
      type: "article",
    },
  }
}

export default async function AboutPage(props: AboutPageProps) {
  const { countryCode } = await props.params
  const region = getIndiaRegion()

  if (!region) {
    notFound()
  }

  // Structured JSON-LD Schemas for SEO
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Taj Petha",
    legalName: "Taj Petha Confectioners Agra",
    url: "https://tajpetha.in",
    logo: "https://tajpetha.in/logo.webp",
    foundingDate: "2013",
    founder: {
      "@type": "Person",
      name: "Siddharth Rawal",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Noori Gate, Near Taj Mahal",
      addressLocality: "Agra",
      addressRegion: "Uttar Pradesh",
      postalCode: "282001",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-92594-18994",
      contactType: "Customer Support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://facebook.com/tajpethaofficial",
      "https://instagram.com/tajpetha_in",
      "https://twitter.com/tajpetha",
    ],
  }

  const jsonLdAbout = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Taj Petha Confectioners",
    description: "The story of Taj Petha - preserving Agra's 350-year-old royal sweet-making tradition with zero preservatives and nationwide express delivery.",
    url: `https://tajpetha.in/${countryCode}/about`,
  }

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What makes Taj Petha authentic?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Taj Petha is prepared in Agra using 100% farm-fresh ash gourd (winter melon) and traditional open-fire brass kadhais, following the 350-year-old Mughal recipe with zero artificial preservatives.",
        },
      },
      {
        "@type": "Question",
        name: "How fresh does Taj Petha stay during transit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every box is vacuum-sealed immediately after cooking and dispatched via Air Express within 24 hours. Our pethas maintain peak freshness and melt-in-mouth texture for 30 days.",
        },
      },
      {
        "@type": "Question",
        name: "Is Taj Petha 100% vegetarian?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all Taj Petha sweets and namkeens are 100% pure vegetarian, FSSAI certified, and made with natural ingredients.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <div className="w-full py-6 sm:py-10 font-jakarta">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          {/* Hero Story Banner */}
          <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs text-center relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            
            {/* Breadcrumb */}
            <Breadcrumb
              items={[{ label: "Our Story & Heritage", isCurrent: true }]}
              countryCode={countryCode}
              className="p-0 bg-transparent border-0 mb-4 justify-center"
            />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-xs font-jakarta font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
              <span>Agra Heritage Since 2013</span>
            </div>

            <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
              Preserving Agra’s Royal Sweet Heritage
            </h1>

            <p className="font-jakarta text-xs sm:text-sm text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
              Experience India’s purest, crystal-translucent Agra Petha. Handcrafted daily in historic Agra by generational halwais using royal Mughal recipes and 100% natural ash gourd.
            </p>

            {/* Quick Numbers Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="p-3">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 block">50k+</span>
                <span className="text-xs text-slate-500 font-jakarta font-semibold">Happy Sweet Lovers</span>
              </div>
              <div className="p-3">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 block">100%</span>
                <span className="text-xs text-slate-500 font-jakarta font-semibold">Pure Vegetarian &amp; Fresh</span>
              </div>
              <div className="p-3">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 block">30-Day</span>
                <span className="text-xs text-slate-500 font-jakarta font-semibold">Vacuum Freshness</span>
              </div>
              <div className="p-3">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 block">24h</span>
                <span className="text-xs text-slate-500 font-jakarta font-semibold">Express Air Dispatch</span>
              </div>
            </div>
          </div>

          {/* Our Story Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-950 text-xs font-jakarta font-bold uppercase tracking-wider">
                <HeartHandshake className="w-3.5 h-3.5 text-petha-amber" />
                <span>The Taj Petha Origin</span>
              </div>

              <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Born in the Heart of Agra with a Simple Mission
              </h2>

              <div className="font-jakarta text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                  Founded in 2013 by <strong>Siddharth Rawal</strong>, Taj Petha began with a clear purpose: to bridge the gap between century-old traditional Agra sweet-making and modern food safety standards.
                </p>
                <p>
                  Legend tells us that petha was originally created in the royal kitchens of the Mughal Empire during the construction of the Taj Mahal to provide workers with high energy and natural cooling. Over centuries, mass commercialization degraded the authentic taste.
                </p>
                <p>
                  At Taj Petha, we brought back the original royal standard: <strong>open-kadhai slow cooking</strong>, pure winter melon pulp, hand-pounded saffron from Kashmir, and hygienic food-grade air-sealed packaging that keeps every batch as tender as if it were served fresh in Agra today.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  href={`/${countryCode}/products`}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Taste The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Card */}
            <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-amber-100/50 shadow-inner">
                <Image
                  src="/hero_petha_square.webp"
                  alt="Authentic Agra Petha Preparation"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 space-y-2 text-xs font-jakarta text-slate-800">
                <p className="font-bold text-amber-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-petha-amber" />
                  The Agra Confectionery Standard
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Every batch of White Petha, Kesar Angoori, Paan Petha, and Agra Dalmoth is prepared using GI-tagged local techniques passed down through generations.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Excellence */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/70">
                Why Sweet Lovers Choose Us
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
                What Makes Taj Petha Special?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-amber-100/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-petha-amber flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-jakarta font-bold text-base text-slate-900">100% Pure Ash Gourd</h3>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  We use only ripe winter melon without any synthetic fillers or chemical bleaching agents.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-100/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-petha-amber flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-jakarta font-bold text-base text-slate-900">Royal Kashmiri Saffron</h3>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  Natural saffron threads, rose water, and pistachios give our sweets their signature aroma.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-100/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-jakarta font-bold text-base text-slate-900">FSSAI Certified Safety</h3>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  State-of-the-art hygienic cleanrooms ensure touch-free packaging and 100% vegetarian purity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-100/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-petha-amber flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-jakarta font-bold text-base text-slate-900">Air Express Shipping</h3>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  Vacuum-sealed immediately after cooking and delivered anywhere in India within 24–48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Step Crafting Process */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="text-center space-y-2">
              <span className="font-jakarta text-xs uppercase tracking-widest text-petha-amber font-bold inline-block px-3 py-1 rounded-full bg-amber-100/70">
                Halwai Craftsmanship
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900">
                The 4-Step Royal Process
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                <span className="font-mono text-2xl font-bold text-petha-amber">01</span>
                <h4 className="font-jakarta font-bold text-sm text-slate-900">Hand-Picked Ash Gourd</h4>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  Carefully peeled, cubed, and soaked in natural lime water for crisp yet tender texture.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                <span className="font-mono text-2xl font-bold text-petha-amber">02</span>
                <h4 className="font-jakarta font-bold text-sm text-slate-900">Open-Kadhai Simmering</h4>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  Slowly simmered in pure sugar syrup until translucent and infused with natural aromatic juices.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                <span className="font-mono text-2xl font-bold text-petha-amber">03</span>
                <h4 className="font-jakarta font-bold text-sm text-slate-900">Flavor Infusion</h4>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  Infused with pure saffron, paan gulkand, chocolate glaze, or roasted dry fruits.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                <span className="font-mono text-2xl font-bold text-petha-amber">04</span>
                <h4 className="font-jakarta font-bold text-sm text-slate-900">Vacuum Seal &amp; Dispatch</h4>
                <p className="font-jakarta text-xs text-slate-600 leading-relaxed">
                  Sealed in food-grade airtight pouches to lock in natural moisture for 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews & Trust Strip */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-500/20 text-center space-y-6">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            
            <blockquote className="font-cormorant text-2xl sm:text-3xl font-bold text-amber-100 max-w-2xl mx-auto italic leading-relaxed">
              “The most authentic Agra petha I’ve had outside of the old city lanes. Fresh, juicy, and beautifully packed!”
            </blockquote>

            <p className="font-jakarta text-xs sm:text-sm text-slate-400 font-semibold">
              — Verified Sweet Box Customer from Bangalore
            </p>

            <div className="pt-4">
              <Link
                href={`/${countryCode}/products`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-jakarta text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Shop Fresh Agra Sweets &amp; Gift Boxes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}