import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Petha & Namkeen Blog | Traditional Recipes, Health Benefits & Stories | Taj Petha",
  description: "Discover authentic Agra petha recipes, health benefits of traditional Indian sweets, namkeen preparation methods, and fascinating stories from India's sweet heritage. Expert insights from Taj Petha.",
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
    title: "Petha & Namkeen Blog - Traditional Recipes & Stories | Taj Petha",
    description: "Explore authentic recipes, health benefits, and fascinating stories about India's beloved petha and namkeen. Expert insights from traditional sweet makers.",
    type: "website",
    images: [
      {
        url: "/blog-hero-image.webp",
        width: 1200,
        height: 630,
        alt: "Traditional Petha Making Process - Taj Petha Blog"
      }
    ]
  },
  alternates: {
    canonical: "https://tajpetha.in/blog"
  }
}

// Blog posts data with rich SEO content
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

The key to perfect petha lies in the quality of ash gourd and the precise sugar syrup consistency. Traditional makers test the syrup by dropping a small amount in water - it should form a soft ball when ready.`,
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
Traditional methods using pure ingredients offer better nutritional value compared to mass-produced alternatives. Taj Petha maintains these traditional standards.`,
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
Today's artisans like Taj Petha preserve these ancient recipes while adapting to modern hygiene and packaging standards.`,
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
- Celebration-specific varieties`,
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
We use time-tested preservation methods combined with modern packaging to ensure our products reach you with maximum freshness and traditional taste.`,
    author: "Traditional Food Expert Suresh Gupta",
    publishDate: "2024-01-10",
    readTime: "9 min read",
    category: "Food Science",
    tags: ["food preservation", "traditional techniques", "natural methods", "sweet storage"],
    image: "https://picsum.photos/800/400?random=5",
    featured: false
  }
]

// Generate blog list schema
const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://tajpetha.in/blog#blog",
  "name": "Taj Petha Blog - Traditional Indian Sweets & Snacks",
  "description": "Expert insights on traditional petha recipes, namkeen preparation, health benefits, and India's rich sweet heritage from Taj Petha masters.",
  "url": "https://tajpetha.in/blog",
  "publisher": {
    "@id": "https://tajpetha.in/#organization"
  },
  "inLanguage": "en-IN",
  "blogPost": blogPosts.map(post => ({
    "@type": "BlogPosting",
    "@id": `https://tajpetha.in/blog/${post.id}`,
    "headline": post.title,
    "description": post.excerpt,
    "url": `https://tajpetha.in/blog/${post.id}`,
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

export default function BlogPage() {
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
            Discover authentic recipes, health benefits, and fascinating stories about India's beloved petha and namkeen. 
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
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
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
                      <Link href={`/blog/${post.id}`}>
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
                        href={`/blog/${post.id}`}
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
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
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
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>By {post.author}</span>
                    </div>
                    <Link 
                      href={`/blog/${post.id}`}
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
      </div>
    </>
  )
} 