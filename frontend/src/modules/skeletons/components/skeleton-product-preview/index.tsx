export default function SkeletonProductPreview() {
  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 p-4 shadow-xs flex flex-col h-full animate-pulse">
      {/* Product Image Skeleton */}
      <div className="aspect-square w-full bg-amber-50/80 rounded-xl mb-3 border border-amber-100/60" />
      
      {/* Stars & Category */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="h-3 w-16 bg-amber-100/70 rounded" />
        <div className="h-3 w-8 bg-slate-200/60 rounded" />
      </div>

      {/* Product Title */}
      <div className="h-4 w-4/5 bg-slate-200/80 rounded mb-1.5" />
      <div className="h-3 w-2/3 bg-slate-100 rounded mb-4" />

      {/* Pricing & Add Button Footer */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-5 w-16 bg-slate-200/80 rounded" />
        <div className="h-8 w-20 bg-amber-500/70 rounded-xl" />
      </div>
    </div>
  )
}
