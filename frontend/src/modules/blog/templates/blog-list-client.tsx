"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { BlogPost, BlogCategory } from "@lib/blog/types"
import {
  Sparkles,
  Clock,
  User,
  ArrowRight,
  Search,
  BookOpen,
  Calendar,
  ChevronRight,
  TrendingUp,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Heart
} from "lucide-react"

interface BlogListClientProps {
  posts: BlogPost[]
  categories: BlogCategory[]
  countryCode: string
}

export default function BlogListClient({
  posts,
  categories,
  countryCode,
}: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<"latest" | "popular">("popular")

  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "health-nutrition" &&
          post.category.toLowerCase().includes("health")) ||
        (selectedCategory === "buying-guides" &&
          (post.category.toLowerCase().includes("buying") ||
            post.category.toLowerCase().includes("comparison") ||
            post.category.toLowerCase().includes("product"))) ||
        (selectedCategory === "traditional-recipes" &&
          (post.category.toLowerCase().includes("recipe") ||
            post.category.toLowerCase().includes("food science") ||
            post.category.toLowerCase().includes("storage"))) ||
        (selectedCategory === "heritage-culture" &&
          post.category.toLowerCase().includes("heritage")) ||
        (selectedCategory === "snack-guides" &&
          (post.category.toLowerCase().includes("snack") ||
            post.category.toLowerCase().includes("seasonal"))) ||
        (selectedCategory === "gifting" &&
          post.category.toLowerCase().includes("gifting")) ||
        (selectedCategory === "delivery-shipping" &&
          post.category.toLowerCase().includes("delivery"))

      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )

      return matchesCategory && matchesSearch
    })

    if (sortBy === "popular") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [posts, selectedCategory, searchQuery, sortBy])

  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || posts[0]
  }, [posts])

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-amber-200/80 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by sweet name, calories, recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-amber-200/80 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400 text-slate-900 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? "guide" : "guides"}
            </div>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "latest" | "popular")}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-hidden focus:border-amber-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="latest">Latest Stories</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-xs font-bold"
                    : "bg-slate-50 text-slate-700 hover:bg-amber-50 hover:text-amber-950 border border-slate-200/80"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Spotlight Card (Visible when in 'All' and no search query) */}
      {selectedCategory === "all" && !searchQuery.trim() && featuredPost && (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/40 to-white rounded-3xl border border-amber-300/80 p-6 sm:p-10 shadow-xs relative overflow-hidden group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>Featured Guide · {featuredPost.category}</span>
              </div>

              <h2 className="font-cormorant text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                <Link
                  href={`/${countryCode}/blog/${featuredPost.id}`}
                  className="hover:text-amber-800 transition-colors"
                >
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-2 border-t border-amber-200/60">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  {featuredPost.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {featuredPost.readTime}
                </span>
                <span>•</span>
                <span>{featuredPost.publishDate}</span>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${countryCode}/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-bold hover:bg-amber-600 transition-all shadow-xs group"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <Link
                href={`/${countryCode}/blog/${featuredPost.id}`}
                className="block relative aspect-[16/10] rounded-3xl overflow-hidden shadow-sm group bg-amber-100"
              >
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Blog Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No matching guides found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search terms or select another category from the filter pills above.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all")
              setSearchQuery("")
            }}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shadow-xs"
          >
            Show All Articles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${countryCode}/blog/${post.id}`}
              className="group bg-white rounded-3xl border border-amber-200/60 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:border-amber-400"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-amber-50">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-amber-950 font-bold text-[10px] uppercase tracking-wider border border-amber-200/80 shadow-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="font-cormorant text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                    TP
                  </span>
                  <span className="text-slate-600 font-medium">{post.readTime}</span>
                </div>
                <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  Read Article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Taj Petha Trust Ribbon */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-2xl">🍬</span>
            <h5 className="font-bold text-sm text-amber-400">100% Pure Ash Gourd</h5>
            <p className="text-xs text-slate-300">Pure winter melon pulp & traditional single-thread cane syrup.</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl">🚚</span>
            <h5 className="font-bold text-sm text-amber-400">24–48h Dispatch</h5>
            <p className="text-xs text-slate-300">Daily batches dispatched straight from our Agra production kitchens.</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl">🔒</span>
            <h5 className="font-bold text-sm text-amber-400">Vacuum-Sealed Fresh</h5>
            <p className="text-xs text-slate-300">Food-grade airtight nitrogen seals to guarantee zero transit damage.</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl">🏛️</span>
            <h5 className="font-bold text-sm text-amber-400">350+ Years Heritage</h5>
            <p className="text-xs text-slate-300">Preserving the authentic royal sweet recipe created for the Taj Mahal.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
