import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import repeat from "@lib/util/repeat"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items || []
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="space-y-4">
      {/* Title & Count */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h1 className="font-cormorant text-2xl sm:text-3xl font-bold text-slate-900">
          Your Sweet Box
        </h1>
        <span className="font-jakarta text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {totalQuantity} {totalQuantity === 1 ? "Pack" : "Packs"}
        </span>
      </div>

      {/* Items Container */}
      <div className="divide-y divide-slate-100">
        {items.length > 0
          ? items
              .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
              .map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code || "INR"}
                />
              ))
          : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
      </div>
    </div>
  )
}

export default ItemsTemplate
