import { Link } from "@tanstack/react-router"
import { HttpTypes } from "@medusajs/types"

interface RelatedProductsProps {
  products: HttpTypes.StoreProduct[]
  countryCode: string
  title?: string
}

export const RelatedProducts = ({
  products,
  countryCode,
  title = "You May Also Like",
}: RelatedProductsProps) => {
  if (!products || products.length === 0) {
    return null
  }

  const formatPrice = (amount?: number | null, currencyCode?: string | null) => {
    if (!amount || !currencyCode) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  return (
    <section className="py-24 bg-neutral-50">
      <div className="content-container">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-neutral-900 mb-12 tracking-tight">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product) => {
            const variant = product.variants?.[0]
            const calculatedPrice = variant?.calculated_price
            return (
              <Link
                key={product.id}
                to="/$countryCode/products/$handle"
                params={{ countryCode: countryCode || "us", handle: product.handle || "" }}
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
                  {calculatedPrice && (
                    <p className="text-sm text-neutral-600">
                      {formatPrice(
                        calculatedPrice.calculated_amount,
                        calculatedPrice.currency_code
                      )}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
