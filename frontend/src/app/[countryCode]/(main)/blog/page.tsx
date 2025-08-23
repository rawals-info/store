import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { blogPosts } from "@lib/blog/posts"

export async function generateMetadata({ params }: { params: { countryCode: string } }): Promise<Metadata> {
  const { countryCode } = await params
  const canonical = `https://tajpetha.in/${countryCode}/blog`
  return {
    title: "Petha & Namkeen Blog | Traditional Recipes & Stories | Taj Petha",
    description: "Discover authentic Agra petha recipes, health benefits of Indian sweets, traditional namkeen methods, and heritage stories from Taj Petha experts.",
    keywords: [
      "petha recipes blog",
      "namkeen health benefits",
      "agra petha history",
      "traditional indian sweets blog",
      "authentic petha preparation",
      "namkeen recipes",
      "indian sweet making techniques",
      "petha nutrition facts",
      "agra food heritage",
      "traditional sweet preservation"
    ],
    openGraph: {
      title: "Petha & Namkeen Blog - Traditional Recipes & Stories",
      description: "Explore authentic recipes, health benefits, and fascinating stories about India's beloved petha and namkeen. Expert insights from traditional sweet makers.",
      url: canonical,
      type: "website",
      locale: "en_IN",
      siteName: "Taj Petha",
      images: [
        {
          url: "/blog-hero-image.webp",
          width: 1200,
          height: 630,
          alt: "Traditional Petha Making Process - Taj Petha Blog"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Petha & Namkeen Blog | Traditional Recipes & Stories",
      description: "Discover authentic recipes, health benefits, and heritage stories about India's beloved petha and namkeen from Taj Petha experts.",
      images: ["/blog-hero-image.webp"],
    },
    alternates: {
      canonical,
    }
  }
}

// Generate blog list schema
const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://tajpetha.in/in/blog#blog",
  "name": "Taj Petha Blog - Traditional Indian Sweets & Snacks",
  "description": "Expert insights on traditional petha recipes, namkeen preparation, health benefits, and India's rich sweet heritage from Taj Petha masters.",
  "url": "https://tajpetha.in/in/blog",
  "publisher": {
    "@id": "https://tajpetha.in/#organization"
  },
  "inLanguage": "en-IN",
  "blogPost": blogPosts.map(post => ({
    "@type": "BlogPosting",
    "@id": `https://tajpetha.in/in/blog/${post.id}`,
    "headline": post.title,
    "description": post.excerpt,
    "url": `https://tajpetha.in/in/blog/${post.id}`,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@id": "https://tajpetha.in/#organization"
    },
    "image": post.image,
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": Math.floor(post.content.length / 5), // Approximate word count
    "timeRequired": post.readTime
  }))
}

export default function BlogPage({ params }: { params: { countryCode: string } }) {
  const { countryCode } = params
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <>
      {/* Blog Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogListSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Traditional Sweets & Snacks Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover authentic recipes, health benefits, and fascinating stories about India&apos;s beloved petha and namkeen. 
            Expert insights from traditional sweet makers and food historians.
          </p>
        </div>

        {/* Featured Articles Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white rounded-2xl border border-gray-100">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={800}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="bg-luxury-gold text-white px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-luxury-gold transition-colors">
                      <Link href={`/${countryCode}/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.publishDate).toLocaleDateString('en-IN')}</span>
                      </div>
                      <Link 
                        href={`/${countryCode}/blog/${post.id}`}
                        className="text-luxury-gold font-medium hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Articles Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post.id} className="group hover:shadow-lg transition-all duration-300 bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-luxury-gold transition-colors">
                    <Link href={`/${countryCode}/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>By {post.author}</span>
                    </div>
                    <Link 
                      href={`/${countryCode}/blog/${post.id}`}
                      className="text-luxury-gold font-medium hover:underline text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-gradient-to-r from-luxury-gold to-yellow-600 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Traditional Recipes</h3>
          <p className="mb-6 text-yellow-100">
            Get weekly insights on traditional Indian sweets, authentic recipes, and exclusive offers from Taj Petha.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900"
            />
            <button className="bg-white text-luxury-gold px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </section>

        {/* Quick product links for readers */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Shop Our Bestsellers</h3>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${countryCode}/products/dry-petha`} className="text-sm text-gray-700 hover:text-luxury-gold underline-offset-2 hover:underline">Dry Petha</Link>
            <Link href={`/${countryCode}/products/chocolate-petha`} className="text-sm text-gray-700 hover:text-luxury-gold underline-offset-2 hover:underline">Chocolate Petha</Link>
            <Link href={`/${countryCode}/products/dalmoth`} className="text-sm text-gray-700 hover:text-luxury-gold underline-offset-2 hover:underline">Dalmoth</Link>
            <Link href={`/${countryCode}/products/combo`} className="text-sm text-gray-700 hover:text-luxury-gold underline-offset-2 hover:underline">Combo Dalmoth Petha</Link>
          </div>
        </section>
      </div>
    </>
  )
} 