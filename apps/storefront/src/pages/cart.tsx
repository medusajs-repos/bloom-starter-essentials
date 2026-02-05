import {
  CartLineItem,
  CartSummary,
  CartEmpty,
  CartPromo,
} from "@/components/cart"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { useCart, useCreateCart } from "@/lib/hooks/use-cart"
import { useProducts } from "@/lib/hooks/use-products"
import { sortCartItems } from "@/lib/utils/cart"
import { Link, useLoaderData, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useEffect } from "react"

const DEFAULT_CART_FIELDS =
  "id, *items, total, currency_code, subtotal, shipping_total, discount_total, tax_total, *promotions, metadata"

/**
 * Enhanced Cart Page
 *
 * Features:
 * - Cart notes/special instructions
 * - Cross-sell product suggestions
 * - Promo code application
 * - Order summary
 */
const Cart = () => {
  const { region, countryCode } = useLoaderData({
    from: "/$countryCode/cart",
  })
  const location = useLocation()
  const baseHref = countryCode ? `/${countryCode}` : ""
  
  const { data: cart, isLoading: cartLoading } = useCart({
    fields: DEFAULT_CART_FIELDS,
  })
  const createCartMutation = useCreateCart()

  const [cartNotes, setCartNotes] = useState("")

  // Sync cart notes when cart data loads
  useEffect(() => {
    if (cart?.metadata?.notes) {
      setCartNotes(cart.metadata.notes as string)
    }
  }, [cart?.metadata?.notes])

  // Fetch cross-sell products
  const { data: crossSellData } = useProducts({
    fields: "id,title,handle,thumbnail,calculated_price",
    queryParams: { limit: 4 },
    region_id: region.id,
  })

  const crossSellProducts = crossSellData?.pages.flatMap((page) => page.products) || []

  // Auto-create cart if none exists
  if (!cart && !cartLoading && !createCartMutation.isPending) {
    createCartMutation.mutate({ region_id: region.id })
  }

  const cartItems = sortCartItems(cart?.items || [])

  const formatPrice = (amount?: number, currencyCode?: string) => {
    if (!amount || !currencyCode) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  return (
    <div className="content-container pt-32 pb-12">
      {cartLoading ? (
        <Loading />
      ) : cartItems.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Cart Items */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-display font-semibold text-neutral-900 tracking-tight">
                  Shopping Cart
                </h1>
                {cartItems.length > 0 && (
                  <a
                    href={`${baseHref}/store`}
                    className="text-neutral-600 hover:text-neutral-900 text-sm underline"
                  >
                    Continue shopping
                  </a>
                )}
              </div>

              <div className="space-y-6 mb-8">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <CartLineItem
                      item={item}
                      cart={cart!}
                      fields={DEFAULT_CART_FIELDS}
                    />
                    {index < cartItems.length - 1 && (
                      <hr className="bg-neutral-200 mt-6" />
                    )}
                  </div>
                ))}
              </div>

              {/* Cart Notes */}
              <div className="mb-8">
                <label
                  htmlFor="cart-notes"
                  className="block text-sm font-semibold text-neutral-900 mb-2 uppercase tracking-wide"
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  id="cart-notes"
                  value={cartNotes}
                  onChange={(e) => setCartNotes(e.target.value)}
                  placeholder="Special instructions for your order..."
                  className="w-full px-4 py-3 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                  rows={4}
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Add any special requests or delivery instructions
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            {cart && (
              <div className="lg:w-96 flex-shrink-0">
                <div className="bg-sand-50 p-8 sticky top-24">
                  <h2 className="text-lg font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                    Order Summary
                  </h2>

                  <div className="mb-6">
                    <CartSummary cart={cart} />
                  </div>

                  <div className="mb-6">
                    <CartPromo cart={cart} />
                  </div>

                  <a href={`${baseHref}/checkout`}>
                    <Button className="w-full bg-neutral-900 text-white py-4 hover:bg-neutral-800 transition-colors uppercase text-sm font-semibold tracking-wider">
                      Proceed to Checkout
                    </Button>
                  </a>

                  <p className="text-xs text-neutral-600 mt-4 text-center">
                    Free shipping on all orders
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cross-Sell Products */}
          {crossSellProducts.length > 0 && (
            <section className="mt-24 pt-24 border-t border-neutral-200">
              <h2 className="text-2xl font-display font-semibold text-neutral-900 mb-8 tracking-tight">
                Complete Your Look
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {crossSellProducts.slice(0, 4).map((product) => (
                  <a
                    key={product.id}
                    href={`${baseHref}/products/${product.handle}`}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-sand-50 mb-4 overflow-hidden">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-neutral-300 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors">
                        {product.title}
                      </h3>
                      {product.calculated_price && (
                        <p className="text-sm text-neutral-600">
                          {formatPrice(
                            product.calculated_price.calculated_amount,
                            product.calculated_price.currency_code
                          )}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default Cart
