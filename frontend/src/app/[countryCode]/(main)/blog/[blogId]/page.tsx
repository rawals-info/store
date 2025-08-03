import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

interface BlogPostProps {
  params: {
    countryCode: string
    blogId: string
  }
}

// Blog posts data (same as in the main blog page)
const blogPosts = [
  {
    id: "authentic-agra-petha-recipe",
    title: "The Authentic Agra Petha Recipe: Secrets from Traditional Sweet Makers",
    excerpt: "Discover the centuries-old authentic recipe for making perfect Agra petha at home. Learn the traditional techniques, ingredient secrets, and step-by-step process used by master sweet makers.",
    content: `Learn how to make authentic Agra petha with this traditional recipe passed down through generations. This comprehensive guide covers ingredient selection, preparation techniques, and the secret methods that make Taj Petha's sweets exceptional.

**Ingredients for Authentic Agra Petha:**
- Fresh ash gourd (petha) - 1 kg
- Pure sugar - 500g
- Lime water (chuna) - 2 tbsp
- Cardamom powder - 1 tsp
- Silver leaf (optional)

**Traditional Preparation Method:**
1. Select fresh, tender ash gourd
2. Cut into uniform pieces
3. Soak in lime water for 2 hours
4. Prepare sugar syrup to perfect consistency
5. Cook petha pieces in syrup until translucent
6. Add cardamom for authentic flavor

The key to perfect petha lies in the quality of ash gourd and the precise sugar syrup consistency. Traditional makers test the syrup by dropping a small amount in water - it should form a soft ball when ready.

**Tips for Perfect Petha:**
- Choose ash gourd that's fresh and firm
- The lime water treatment helps maintain texture
- Sugar syrup consistency is crucial - test frequently
- Slow cooking ensures even penetration of syrup
- Store in airtight containers for freshness

**Nutritional Benefits:**
Traditional petha is naturally low in fat and provides essential minerals. When made with quality ingredients and consumed in moderation, it can be part of a balanced diet.`,
    author: "Master Chef Raghunath",
    publishDate: "2024-01-20",
    readTime: "8 min read",
    category: "Traditional Recipes",
    tags: ["petha recipe", "agra sweets", "traditional cooking", "homemade petha"],
    image: "https://picsum.photos/800/400?random=1",
    featured: true
  },
  {
    id: "health-benefits-petha-namkeen",
    title: "Surprising Health Benefits of Traditional Petha and Namkeen",
    excerpt: "Explore the nutritional value and health benefits of traditional Indian sweets and snacks. Learn why petha and namkeen, when consumed mindfully, can be part of a healthy diet.",
    content: `Traditional Indian sweets like petha and namkeen offer surprising health benefits when prepared with quality ingredients and consumed in moderation.

**Health Benefits of Petha:**
- High water content aids hydration
- Natural cooling properties for summer
- Rich in dietary fiber
- Contains essential minerals
- Low in fat when traditionally prepared

**Nutritional Value of Quality Namkeen:**
- Protein from legumes and nuts
- Healthy fats from quality oils
- Essential vitamins and minerals
- Antioxidants from spices

**Traditional vs Modern Preparation:**
Traditional methods using pure ingredients offer better nutritional value compared to mass-produced alternatives. Taj Petha maintains these traditional standards.

**Making Healthier Choices:**
- Choose products with minimal artificial preservatives
- Look for traditional preparation methods
- Consume in moderation as part of balanced diet
- Pair with fresh fruits or nuts for added nutrition

**Seasonal Consumption:**
Different seasons call for different varieties. Summer calls for cooling pethas, while winter warming namkeens provide comfort and energy.`,
    author: "Dr. Priya Sharma, Nutritionist",
    publishDate: "2024-01-18",
    readTime: "6 min read",
    category: "Health & Nutrition",
    tags: ["petha nutrition", "healthy snacks", "traditional foods", "indian diet"],
    image: "https://picsum.photos/800/400?random=2",
    featured: true
  },
  {
    id: "history-agra-petha-heritage",
    title: "The Rich History of Agra Petha: From Mughal Courts to Modern Times",
    excerpt: "Journey through the fascinating history of Agra petha, from its origins in Mughal kitchens to becoming India's most beloved sweet. Discover stories, legends, and cultural significance.",
    content: `The history of Agra petha is as rich and layered as the sweet itself. This beloved confection has traveled through centuries, carrying with it the essence of Indian culinary heritage.

**Mughal Era Origins:**
Petha's journey began in the royal kitchens of Mughal emperors. The sweet was created as a summer delicacy to beat the harsh heat of North India.

**Cultural Significance:**
- Symbol of Agra's culinary identity
- Traditional gift for festivals
- Part of wedding celebrations
- Represents Indian hospitality

**Evolution Through Centuries:**
From simple ash gourd preparations to the variety we see today - kesar petha, chocolate petha, and numerous flavored variants have evolved while maintaining traditional roots.

**Modern Revival:**
Today's artisans like Taj Petha preserve these ancient recipes while adapting to modern hygiene and packaging standards.

**The Taj Mahal Connection:**
Legend has it that petha was first created to refresh the workers building the Taj Mahal. The cooling properties of ash gourd made it perfect for the hot climate.

**Regional Variations:**
While Agra remains the heart of petha making, different regions have developed their own variations, each with unique flavors and preparation methods.`,
    author: "Historian Rajesh Kumar",
    publishDate: "2024-01-15",
    readTime: "10 min read",
    category: "Heritage & Culture",
    tags: ["agra history", "mughal cuisine", "cultural heritage", "traditional sweets"],
    image: "https://picsum.photos/800/400?random=3",
    featured: false
  },
  {
    id: "seasonal-namkeen-guide",
    title: "Seasonal Namkeen Guide: Best Indian Snacks for Every Weather",
    excerpt: "Discover the perfect namkeen for every season. Learn which traditional Indian snacks are ideal for monsoon, winter, summer, and festival seasons.",
    content: `Indian namkeen tradition varies beautifully with seasons. Each weather brings its own snack preferences based on ingredients, preparation methods, and health benefits.

**Summer Namkeen Favorites:**
- Light, crispy varieties
- Minimal oil content
- Cooling spices like mint and fennel
- Easy to digest options

**Monsoon Special Snacks:**
- Hot, spiced varieties
- Immunity-boosting ingredients
- Ginger and turmeric based
- Crispy textures that stay fresh

**Winter Comfort Foods:**
- Rich, warming namkeen
- Nuts and dry fruits
- Ghee-based preparations
- Heavier, satisfying snacks

**Festival Season Specials:**
- Elaborate preparations
- Gift-worthy presentations
- Traditional family recipes
- Celebration-specific varieties

**Storage Tips by Season:**
Each season requires different storage methods to maintain freshness and prevent spoilage. Understanding these helps you enjoy namkeen at their best.`,
    author: "Chef Meera Agarwal",
    publishDate: "2024-01-12",
    readTime: "7 min read",
    category: "Seasonal Cooking",
    tags: ["seasonal snacks", "namkeen varieties", "indian festivals", "weather-based food"],
    image: "https://picsum.photos/800/400?random=4",
    featured: false
  },
  {
    id: "preservation-techniques-traditional-sweets",
    title: "Traditional Preservation Techniques for Petha and Namkeen",
    excerpt: "Learn ancient Indian methods for preserving sweets and snacks without artificial preservatives. Discover how traditional techniques ensure freshness and extend shelf life naturally.",
    content: `Before refrigeration and artificial preservatives, Indian sweet makers developed ingenious techniques to preserve their creations. These methods are still relevant and superior for maintaining taste and nutrition.

**Natural Preservation Methods:**
- Sugar concentration techniques
- Salt-based preservation
- Oil immersion methods
- Controlled moisture content
- Natural antioxidant spices

**Traditional Storage Wisdom:**
- Clay pot storage benefits
- Proper ventilation techniques
- Seasonal storage adjustments
- Temperature control methods

**Modern Applications:**
Today's artisans combine traditional wisdom with modern hygiene standards to create products that stay fresh longer without compromising on health or taste.

**Taj Petha's Approach:**
We use time-tested preservation methods combined with modern packaging to ensure our products reach you with maximum freshness and traditional taste.

**Home Storage Tips:**
Learn how to store your petha and namkeen at home to maintain their quality and extend their shelf life using traditional methods.`,
    author: "Traditional Food Expert Suresh Gupta",
    publishDate: "2024-01-10",
    readTime: "9 min read",
    category: "Food Science",
    tags: ["food preservation", "traditional techniques", "natural methods", "sweet storage"],
    image: "https://picsum.photos/800/400?random=5",
    featured: false
  }
]

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { blogId } = await params
  const post = blogPosts.find(p => p.id === blogId)
  
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

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: post.tags,
    openGraph: {
      title: post.title.length > 55 ? post.title.substring(0, 55) + "..." : post.title,
      description: optimizedDescription,
      url: `https://tajpetha.in/blog/${blogId}`,
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
      canonical: `https://tajpetha.in/blog/${blogId}`
    }
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { blogId } = await params
  const post = blogPosts.find(p => p.id === blogId)
  
  if (!post) {
    notFound()
  }

  // Article schema markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `https://tajpetha.in/blog/${blogId}`,
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
      "@id": `https://tajpetha.in/blog/${blogId}`
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
        "item": "https://tajpetha.in/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://tajpetha.in/blog/${blogId}`
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
              <Link href="/" className="hover:text-luxury-gold transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href="/blog" className="hover:text-luxury-gold transition-colors">
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
        <div className="mt-12 bg-gradient-to-r from-luxury-gold to-yellow-600 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Try Our Authentic Products</h3>
          <p className="mb-6 text-yellow-100">
            Experience the traditional flavors mentioned in this article with our premium collection.
          </p>
          <Link
            href="/in/products"
            className="inline-block bg-white text-luxury-gold px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-luxury-gold font-medium hover:underline"
          >
            ← Back to All Articles
          </Link>
        </div>
      </article>
    </>
  )
} 