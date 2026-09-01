export interface BlogFAQ {
  question: string
  answer: string
}

export interface BlogProductLink {
  name: string
  handle: string
  price: string
  description?: string
  thumbnail?: string | null
  emoji?: string
  badge?: string
}

export interface BlogTable {
  caption?: string
  headers: string[]
  rows: string[][]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  quickAnswer?: string
  content: string
  author: string
  publishDate: string
  readTime: string
  category: string
  tags: string[]
  image: string
  featured?: boolean
  faqs?: BlogFAQ[]
  productHandles?: string[]
  relatedProducts?: BlogProductLink[]
  tableData?: BlogTable
  targetKeywords?: string[]
}
