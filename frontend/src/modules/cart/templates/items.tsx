import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="px-6">
      <div className="pb-6 flex items-center border-b border-luxury-lightgold/20">
        <h1 className="font-display text-2xl text-luxury-charcoal">Cart</h1>
      </div>
      
      <div className="mt-4">
        {/* Header */}
        <div className="hidden small:grid grid-cols-[100px_1fr_120px_120px_120px] gap-x-4 pb-4 text-luxury-charcoal/70 text-sm uppercase tracking-wider">
          <div className=""></div>
          <div className="">Item</div>
          <div className="">Quantity</div>
          <div className="">Price</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Items */}
        <div className="flex flex-col divide-y divide-luxury-lightgold/20">
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </div>
      </div>
    </div>
  )
}

export default ItemsTemplate
