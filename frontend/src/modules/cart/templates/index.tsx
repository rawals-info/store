import { HttpTypes } from "@medusajs/types"
import CartClientWrapper from "./cart-client-wrapper"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  // ✅ Delegate to client component for real-time updates
  return <CartClientWrapper initialCart={cart} customer={customer} />
}

export default CartTemplate
