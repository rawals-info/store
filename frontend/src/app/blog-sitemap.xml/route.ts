import { blogPosts } from "@lib/blog/posts"

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in').replace(/^http:\/\//, 'https://')

  const urls = blogPosts.map((post) => {
    const lastmod = post.publishDate || new Date().toISOString()
    const loc = `${baseUrl}/in/blog/${post.id}`
    return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`
  }).join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}


