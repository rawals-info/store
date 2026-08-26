import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  countryCode?: string
  className?: string
  hideSchema?: boolean
}

export default function Breadcrumb({
  items,
  countryCode = "in",
  className = "",
  hideSchema = false,
}: BreadcrumbProps) {
  // Always prepend Home
  const allItems: BreadcrumbItem[] = [
    { label: "Home", href: `/${countryCode}` },
    ...items,
  ]

  // Schema.org BreadcrumbList JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href
        ? (item.href.startsWith("http") ? item.href : `https://tajpetha.in${item.href}`)
        : undefined,
    })),
  }

  return (
    <>
      {!hideSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <nav
        aria-label="Breadcrumb"
        className={`w-full py-3 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-xs border-b border-amber-100/80 ${className}`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs font-jakarta text-slate-500 overflow-x-auto whitespace-nowrap no-scrollbar py-0.5">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            const isHome = index === 0

            return (
              <div key={item.label + index} className="flex items-center gap-1.5 flex-shrink-0">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                )}

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 hover:text-petha-amber transition-colors font-medium text-slate-600 hover:underline underline-offset-4"
                  >
                    {isHome && <Home className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1 font-bold ${
                      isLast
                        ? "text-petha-amber bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/50"
                        : "text-slate-800"
                    }`}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {isHome && <Home className="w-3.5 h-3.5 text-petha-amber" />}
                    <span className="truncate max-w-[200px] sm:max-w-none">{item.label}</span>
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </nav>
    </>
  )
}
