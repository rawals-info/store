export async function GET() {
  // Base site URL (production fallback)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tajpetha.in'
  // Medusa (or other) Store API base to fetch all products
  const apiBase = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || process.env.MEDUSA_BACKEND_URL || ''

  if (!apiBase) {
    return new Response('<!-- Missing MEDUSA_BACKEND_URL -->', {
      headers: { 'Content-Type': 'application/xml' },
      status: 500,
    })
  }

  try {
    // Fetch up to 10 000 products – adjust if you expect more
    const resp = await fetch(`${apiBase}/store/products?limit=10000&fields=handle`, {
      // Cache for 6 h to avoid hammering the API
      next: { revalidate: 60 * 60 * 6 },
    })

    const data = await resp.json()
    const products: Array<{ handle: string }> = data?.products || []

    let urls = products
      .filter((p) => p?.handle)
      .map(
        (p) =>
          `<url><loc>${`${baseUrl}/in/products/${p.handle}`}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`
      )
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