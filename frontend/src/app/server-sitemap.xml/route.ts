import { sdk } from "@lib/config"

export async function GET() {
  // Base site URL (production fallback)
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in').replace(/^http:\/\//, 'https://')
  // Medusa (or other) Store API base to fetch all products
  const apiBase = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || ''

  if (!apiBase) {
    return new Response('<!-- Missing MEDUSA_BACKEND_URL -->', {
      headers: { 'Content-Type': 'application/xml' },
      status: 500,
    })
  }

  try {
    const data = await sdk.client.fetch<{
      products: Array<{ handle: string; updated_at?: string; status?: string; metadata?: Record<string, any> }>
    }>(`/store/products`, {
      // Request minimal fields plus metadata for filtering
      query: { limit: 10000, fields: "handle,updated_at,status,metadata" },
      next: { revalidate: 60 * 60 * 6 },
      cache: "force-cache",
    })

    const products: Array<{ handle: string; updated_at?: string; status?: string; metadata?: Record<string, any> }> = data?.products || []

    const filtered = products.filter((p) => {
      if (!p?.handle) return false
      // Only published products
      if (p.status && p.status !== 'published') return false
      const md = p.metadata || {}
      // Exclude items with metadata.noindex true / 'true' / '1'
      const ni = (md as any).noindex
      if (ni === true || ni === 'true' || ni === '1') return false
      return true
    })

    let urls = filtered
      .map((p) => {
        const lastmod = p.updated_at || new Date().toISOString()
        const loc = `${baseUrl}/in/products/${p.handle}`
        return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`
      })
      .join("\n")

    // Fallback: sitemap must contain at least one <url> element or Google will error
    if (!urls) {
      console.warn("[sitemap] No product handles found – falling back to homepage entry")
      urls = `<url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (e) {
    console.error('Failed generating server-sitemap:', e)
    return new Response('<!-- Error generating sitemap -->', {
      headers: { 'Content-Type': 'application/xml' },
      status: 500,
    })
  }
} 