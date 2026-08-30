import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { blogPosts, getAllBlogPostIds, getBlogPostById } from "@lib/blog/posts"
import { Sparkles, Clock, User, ArrowLeft, ArrowRight, Share2, ShoppingBag, CheckCircle2, ShieldCheck, Truck } from "lucide-react"

interface BlogPostProps {
  params: Promise<{
    countryCode: string
    blogId: string
  }>
}

const POST_IMAGES: Record<string, string> = {
  "authentic-agra-petha-recipe": "/hero_petha_square.webp",
  "health-benefits-petha-namkeen": "/images/dalmoth.webp",
  "history-agra-petha-heritage": "/hero_petha_square.webp",
  "diwali-sweets-gift-guide": "/images/combo.webp",
  "kesar-vs-angoori-petha": "/hero_petha_square.webp",
  "art-of-making-dalmoth": "/images/dalmoth.webp",
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllBlogPostIds().map((blogId) => ({ countryCode: "in", blogId }))
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { blogId, countryCode } = await params
  const post = getBlogPostById(blogId)

  if (!post) {
    return {
      title: "Blog Post Not Found | Taj Petha",
      description: "The requested blog post was not found."
    }
  }

  const canonical = `https://tajpetha.in/${countryCode}/blog/${blogId}`

  return {
    title: `${post.title} | Taj Petha Agra`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: `https://tajpetha.in${POST_IMAGES[post.id] || "/hero_petha_square.jpg"}`,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    alternates: {
      canonical,
    }
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { blogId, countryCode } = await params
  const post = getBlogPostById(blogId)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter(p => p.id !== blogId).slice(0, 3)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://tajpetha.in/${countryCode}/blog/${blogId}`,
    headline: post.title,
    description: post.excerpt,
    image: `https://tajpetha.in${POST_IMAGES[post.id] || "/hero_petha_square.jpg"}`,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Taj Petha",
      logo: "https://tajpetha.in/logo.webp",
    },
    mainEntityOfPage: `https://tajpetha.in/${countryCode}/blog/${blogId}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="w-full py-6 sm:py-10 font-jakarta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "Blog", href: `/${countryCode}/blog` },
              { label: post.title, isCurrent: true },
            ]}
            countryCode={countryCode}
            className="rounded-2xl border border-amber-200/60 shadow-xs bg-white/70 backdrop-blur-xs"
          />

          {/* Main Article Header Card */}
          <article className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs space-y-6">
            
            {/* Meta tags */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
                <span>{post.category}</span>
              </div>

              <h1 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <User className="w-3.5 h-3.5 text-petha-amber" /> {post.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
                <span>•</span>
                <span>Published on {post.publishDate}</span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-amber-50 shadow-inner">
              <Image
                src={POST_IMAGES[post.id] || "/hero_petha_square.jpg"}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6">
              {post.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h2 key={index} className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900 mt-6 mb-2">
                      {paragraph.replace(/\*\*/g, "")}
                    </h2>
                  )
                }
                if (paragraph.includes("\n- ") || paragraph.startsWith("- ")) {
                  const lines = paragraph.split("\n")
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1.5 text-slate-700">
                      {lines.map((line, lIdx) => (
                        <li key={lIdx}>{line.replace(/^-\s*/, "")}</li>
                      ))}
                    </ul>
                  )
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Interlinked Direct Buy Strip */}
            <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950">
                <ShoppingBag className="w-4 h-4 text-petha-amber" />
                <span>Featured Agra Sweets Mentioned in This Article:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={`/${countryCode}/products/taj-famous-white-petha`}
                  className="p-3.5 bg-white rounded-xl border border-amber-200 hover:border-petha-amber flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🍬</span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-petha-amber transition-colors">
                        Taj Famous White Petha
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">₹289 · 400g Fresh Box</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-petha-amber group-hover:translate-x-0.5 transition-transform">
                    Buy →
                  </span>
                </Link>

                <Link
                  href={`/${countryCode}/products/kesar-angoori-petha`}
                  className="p-3.5 bg-white rounded-xl border border-amber-200 hover:border-petha-amber flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🍯</span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-petha-amber transition-colors">
                        Kesar Angoori Petha
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">₹349 · Spherical Saffron</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-petha-amber group-hover:translate-x-0.5 transition-transform">
                    Buy →
                  </span>
                </Link>
              </div>
            </div>

            {/* Author Bio Box */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-petha-amber flex-shrink-0 font-bold font-cormorant text-xl">
                TP
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  Written by {post.author}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Confectionery master at Taj Petha Agra, dedicated to preserving 350+ years of traditional Indian sweet recipes and natural ingredients.
                </p>
              </div>
            </div>

          </article>

          {/* Related Articles */}
          <div className="space-y-6">
            <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
              Read More Confectionery Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/${countryCode}/blog/${rPost.id}`}
                  className="bg-white rounded-2xl border border-amber-100/90 p-4 shadow-xs hover:shadow-md transition-all space-y-3 group block"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-amber-50">
                    <Image
                      src={POST_IMAGES[rPost.id] || "/hero_petha_square.jpg"}
                      alt={rPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-cormorant text-lg font-bold text-slate-900 group-hover:text-petha-amber transition-colors leading-snug line-clamp-2">
                    {rPost.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {rPost.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}