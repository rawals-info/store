import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { blogPosts, getAllBlogPostIds, getBlogPostById } from "@lib/blog/posts"

interface BlogPostProps {
  params: {
    countryCode: string
    blogId: string
  }
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

  // Optimize title length (under 60 chars)
  const optimizedTitle = post.title.length > 50
    ? `${post.title.substring(0, 47)}... | Taj Petha`
    : `${post.title} | Taj Petha`

  // Optimize description length (under 160 chars)
  const optimizedDescription = post.excerpt.length > 155
    ? `${post.excerpt.substring(0, 152)}...`
    : post.excerpt

  const canonical = `https://tajpetha.in/${countryCode}/blog/${blogId}`

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: post.tags,
    openGraph: {
      title: post.title.length > 55 ? post.title.substring(0, 55) + "..." : post.title,
      description: optimizedDescription,
      url: canonical,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: optimizedTitle,
      description: optimizedDescription,
      images: [post.image],
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

  // Article schema markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://tajpetha.in/${countryCode}/blog/${blogId}`,
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Taj Petha",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tajpetha.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tajpetha.in/${countryCode}/blog/${blogId}`
    },
    "articleSection": post.category,
    "keywords": post.tags.join(", "),
    "wordCount": Math.floor(post.content.length / 5),
    "timeRequired": post.readTime,
    "inLanguage": "en-IN"
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tajpetha.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `https://tajpetha.in/${countryCode}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://tajpetha.in/${countryCode}/blog/${blogId}`
      }
    ]
  }

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href={`/${countryCode}`} className="hover:text-luxury-gold transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href={`/${countryCode}/blog`} className="hover:text-luxury-gold transition-colors">
                Blog
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <span className="font-medium">By {post.author}</span>
            </div>
            <div>•</div>
            <div>{new Date(post.publishDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
            <div>•</div>
            <div>{post.readTime}</div>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-8 aspect-video overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => {
              // Handle bold text with **
              const formatText = (text: string) => {
                return text.split(/(\*\*.*?\*\*)/).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2);
                    return <strong key={i} className="font-bold text-gray-900">{boldText}</strong>;
                  }
                  return part;
                });
              };

              return (
                <div key={index}>
                  {paragraph.startsWith('**') && paragraph.endsWith(':**') ? (
                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </h3>
                  ) : paragraph.startsWith('**') && paragraph.endsWith('**') ? (
                    <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      {paragraph.replace(/\*\*/g, '')}
                    </h4>
                  ) : paragraph.startsWith('- ') ? (
                    <ul className="list-disc pl-6 space-y-2">
                      {paragraph.split('\n').map((item, itemIndex) => (
                        item.startsWith('- ') && (
                          <li key={itemIndex} className="text-gray-700">
                            {formatText(item.substring(2))}
                          </li>
                        )
                      ))}
                    </ul>
                  ) : paragraph.match(/^\d+\./) ? (
                    <ol className="list-decimal pl-6 space-y-2">
                      {paragraph.split('\n').map((item, itemIndex) => (
                        item.match(/^\d+\./) && (
                          <li key={itemIndex} className="text-gray-700">
                            {formatText(item.replace(/^\d+\.\s*/, ''))}
                          </li>
                        )
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {formatText(paragraph)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
              >
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-[#1A1A1A] text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Buy Fresh Petha Online</h3>
          <p className="mb-6 text-gray-300">
            Experience the traditional flavors mentioned in this article. Same-day dispatch, free delivery ₹500+
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${countryCode}/products`}
              className="inline-block bg-[#C9A962] text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#B8983D] transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href={`/${countryCode}/buy-petha-online`}
              className="inline-block border-2 border-[#C9A962] text-[#C9A962] px-8 py-3 rounded-xl font-bold hover:bg-[#C9A962] hover:text-black transition-colors"
            >
              Buy Petha Online
            </Link>
          </div>
        </div>

        {/* Related Posts Section for SEO Interlinking */}
        <div className="mt-12">
          <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts
              .filter(p => p.id !== blogId && p.category === post.category)
              .slice(0, 3)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/${countryCode}/blog/${relatedPost.id}`}
                  className="group border border-gray-200 rounded-xl p-4 hover:border-[#C9A962] transition-all"
                >
                  <span className="text-xs text-[#C9A962] font-medium">{relatedPost.category}</span>
                  <h4 className="font-semibold text-[#1A1A1A] group-hover:text-[#C9A962] transition-colors mt-1 line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{relatedPost.excerpt}</p>
                  <span className="text-sm text-[#C9A962] font-medium mt-3 inline-block group-hover:underline">
                    Read More →
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* Quick Product Links for SEO */}
        <div className="mt-10 p-6 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-[#1A1A1A] mb-4">Popular Products</h3>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${countryCode}/products/dry-petha`} className="text-sm text-[#C9A962] hover:underline">Buy Dry Petha</Link>
            <span className="text-gray-300">|</span>
            <Link href={`/${countryCode}/products/kesar-petha`} className="text-sm text-[#C9A962] hover:underline">Buy Kesar Petha</Link>
            <span className="text-gray-300">|</span>
            <Link href={`/${countryCode}/products`} className="text-sm text-[#C9A962] hover:underline">All Products</Link>
            <span className="text-gray-300">|</span>
            <Link href={`/${countryCode}/buy-petha-online`} className="text-sm text-[#C9A962] hover:underline">Buy Petha Online</Link>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href={`/${countryCode}/blog`}
            className="inline-flex items-center text-[#C9A962] font-medium hover:underline"
          >
            ← Back to All Articles
          </Link>
        </div>
      </article>
    </>
  )
} 