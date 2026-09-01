import { BlogPost } from "./types"
import { healthBlogPosts } from "./data/health-posts"
import { buyingBlogPosts } from "./data/buying-guides"
import { recipesHeritageBlogPosts } from "./data/recipes-heritage"
import { snacksDeliveryBlogPosts } from "./data/snacks-delivery"

export * from "./types"
export * from "./categories"

// Combined list of all modular blog posts
export const blogPosts: BlogPost[] = [
  ...healthBlogPosts,
  ...buyingBlogPosts,
  ...recipesHeritageBlogPosts,
  ...snacksDeliveryBlogPosts,
]

// Query helper utilities
export const getAllBlogPostIds = (): string[] => {
  return blogPosts.map((post) => post.id)
}

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.id === id)
}

export const getPostsByCategory = (category: string): BlogPost[] => {
  if (!category || category.toLowerCase() === "all") return blogPosts
  return blogPosts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  )
}

export const getRelatedPosts = (currentId: string, limit: number = 3): BlogPost[] => {
  const currentPost = getBlogPostById(currentId)
  if (!currentPost) return blogPosts.slice(0, limit)

  // Prioritize posts in the same category, then fallback to others
  const sameCategory = blogPosts.filter(
    (p) => p.id !== currentId && p.category === currentPost.category
  )
  const otherPosts = blogPosts.filter(
    (p) => p.id !== currentId && p.category !== currentPost.category
  )

  return [...sameCategory, ...otherPosts].slice(0, limit)
}

export const searchBlogPosts = (query: string): BlogPost[] => {
  if (!query.trim()) return blogPosts
  const q = query.toLowerCase()
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  )
}
