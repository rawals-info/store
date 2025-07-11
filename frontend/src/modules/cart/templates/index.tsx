import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart && cart.items && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 small:gap-x-16">
            <div className="flex flex-col bg-white border border-luxury-lightgold/30 shadow-luxury-sm py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <div className="h-px bg-luxury-gold/20 mx-6"></div>
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white border border-luxury-lightgold/30 shadow-luxury-sm py-6">
                      {/* Gold line at top */}
                      <div className="h-0.5 w-full gold-gradient mb-4"></div>
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
