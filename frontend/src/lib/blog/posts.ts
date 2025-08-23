export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: string
  category: string
  tags: string[]
  image: string
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
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
    author: "Sid",
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
    author: "Dr. Vivek Sharma, Nutritionist",
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
    author: "Ankit Singh",
    publishDate: "2024-01-15",
    readTime: "10 min read",
    category: "Heritage & Culture",
    tags: ["agra history", "mughal cuisine", "cultural heritage", "traditional sweets"],
    image: "https://picsum.photos/800/400?random=3"
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
    author: "Siddharth Rawal",
    publishDate: "2024-01-12",
    readTime: "7 min read",
    category: "Seasonal Cooking",
    tags: ["seasonal snacks", "namkeen varieties", "indian festivals", "weather-based food"],
    image: "https://picsum.photos/800/400?random=4"
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
    author: "Siddharth Rawal",
    publishDate: "2024-01-10",
    readTime: "9 min read",
    category: "Food Science",
    tags: ["food preservation", "traditional techniques", "natural methods", "sweet storage"],
    image: "https://picsum.photos/800/400?random=5"
  }
]

export function getBlogPostById(blogId: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === blogId)
}

export function getAllBlogPostIds(): string[] {
  return blogPosts.map((post) => post.id)
}


