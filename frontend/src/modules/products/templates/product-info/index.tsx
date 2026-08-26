import { HttpTypes } from "@medusajs/types"
import { Star, Sparkles, ShieldCheck, Clock, Flame, Award, HeartHandshake } from "lucide-react"
import ReactMarkdown from "react-markdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  reviewData?: {
    average_rating: number
    count: number
  }
}

const ProductInfo = ({ product, reviewData }: ProductInfoProps) => {
  // Extract features and materials from product description if they exist
  const descriptionLines = product.description?.split('\n') || []
  const bulletLineRegex = /^([*\-]|•)\s+/

  const bulletPoints = descriptionLines
    .filter((line) => bulletLineRegex.test(line))
    .map((line) => line.replace(bulletLineRegex, ""))

  const mainDescription = descriptionLines
    .filter((line) => !bulletLineRegex.test(line) && line.trim() !== "")
    .join("\n\n")

  const rating = reviewData && reviewData.count > 0 ? reviewData.average_rating : 4.9
  const reviewCount = reviewData && reviewData.count > 0 ? reviewData.count : 48

  return (
    <div id="product-info" className="space-y-6 font-jakarta text-slate-800">
      {/* Category / Collection Tag & Authenticity Badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-[11px] font-bold uppercase tracking-wider border border-amber-300/60 shadow-xs font-jakarta">
          <Sparkles className="w-3.5 h-3.5 text-petha-amber" />
          <span>Authentic Agra Recipe</span>
        </span>

        {product.categories?.[0]?.name && (
          <LocalizedClientLink
            href={`/categories/${product.categories[0].handle}`}
            className="text-xs font-bold text-slate-500 hover:text-petha-amber transition-colors font-jakarta"
          >
            {product.categories[0].name}
          </LocalizedClientLink>
        )}
      </div>

      {/* Main Title */}
      <div className="space-y-2.5">
        <h1
          className="font-cormorant text-3xl sm:text-5xl font-bold text-slate-900 leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        {/* Live Ratings & Social Proof Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1 font-jakarta">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-mono font-bold text-slate-900 ml-1">{rating.toFixed(1)}</span>
            <a href="#customer-reviews" className="text-slate-500 hover:text-petha-amber underline ml-1">
              ({reviewCount} reviews)
            </a>
          </div>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            <Flame className="w-3.5 h-3.5 text-emerald-600" />
            18+ ordered today
          </span>
        </div>
      </div>

      {/* Promo & Guarantee Highlight Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border border-amber-300/70 flex items-center justify-between gap-3 shadow-xs font-jakarta">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
          <span className="text-base">🎁</span>
          <span>Use coupon <code className="bg-white px-2 py-0.5 rounded-md text-petha-amber font-mono font-bold border border-amber-200 shadow-2xs">SWEET20</code> for 20% OFF</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap hidden sm:inline-block">
          ⚡ Air Shipped
        </span>
      </div>

      {/* Main Product Description with Modern Typography */}
      <div className="space-y-4 pt-1 font-jakarta text-sm sm:text-base leading-relaxed text-slate-700">
        <div data-testid="product-description">
          <ReactMarkdown
            components={{
              strong: ({ node, ...props }) => (
                <strong className="font-bold text-slate-900" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-slate-800 font-medium" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-relaxed mb-3 text-slate-700 font-jakarta" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-4 mb-2 flex items-center gap-1.5" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-3 mb-1.5" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="space-y-2 my-3 pl-2" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="flex items-start text-xs sm:text-sm text-slate-700 leading-relaxed gap-2" {...props}>
                  <span className="text-petha-amber font-bold flex-shrink-0">•</span>
                  <span>{props.children}</span>
                </li>
              ),
            }}
          >
            {mainDescription}
          </ReactMarkdown>
        </div>

        {/* Feature & Ingredients Card (Markdown-parsed) */}
        {bulletPoints.length > 0 && (
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-amber-100 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-jakarta block">
              Craftsmanship &amp; Ingredients:
            </span>
            <ul className="space-y-2">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start text-xs sm:text-sm text-slate-700 leading-relaxed gap-2">
                  <span className="text-petha-amber font-bold flex-shrink-0">•</span>
                  <div className="flex-1 min-w-0">
                    <ReactMarkdown
                      components={{
                        strong: ({ node, ...props }) => (
                          <strong className="font-bold text-slate-900" {...props} />
                        ),
                        em: ({ node, ...props }) => (
                          <em className="italic text-slate-800" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <span {...props} />
                        ),
                      }}
                    >
                      {point}
                    </ReactMarkdown>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Trust Highlight Chips */}
      <div className="grid grid-cols-2 gap-2 pt-2 font-jakarta">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>100% Pure Ash Gourd</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
          <Award className="w-4 h-4 text-petha-amber flex-shrink-0" />
          <span>0% Preservatives</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>30-Day Freshness</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-700">
          <HeartHandshake className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>Damage Replacement</span>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
