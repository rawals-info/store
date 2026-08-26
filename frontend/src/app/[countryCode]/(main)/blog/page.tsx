import { Metadata } from "next"
import Breadcrumb from "@modules/common/components/breadcrumb"
import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@lib/blog/posts"
import { Sparkles, Clock, User, ArrowRight, BookOpen, Tag } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ countryCode: string }> }): Promise<Metadata> {
  const { countryCode } = await params
  const canonical = `https://tajpetha.in/${countryCode}/blog`
  return {
    title: "Agra Petha & Namkeen Blog | Authentic Recipes, Health Benefits & Heritage | Taj Petha",
    description: "Read expert guides on authentic Agra petha making, ash gourd nutrition benefits, traditional dalmoth preparation, and Mughal sweet heritage stories.",
    robots: { index: true, follow: true, "max-image-preview": 'large', "max-snippet": -1, "max-video-preview": -1 },
    keywords: [
      "petha recipes blog",
      "namkeen health benefits",
      "agra petha history",
      "traditional indian sweets blog",
      "authentic petha preparation",
      "petha nutrition facts",
      "agra food heritage",
    ],
    openGraph: {
      title: "Agra Petha & Namkeen Blog | Traditional Recipes & Stories",
      description: "Explore authentic recipes, health benefits, and culinary history of Agra's most iconic sweets and snacks from Taj Petha master confectioners.",
      url: canonical,
      type: "website",
      locale: "en_IN",
      siteName: "Taj Petha",
    },
    alternates: {
      canonical,
    },
  }
}

const POST_IMAGES: Record<string, string> = {
  "authentic-agra-petha-recipe": "/hero_petha_square.webp",
  "health-benefits-petha-namkeen": "/images/dalmoth.webp",
  "history-agra-petha-heritage": "/hero_petha_square.webp",
  "diwali-sweets-gift-guide": "/images/combo.webp",
  "kesar-vs-angoori-petha": "/hero_petha_square.webp",
  "art-of-making-dalmoth": "/images/dalmoth.webp",
}

export default async function BlogPage({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0]
  const otherPosts = blogPosts.filter(p => p.id !== featuredPost?.id)

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
    blogPost: blogPosts.map(post => ({
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-16 font-jakarta">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[{ label: "Culinary Journal & Blog", isCurrent: true }]}
            countryCode={countryCode}
            className="rounded-2xl border border-amber-100/90 shadow-xs"
          />

          {/* Header */}
          <div className="bg-white rounded-3xl border border-amber-100/90 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
              <span>Agra Culinary Journal</span>
            </div>

            <h1 className="font-cormorant text-4xl sm:text-6xl font-bold text-slate-900 leading-tight">
              Petha Chronicles &amp; Royal Recipes
            </h1>

            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
              Explore authentic Agra sweet recipes, winter melon health benefits, master halwai techniques, and the royal history of India’s most iconic delicacies.
            </p>
          </div>

          {/* Featured Post Card */}
          {featuredPost && (
            <div className="bg-white rounded-3xl border border-amber-100/90 p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-amber-100 shadow-inner">
                  <Image
                    src={POST_IMAGES[featuredPost.id] || "/hero_petha_square.jpg"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-petha-amber text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Featured Story
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="text-petha-amber font-bold">{featuredPost.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {featuredPost.author}</span>
                  </div>

                  <h2 className="font-cormorant text-3xl sm:text-4xl font-bold text-slate-900 leading-tight hover:text-petha-amber transition-colors">
                    <Link href={`/${countryCode}/blog/${featuredPost.id}`}>
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/${countryCode}/blog/${featuredPost.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Articles */}
          <div className="space-y-6">
            <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              Latest Confectionery Articles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl border border-amber-100/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-amber-50 shadow-inner">
                      <Image
                        src={POST_IMAGES[post.id] || "/hero_petha_square.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {post.category}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      <span>•</span>
                      <span>{post.publishDate}</span>
                    </div>

                    <h4 className="font-cormorant text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-petha-amber transition-colors leading-snug">
                      <Link href={`/${countryCode}/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">By {post.author}</span>
                    <Link
                      href={`/${countryCode}/blog/${post.id}`}
                      className="text-xs font-bold text-petha-amber group-hover:translate-x-1 transition-transform flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sweet Box CTA */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-500/20 text-center space-y-6">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
              🍬 Fresh Daily Batches from Agra
            </span>
            <h3 className="font-cormorant text-3xl sm:text-4xl font-bold text-white leading-tight">
              Ready to Taste the Real Agra Heritage?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Order authentic vacuum-sealed White Petha, Kesar Angoori, and Dalmoth straight from Agra to your doorstep in 24–48 hours.
            </p>
            <div>
              <Link
                href={`/${countryCode}/products`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-petha-amber hover:bg-petha-saffron text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Explore All Authentic Agra Sweets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}