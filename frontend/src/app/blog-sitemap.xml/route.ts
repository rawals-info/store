import { blogPosts } from "@lib/blog/posts"

function formatW3CDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0]
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim()
  }
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0]
  }
  return new Date().toISOString().split("T")[0]
}

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in').replace(/^http:\/\//, 'https://')

  const urls = blogPosts.map((post) => {
    const lastmod = formatW3CDate(post.publishDate)
    const loc = `${baseUrl}/in/blog/${post.id}`
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}


