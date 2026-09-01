import { Metadata } from "next"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { blogPosts, blogCategories } from "@lib/blog"
import BlogListClient from "@modules/blog/templates/blog-list-client"
import { Sparkles, BookOpen, ChefHat, HeartPulse, ShoppingBag, Truck } from "lucide-react"

export const dynamic = "force-static"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const canonical = `https://tajpetha.in/${countryCode}/blog`
  return {
    title: "Agra Petha & Namkeen Blog | Authentic Recipes, Health Benefits & Heritage | Taj Petha",
    description: "Read expert guides on authentic Agra petha making, ash gourd nutrition benefits, traditional dalmoth preparation, calorie counts, and Mughal sweet heritage stories.",
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    keywords: [
      "petha recipes blog",
      "namkeen health benefits",
      "petha calories weight loss",
      "agra petha history",
      "traditional indian sweets blog",
      "authentic petha preparation",
      "petha nutrition facts",
      "agra food heritage",
      "buy agra petha guide",
    ],
    openGraph: {
      title: "Agra Petha & Namkeen Blog | Traditional Recipes & Confectionery Guides",
      description: "Explore authentic recipes, health benefits, calorie comparisons, and culinary history of Agra's iconic sweets and snacks from Taj Petha master halwais.",
      url: canonical,
      type: "website",
      locale: "en_IN",
      siteName: "Taj Petha",
      images: [
        {
          url: "https://tajpetha.in/hero_petha_square.webp",
          width: 1200,
          height: 630,
          alt: "Taj Petha Agra Culinary Journal & Blog",
        },
      ],
    },
    alternates: {
      canonical,
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `https://tajpetha.in/${countryCode}/blog#blog`,
    name: "Taj Petha Agra Culinary Journal",
    description: "Expert insights on traditional petha recipes, namkeen preparation, health benefits, and India's rich sweet heritage from Taj Petha masters.",
    url: `https://tajpetha.in/${countryCode}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Taj Petha",
      url: "https://tajpetha.in",
      logo: "https://tajpetha.in/logo.webp",
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://tajpetha.in/${countryCode}/blog/${post.id}`,
      datePublished: post.publishDate,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://tajpetha.in/${countryCode}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `https://tajpetha.in/${countryCode}/blog`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="w-full py-6 sm:py-10 font-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[{ label: "Culinary Journal & Guides", isCurrent: true }]}
            countryCode={countryCode}
            className="rounded-2xl border border-amber-200/60 shadow-xs bg-white/70 backdrop-blur-xs"
          />

          {/* Premium Hero Banner */}
          <div className="bg-gradient-to-b from-amber-500/10 via-amber-100/30 to-white rounded-3xl border border-amber-300/70 p-6 sm:p-12 shadow-xs text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>350-Year Confectionery Heritage · Master Halwai Journal</span>
            </div>

            <h1 className="font-cormorant text-3xl sm:text-6xl font-bold text-slate-900 leading-tight max-w-4xl mx-auto">
              Stories, Traditional Recipes & Confectionery Insights
            </h1>

            <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
              Explore authentic Mughal-era sweet recipes, clinical calorie & nutrition breakdowns, preservation science, and the living heritage of Agra's most iconic confections.
            </p>
          </div>

          {/* Interactive Client Component for Category Filtering & Search */}
          <BlogListClient
            posts={blogPosts}
            categories={blogCategories}
            countryCode={countryCode}
          />
        </div>
      </div>
    </>
  )
}