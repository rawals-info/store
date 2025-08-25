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
  },
  {
    id: "best-agra-petha-online-buying-guide",
    title: "Best Agra Petha Online (2025): Types, Prices, Shelf Life & Delivery Guide",
    excerpt: "Buy authentic Agra petha online with confidence. Compare types (kesar, dry, chocolate), prices, shelf life, delivery, packaging, and storage tips to get fresh petha anywhere in India.",
    content: `Looking to buy the best Agra petha online and get it delivered fresh to your city? This comprehensive buyer's guide explains the different types of petha, average prices, ideal storage, and how to make sure you receive authentic sweets directly from traditional makers.

**Popular Types of Agra Petha (and When to Choose Each):**
- Dry Petha: Long shelf life, firm bite, great for gifting and shipping
- Kesar Petha: Infused with saffron, aromatic and festive
- Angoori Petha: Bite-sized, juicy cubes for snacking
- Chocolate Petha: Modern twist, kid-friendly dessert option
- Pan Gilori Petha: Refreshing after-meal treat with paan-inspired notes

**Average Price Range in 2025 (India):**
- Dry Petha: ₹280–₹420 per 500g depending on brand and quality
- Kesar Petha: ₹350–₹520 per 500g due to saffron and premium packaging
- Assorted Gift Boxes: ₹600–₹1200 for curated mixes and festivals

**Shelf Life & Freshness:**
- Dry Petha: 45–60 days (airtight, cool place)
- Kesar/Angoori: 20–30 days (refrigeration recommended after opening)
- Avoid direct sunlight and moisture; always reseal in airtight containers

**How to Check Authenticity When Buying Online:**
1. Look for clear origin labeling: “Made in Agra” with maker details
2. Prefer brands sharing ingredient lists and batch dates
3. Check reviews mentioning freshness, texture, and packaging
4. Ensure tamper-evident, food-grade packaging and vacuum seals

**Delivery & Packaging Tips:**
- Prefer sellers with insulated packaging and quick dispatch (24–48 hours)
- For long-distance shipping, choose Dry Petha and layered bubble-wrap boxes
- During summer, select early-morning dispatch slots and sealed packs

**Storage After Delivery:**
- Unopened: Store in a cool, dry place away from heat
- Opened: Transfer to airtight glass or steel containers; refrigerate kesar/juicy variants
- Travel/Gifting: Use small, sealed pouches for convenience and portion control

Choosing the right type and storage can significantly improve your experience. Taj Petha offers fresh, authentic Agra petha with protective packaging and quick delivery so it reaches you as intended—translucent, fragrant, and delicious.`,
    author: "Editorial Team – Taj Petha",
    publishDate: "2025-01-05",
    readTime: "11 min read",
    category: "Buying Guides",
    tags: [
      "buy agra petha online",
      "best petha in agra",
      "kesar petha price",
      "dry petha shelf life",
      "agra petha delivery",
      "petha gift box",
      "authentic agra petha"
    ],
    image: "https://picsum.photos/800/400?random=17",
    featured: true
  },
  {
    id: "petha-vs-soan-papdi-vs-gulab-jamun",
    title: "Petha vs Soan Papdi vs Gulab Jamun: Calories, Taste, Shelf Life & Occasions",
    excerpt: "Compare classic Indian sweets: petha, soan papdi, and gulab jamun. Learn calories per serving, taste profiles, shelf life, travel-friendliness, and which sweet to choose for gifting or festivals.",
    content: `Confused between petha, soan papdi, and gulab jamun for your next celebration or gift? Here’s a practical comparison covering nutrition, taste, and shelf life so you can choose the perfect sweet for every occasion.

**1) Taste & Texture**
- Petha: Translucent, juicy to firm depending on variant; subtly sweet with floral notes (kesar)
- Soan Papdi: Flaky, airy layers; sweet and nutty, melts in the mouth
- Gulab Jamun: Soft, syrup-soaked balls; rich, milky sweetness with cardamom

**2) Calories (Approx. per 100g)**
- Petha: ~250–280 kcal; lower fat when traditionally prepared
- Soan Papdi: ~500–550 kcal; higher fat due to ghee and sugar
- Gulab Jamun: ~320–360 kcal; fried and sugar-syrup based

**3) Shelf Life & Travel**
- Petha (Dry): 45–60 days; excellent for travel and courier
- Petha (Juicy/Kesar): 20–30 days; refrigerate after opening
- Soan Papdi: 60–90 days sealed; fragile but travel-friendly
- Gulab Jamun: 15–30 days (tin/pack); not ideal for long-distance shipping in heat

**4) Best For**
- Daily Snacking: Dry Petha, Soan Papdi (small portions)
- Festive Gifting: Kesar Petha Gift Box, Soan Papdi assortment
- Celebrations/Meals: Gulab Jamun as dessert

**5) Ingredient Simplicity**
- Petha: Ash gourd, sugar, flavor (saffron/cardamom)
- Soan Papdi: Gram flour, sugar, ghee, nuts
- Gulab Jamun: Khoya/milk solids, flour, sugar syrup, ghee/oil

If you want a lower-fat, travel-safe sweet with authentic Agra heritage, petha is a standout choice. For festival gifting, kesar petha offers premium aroma and presentation. Taj Petha crafts traditional variants with careful syrup consistency and hygienic packaging, delivering freshness across India.`,
    author: "Nutrition & Taste Lab – Taj Petha",
    publishDate: "2025-01-08",
    readTime: "10 min read",
    category: "Comparisons",
    tags: [
      "petha vs soan papdi",
      "petha vs gulab jamun",
      "indian sweets calories",
      "best sweets for gifting",
      "petha shelf life",
      "festival sweets comparison"
    ],
    image: "https://picsum.photos/800/400?random=21"
  },
  {
    id: "top-petha-delivery-cities-india",
    title: "Petha Delivery in India: Top 12 Cities, Delivery Time, Shipping & Freshness Tips",
    excerpt: "Find fast petha delivery in Delhi, Mumbai, Bangalore, Pune, Jaipur and more. Learn shipping timelines, packaging types, summer handling, and how to ensure fresh Agra petha at your doorstep.",
    content: `Looking for reliable petha delivery across India? Here’s a practical guide covering top cities, typical delivery timeframes, and pro tips to keep your sweets fresh in every season.

**Top Cities We Deliver To (Typical Timelines):**
- Delhi NCR: 1–2 days (same/next-day dispatch)
- Mumbai & Pune: 2–3 days (priority air shipping in summer)
- Bangalore & Hyderabad: 2–3 days (insulated packaging)
- Jaipur, Lucknow, Kanpur, Indore: 1–3 days (road + air mix)
- Chennai & Kolkata: 3–4 days (sealed packs, avoid heat exposure)

**Packaging That Protects Freshness:**
- Vacuum-sealed pouches to reduce moisture exposure
- Insulated liners for long routes and hot months
- Rigid boxes + bubble wrap to prevent crushing

**Summer Shipping Tips:**
- Choose Dry Petha for long distances
- Morning dispatch + fast courier for heat-prone routes
- Store immediately in a cool, dry place on arrival

Get authentic Agra petha delivered quickly with packaging tailored to your route and weather. Taj Petha optimizes dispatch windows and materials so your sweets arrive fresh and intact.`,
    author: "Logistics & Freshness Team – Taj Petha",
    publishDate: "2025-01-10",
    readTime: "9 min read",
    category: "Delivery & Shipping",
    tags: [
      "petha delivery delhi",
      "petha delivery mumbai",
      "petha delivery bangalore",
      "agra petha shipping",
      "fresh petha delivery",
      "buy petha online india"
    ],
    image: "https://picsum.photos/800/400?random=31",
    featured: false
  },
  {
    id: "petha-calories-weight-loss-guide",
    title: "Petha Calories & Weight Loss: Is Petha Healthy? Portion Sizes, Macros, Best Time to Eat",
    excerpt: "Understand petha calories, sugar content, and macros. Learn portion control, best time to eat petha, and healthier choices when you’re managing weight or sugar intake.",
    content: `Petha can fit a mindful diet when you understand portions and timing. Here’s a nutrition-forward breakdown to help you enjoy it sensibly.

**Estimated Nutrition (per 100g, traditional petha):**
- Calories: ~250–280 kcal
- Carbohydrates: 60–70 g
- Fat: 0–2 g (traditional methods)
- Protein: 0–1 g

**Portion & Timing Tips:**
- Portion: 25–40 g (a few pieces) is reasonable for most adults
- Best Time: After meals or mid-day; avoid late night
- Pairing: Nuts/curd can help blunt rapid sugar spikes

**Healthier Choices:**
- Prefer Dry Petha for lower syrup content
- Look for clean labels and minimal additives
- Balance weekly intake with activity and fiber-rich meals

Moderation and timing matter more than absolute avoidance. When sourced fresh and eaten in small portions, petha can be an occasional, satisfying treat.`,
    author: "Diet & Wellness Editorial – Taj Petha",
    publishDate: "2025-01-12",
    readTime: "8 min read",
    category: "Health & Nutrition",
    tags: [
      "petha calories",
      "is petha healthy",
      "petha for weight loss",
      "petha sugar content",
      "indian sweets diet"
    ],
    image: "https://picsum.photos/800/400?random=33",
    featured: false
  },
  {
    id: "best-namkeen-for-tea-time",
    title: "Best Namkeen for Tea Time: Low-Oil Options, Regional Favorites, and Pairing Ideas",
    excerpt: "Explore the best namkeen snacks for chai time. Discover low-oil options, classic regional mixes, protein-rich choices, and smart pairings for everyday snacking.",
    content: `Your tea break deserves flavorful yet balanced snacks. Here’s a curated list of namkeen ideas with practical pairing tips.

**Light & Low-Oil Choices:**
- Roasted chivda with peanuts and curry leaves
- Baked sev and chickpea crisps
- Masala murmura (puffed rice) with spices

**Regional Favorites:**
- Agra Dalmoth: Spicy, crunchy, and protein-rich
- Gujarati Gathiya: Mild, soft crunch; pairs well with green chutney
- Rajasthani Mixture: Bold spices, hearty texture

**Protein-Forward Additions:**
- Roasted chana, almonds, cashews in small portions
- Seeds mix (pumpkin, sunflower) for micronutrients

**Pairing Tips with Tea:**
- Masala chai + Dalmoth for heat and balance
- Green tea + baked sev for light evenings
- Ginger tea + roasted chivda for rainy days

For premium freshness and consistent taste, Taj Petha namkeen is crafted in small batches with controlled oil usage and airtight packaging.`,
    author: "Snack Experts – Taj Petha",
    publishDate: "2025-01-14",
    readTime: "7 min read",
    category: "Snack Guides",
    tags: [
      "best namkeen for tea",
      "low oil namkeen",
      "dalmoth",
      "healthy indian snacks",
      "chai snacks"
    ],
    image: "https://picsum.photos/800/400?random=35",
    featured: false
  },
  {
    id: "agra-petha-gifting-ideas",
    title: "Agra Petha Gift Ideas: Wedding Favors, Corporate Hampers, Festive Boxes & Personal Notes",
    excerpt: "Creative petha gifting ideas with budget ranges, customization, shelf life tips, and shipping advice for weddings, festivals, and corporate events across India.",
    content: `Make your gifts memorable with Agra’s signature sweet. This guide helps you choose the right petha assortments and packaging for every occasion.

**Occasions & Ideas:**
- Weddings: Mini kesar petha boxes with monogrammed sleeves
- Festivals: Assorted petha + namkeen combo packs in premium tins
- Corporate: Logo-printed hampers with message cards and shipping tracking

**Budget Ranges:**
- Under ₹500: Dry petha pouches + small namkeen mix
- ₹500–₹1200: Premium kesar petha gift box + greeting card
- ₹1200+: Curated assortments with custom sleeves and tins

**Shelf Life & Shipping Tips:**
- Choose Dry Petha for long-distance gifting
- Request vacuum sealing and rigid outer cartons
- Share storage instructions inside each pack

Taj Petha handles bulk customization, branding, and door-to-door delivery, ensuring your gifts arrive presentable, fresh, and on time.`,
    author: "Gifting & Events – Taj Petha",
    publishDate: "2025-01-16",
    readTime: "9 min read",
    category: "Gifting",
    tags: [
      "petha gift box",
      "corporate gifting sweets",
      "wedding favors petha",
      "festive hampers",
      "agra petha gifts"
    ],
    image: "https://picsum.photos/800/400?random=37",
    featured: true
  },
  {
    id: "agra-petha-history-legends",
    title: "Agra Petha: History, Legends, and the Taj Mahal Connection (A Tasty Timeline)",
    excerpt: "Discover the origin stories of Agra petha, Mughal-era legends, and how this translucent sweet became India’s iconic gift from the city of the Taj Mahal.",
    content: `Agra petha’s story is as captivating as its taste. Journey through time to explore how this sweet became synonymous with Agra’s culinary identity.

**Early Mentions & Mughal Era:**
- Royal kitchens explored cooling desserts for harsh summers
- Ash gourd’s properties made it ideal for a translucent, refreshing sweet

**Craft Evolution:**
- Mastery of syrup consistency defined texture and clarity
- Regional variations emerged while keeping the core craft intact

**Modern Revival & Tourism:**
- Hygienic production, better packaging, and pan-India shipping
- Petha as a cultural souvenir alongside the Taj Mahal experience

Today, Taj Petha blends tradition with reliable shipping and packaging so this heritage sweet can be enjoyed nationwide—fresh and authentic, just as intended.`,
    author: "Food Heritage Desk – Taj Petha",
    publishDate: "2025-01-18",
    readTime: "8 min read",
    category: "Heritage & Culture",
    tags: [
      "history of agra petha",
      "taj mahal petha story",
      "agra sweets heritage",
      "mughal cuisine history",
      "agra food culture"
    ],
    image: "https://picsum.photos/800/400?random=39",
    featured: false
  }
]

export function getBlogPostById(blogId: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === blogId)
}

export function getAllBlogPostIds(): string[] {
  return blogPosts.map((post) => post.id)
}


