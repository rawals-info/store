"use client"

export default function SkeletonProductPage() {
  return (
    <div className="w-full py-6 sm:py-10 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-10 w-72 bg-white/70 border border-amber-200/60 rounded-2xl mb-6" />

        {/* Main Product Card Skeleton (12-Col Geometry) */}
        <div className="bg-white rounded-3xl border border-amber-200/60 p-5 sm:p-8 lg:p-10 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Image Gallery Skeleton (5-Col) */}
            <div className="w-full lg:col-span-5 max-w-[460px] mx-auto lg:max-w-none space-y-4">
              <div className="aspect-square w-full bg-amber-50/80 rounded-2xl border border-amber-100/60" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-amber-50/60 rounded-xl border border-amber-100/50" />
                ))}
              </div>
            </div>

            {/* Right Column: Product Details & Actions Skeleton (7-Col) */}
            <div className="w-full lg:col-span-7 flex flex-col space-y-6">
              
              {/* Category Badge & Live Social Proof */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-36 bg-amber-100/70 rounded-full" />
                <div className="h-4 w-20 bg-slate-200/60 rounded" />
              </div>

              {/* Title & Stars */}
              <div className="space-y-3">
                <div className="h-9 sm:h-12 w-4/5 bg-slate-200/80 rounded-xl" />
                <div className="flex items-center gap-3">
                  <div className="h-5 w-28 bg-amber-100/80 rounded-md" />
                  <div className="h-5 w-32 bg-emerald-50 border border-emerald-200/60 rounded-md" />
                </div>
              </div>

              {/* Promo Banner Card */}
              <div className="h-14 w-full bg-amber-50/80 border border-amber-200/70 rounded-2xl" />

              {/* Description Lines */}
              <div className="space-y-2.5">
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-11/12 bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>

              {/* Variant Selector Options */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="h-4 w-28 bg-slate-200/70 rounded" />
                <div className="flex gap-3">
                  <div className="h-12 w-28 bg-amber-50/70 border border-amber-200 rounded-xl" />
                  <div className="h-12 w-28 bg-slate-100 rounded-xl" />
                  <div className="h-12 w-28 bg-slate-100 rounded-xl" />
                </div>

                {/* Price & Quantity & Add To Cart */}
                <div className="pt-4 space-y-3">
                  <div className="h-8 w-32 bg-slate-200/80 rounded-lg" />
                  <div className="h-14 w-full bg-amber-500/80 rounded-2xl" />
                </div>
              </div>

              {/* Trust Badges Strip */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl" />
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* FAQ Section Skeleton */}
        <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-10 shadow-xs mb-12 space-y-4">
          <div className="h-6 w-44 bg-amber-100/70 rounded-full mb-2" />
          <div className="h-8 w-64 bg-slate-200/80 rounded-lg mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-slate-50 border border-slate-100 rounded-xl" />
          ))}
        </div>

      </div>
    </div>
  )
}