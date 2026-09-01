import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import Breadcrumb from "@modules/common/components/breadcrumb"
import { getAllBlogPostIds, getBlogPostById, getRelatedPosts, getLiveBlogProducts } from "@lib/blog"
import BlogPostClient from "@modules/blog/components/blog-post-client"
import MarkdownRenderer from "@modules/blog/components/markdown-renderer"
import {
  Sparkles,
  Clock,
  User,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  HelpCircle,
  Zap,
  Tag,
  ChevronRight,
  BookOpen,
  Calendar,
  Share2
} from "lucide-react"

interface BlogPostProps {
  params: Promise<{
    countryCode: string
    blogId: string
  }>
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
  const imageUrl = post.image.startsWith("http") ? post.image : `https://tajpetha.in${post.image}`

  return {
    title: `${post.title} | Taj Petha Agra`,
    description: post.excerpt,
    keywords: [...(post.tags || []), ...(post.targetKeywords || [])],
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
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl]
    },
    alternates: {
      canonical,
    }
  }
}

// Slug generator for Table of Contents
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

// Extract headings from markdown content for TOC
function extractHeadings(markdown: string) {
  const lines = markdown.split("\n")
  const headings: { id: string; text: string; level: number }[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("## ")) {
      const text = trimmed.replace(/^##\s+/, "").replace(/\*\*/g, "")
      headings.push({ id: slugify(text), text, level: 2 })
    } else if (trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^###\s+/, "").replace(/\*\*/g, "")
      headings.push({ id: slugify(text), text, level: 3 })
    }
  }

  return headings
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { blogId, countryCode } = await params
  const post = getBlogPostById(blogId)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(blogId, 3)
  const imageUrl = post.image.startsWith("http") ? post.image : `https://tajpetha.in${post.image}`
  const headings = extractHeadings(post.content)
  const canonicalUrl = `https://tajpetha.in/${countryCode}/blog/${blogId}`

  // Fetch live product details (prices, thumbnails, titles) dynamically from Medusa
  const handlesToFetch = post.productHandles || post.relatedProducts?.map((p) => p.handle) || []
  const liveProducts = await getLiveBlogProducts(handlesToFetch, countryCode)
  const displayProducts = liveProducts.length > 0 ? liveProducts : post.relatedProducts || []
  const primaryProduct = displayProducts[0]

  // Schema 1: BlogPosting
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
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
      url: "https://tajpetha.in",
    },
    mainEntityOfPage: canonicalUrl,
    keywords: post.tags?.join(", "),
  }

  // Schema 2: BreadcrumbList
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  }

  // Schema 3: FAQPage
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="w-full py-6 sm:py-10 font-jakarta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            items={[
              { label: "Blog", href: `/${countryCode}/blog` },
              { label: post.title, isCurrent: true },
            ]}
            countryCode={countryCode}
            className="rounded-2xl border border-amber-200/60 shadow-xs bg-white/70 backdrop-blur-xs"
          />

          {/* Article Header Card */}
          <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>{post.category}</span>
              </div>

              <h1 className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-4 h-4 text-amber-600" /> {post.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-600" /> {post.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-amber-600" /> {post.publishDate}
                </span>
              </div>
            </div>

            {/* Featured Hero Image */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-amber-50 shadow-inner">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Two-Column Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Content Column (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Position 0 SEO Target: Quick Answer Callout */}
              {post.quickAnswer && (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-amber-100/40 to-amber-50/80 border border-amber-300/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Quick Summary / Key Takeaway</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                    {post.quickAnswer}
                  </p>
                </div>
              )}

              {/* Mobile Table of Contents */}
              {headings.length > 0 && (
                <div className="lg:hidden p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>In This Guide</span>
                  </div>
                  <nav className="space-y-1 text-xs">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className="block py-1 text-slate-700 hover:text-amber-900 transition-colors"
                      >
                        • {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Rich Article Body rendered with robust MarkdownRenderer */}
              <article className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs">
                <MarkdownRenderer content={post.content} countryCode={countryCode} />

                {/* Contextual Live Product Buy Showcase inside Article */}
                {displayProducts.length > 0 && (
                  <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-950">
                        <ShoppingBag className="w-4 h-4 text-amber-700" />
                        <span>Featured Sweets Mentioned in This Guide:</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                        Direct from Agra Kitchens
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {displayProducts.map((prod) => (
                        <Link
                          key={prod.handle}
                          href={`/${countryCode}/products/${prod.handle}`}
                          className="p-4 bg-white rounded-2xl border border-amber-200 hover:border-amber-500 flex items-center justify-between transition-all group shadow-xs hover:shadow-md"
                        >
                          <div className="flex items-center gap-3.5">
                            {prod.thumbnail ? (
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 border border-amber-100">
                                <Image
                                  src={prod.thumbnail}
                                  alt={prod.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                            ) : (
                              <span className="text-2xl flex-shrink-0">{prod.emoji || "🍬"}</span>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                                  {prod.name}
                                </h4>
                                {prod.badge && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900">
                                    {prod.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                                {prod.price}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-xl group-hover:bg-amber-600 group-hover:text-white">
                            Buy <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive FAQs Section (SERP Rich Snippets) */}
                {post.faqs && post.faqs.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-600" />
                      <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
                        Frequently Asked Questions
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {post.faqs.map((faq, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2"
                        >
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                            <span className="text-amber-700 font-mono font-bold">Q:</span>
                            <span>{faq.question}</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio Box */}
                <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 flex-shrink-0 font-bold font-cormorant text-2xl shadow-xs">
                    TP
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      Written by {post.author}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Confectionery master at Taj Petha Agra, dedicated to preserving 350+ years of traditional Indian sweet recipes and natural ingredients.
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {/* Sticky Sidebar Column (4 Cols on Desktop) */}
            <div className="lg:col-span-4">
              <BlogPostClient
                countryCode={countryCode}
                title={post.title}
                url={canonicalUrl}
                headings={headings}
                primaryProduct={primaryProduct}
              />
            </div>
          </div>

          {/* Related Articles Strip */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900">
                Explore More Confectionery Guides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id}
                    href={`/${countryCode}/blog/${rPost.id}`}
                    className="group bg-white rounded-3xl border border-amber-200/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-amber-50">
                        <Image
                          src={rPost.image}
                          alt={rPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-amber-950 font-bold text-[10px] uppercase tracking-wider border border-amber-200/80 shadow-2xs">
                            {rPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 sm:p-6 space-y-2">
                        <h4 className="font-cormorant text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                          {rPost.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {rPost.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 pt-0 border-t border-slate-50 mt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>{rPost.readTime}</span>
                      <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                        Read Story →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}