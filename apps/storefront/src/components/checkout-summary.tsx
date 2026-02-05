import { CartLineItem, CartSummary, CartPromo } from "@/components/cart"
import { Loading } from "@/components/ui/loading"
import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"

interface CheckoutSummaryProps {
  cart: HttpTypes.StoreCart;
}

const CheckoutSummary = ({ cart }: CheckoutSummaryProps) => {
  return (
    <div className="h-fit sticky lg:top-20">
      <div className="flex flex-col gap-8">
        <Suspense fallback={<Loading />}>
          <div className="space-y-4">
            {cart.items?.map((item) => (
              <CartLineItem key={item.id} item={item} cart={cart} type="display" className="first:pt-0" />
            ))}
          </div>
        </Suspense>

        <Suspense fallback={<Loading />}>
          <CartSummary cart={cart} />
        </Suspense>

        <Suspense fallback={<Loading />}>
          <CartPromo cart={cart} />
        </Suspense>
      </div>
    </div>
  )
}

export default CheckoutSummary
