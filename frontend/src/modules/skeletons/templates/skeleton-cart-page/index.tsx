const SkeletonCartPage = () => {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 sm:py-12 font-jakarta">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Skeleton */}
        <div className="w-52 h-10 rounded-2xl bg-amber-100/60 border border-amber-200/60 animate-pulse" />

        {/* Main Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* Left: Cart Items Skeleton Card */}
          <div className="bg-white rounded-3xl border border-amber-200/60 shadow-xs p-5 sm:p-8 space-y-6">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
              <div className="space-y-2">
                <div className="w-44 h-8 bg-amber-100/80 rounded-xl animate-pulse" />
                <div className="w-32 h-4 bg-slate-100 rounded-lg animate-pulse" />
              </div>
              <div className="w-16 h-7 bg-amber-50 border border-amber-200/60 rounded-full animate-pulse" />
            </div>

            {/* Cart Item Skeleton Rows */}
            <div className="divide-y divide-slate-100">
              {[1, 2].map((idx) => (
                <div key={idx} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-100/70 border border-amber-200/60 animate-pulse flex-shrink-0" />
                    
                    {/* Info */}
                    <div className="space-y-2 flex-1">
                      <div className="w-3/4 h-6 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="w-1/2 h-4 bg-slate-100 rounded-md animate-pulse" />
                      <div className="w-20 h-4 bg-emerald-100 rounded-md animate-pulse" />
                    </div>
                  </div>

                  {/* Stepper and Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0">
                    <div className="w-24 h-9 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
                    <div className="w-16 h-6 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Summary Sticky Box Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-amber-200/60 shadow-xs p-6 space-y-6">
              
              {/* Free Shipping Progress Meter */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2.5">
                <div className="w-48 h-4 bg-amber-200/70 rounded-md animate-pulse" />
                <div className="w-full h-2 rounded-full bg-amber-200/60 animate-pulse" />
              </div>

              {/* Summary Rows */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-slate-100 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="w-28 h-4 bg-slate-100 rounded animate-pulse" />
                  <div className="w-14 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
                  <div className="w-12 h-4 bg-emerald-100 rounded animate-pulse" />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <div className="w-20 h-6 bg-slate-200 rounded animate-pulse" />
                  <div className="w-24 h-8 bg-amber-200/80 rounded-xl animate-pulse" />
                </div>
              </div>

              {/* Checkout Button */}
              <div className="w-full h-14 rounded-2xl bg-petha-amber/40 animate-pulse" />

            </div>

            {/* Trust Badges Strip */}
            <div className="bg-white rounded-2xl border border-amber-200/60 p-4 space-y-2">
              <div className="w-full h-4 bg-slate-100 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>

        </div>

        {/* Pairing Recommendations Upsell Skeleton */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200/60 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="w-36 h-4 bg-amber-100 rounded-md animate-pulse" />
            <div className="w-64 h-7 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/60 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-amber-100/70 border border-amber-200/60 animate-pulse flex-shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-amber-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-full h-9 rounded-xl bg-amber-100/60 border border-amber-200/60 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default SkeletonCartPage
