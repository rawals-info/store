# Product SEO Metadata Guide (Admin)

Use `product.metadata` to control per-product SEO without changing code. The fields below are optional but recommended. If you leave any field empty, the site will fall back to safe defaults.

## Fields to add in product.metadata

Required for best results (high impact):
- seo_title (string): 50–60 chars. Action-oriented, include product name.
- seo_description (string): 130–160 chars. One or two benefits + shipping/packaging.
- seo_keywords (array of strings): 3–8 focused phrases.
- og_image (string): Full URL of the main product image (1200×630 preferred).
- noindex (boolean): true only for drafts/unavailable products.

Nice to have (used in JSON‑LD as additionalProperty):
- shelf_life (string): e.g., "10–12 days unopened; 5–7 days refrigerated after opening".
- ingredients (string): e.g., "Ash gourd, cane sugar, lime water".
- packaging (string): e.g., "Sealed, food‑grade pouch; tamper‑evident".
- origin (string): e.g., "Agra, Uttar Pradesh, India".
- storage (string): e.g., "Keep in a cool, dry place; refrigerate after opening".
- serving (string): e.g., "Enjoy as a snack, dessert, or with masala chai".
- weight_grams (string or number): e.g., "400".
- flavor (string): e.g., "Classic / Kesar / Chocolate".

These appear in the Product JSON‑LD and help eligibility/relevance in rich results.

## Best‑practice templates

### Title (seo_title)
- Format: "Buy {Product Name} Online | Fresh {Variant} | Taj Petha"
- Example: "Buy Dry Petha Online | Fresh Classic Petha | Taj Petha"

### Description (seo_description)
- 1 sentence benefits + shipping/packing. 130–160 chars.
- Template: "{Product} made fresh with hygienic packing and same‑day dispatch. Free delivery above ₹500. Authentic Agra taste."
- Example: "Dry Petha made fresh with hygienic packing and same‑day dispatch. Free delivery above ₹500. Authentic Agra taste from Taj Petha."

### Keywords (seo_keywords)
- 3–8 phrases. Use simple lowercase without punctuation.
- Examples:
  - "dry petha"
  - "buy dry petha online"
  - "agra petha"
  - "fresh petha delivery"
  - "traditional indian sweets"

### Open Graph Image (og_image)
- Full URL to 1200×630 image for social previews (e.g., https://tajpetha.in/images/dry-petha-hero.jpg).

### Noindex (noindex)
- Only set to true for temporary/draft pages.

### Additional attributes (appear in JSON‑LD)
- shelf_life: "10–12 days unopened; 5–7 days refrigerated after opening"
- ingredients: "Ash gourd, cane sugar, lime water"
- packaging: "Sealed, food‑grade pouch; tamper‑evident"
- origin: "Agra, Uttar Pradesh, India"
- storage: "Keep in a cool, dry place; refrigerate after opening"
- serving: "Snack, dessert, garnish, with masala chai"
- weight_grams: "400"
- flavor: "Classic"

## Complete example (Dry Petha)

```
metadata: {
  seo_title: "Buy Dry Petha Online | Fresh Classic Petha | Taj Petha",
  seo_description: "Dry Petha made fresh with hygienic packing and same‑day dispatch. Free delivery above ₹500. Authentic Agra taste from Taj Petha.",
  seo_keywords: [
    "dry petha",
    "buy dry petha online",
    "agra petha",
    "fresh petha delivery",
    "traditional indian sweets"
  ],
  og_image: "https://tajpetha.in/images/dry-petha-hero.jpg",
  noindex: false,

  shelf_life: "10–12 days unopened; 5–7 days refrigerated after opening",
  ingredients: "Ash gourd, cane sugar, lime water",
  packaging: "Sealed, food‑grade pouch; tamper‑evident",
  origin: "Agra, Uttar Pradesh, India",
  storage: "Keep in a cool, dry place; refrigerate after opening",
  serving: "Snack, dessert, garnish, with masala chai",
  weight_grams: "400",
  flavor: "Classic"
}
```

## Quick QA checklist per product
- Title ≤ 60 chars, contains product name + brand.
- Description 130–160 chars, includes freshness/hygiene/dispatch.
- Keywords 3–8 focused phrases.
- OG image URL resolves and crops well in 1200×630.
- Canonical equals the product URL (already auto‑set).
- JSON‑LD present with Offer, priceValidUntil, shippingDetails, returnPolicy, AggregateRating, Review, FAQ, and additionalProperty from metadata.
- Internal links from categories/blog/city pages use the product name.

## Where these appear
- Page head (SEO meta, Open Graph, Twitter): powered by `generateMetadata` in product page.
- Structured data: powered by `generateProductSchema` in `src/lib/seo/index.ts`.

Keep this doc handy while adding or editing products in Medusa Admin. Good metadata + unique copy on the page will help each product rank and win clicks. 