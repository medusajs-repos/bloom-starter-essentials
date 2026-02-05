import { Link, useLocation } from "@tanstack/react-router"
import { useState } from "react"
import { useAddToCart } from "@/lib/hooks/use-cart"
import { useCartDrawer } from "@/lib/hooks/use-cart-drawer"
import { DEFAULT_CART_DROPDOWN_FIELDS } from "@/components/cart"
import { getCountryCodeFromPath } from "@/lib/utils/region"

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  variants?: Array<{
    id: string
    calculated_price?: {
      calculated_amount: number
      currency_code: string
    }
  }>
}

interface ProductGridProps {
  title: string
  description?: string
  products: Product[]
  countryCode: string
  showQuickBuy?: boolean
}

export const ProductGrid = ({
  title,
  description,
  products,
  countryCode,
  showQuickBuy = false,
}: ProductGridProps) => {
  return (
    <section className="pt-16 pb-24 bg-white">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-neutral-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              countryCode={countryCode}
              showQuickBuy={showQuickBuy}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const ProductCard = ({
  product,
  countryCode,
  showQuickBuy,
}: {
  product: Product
  countryCode: string
  showQuickBuy: boolean
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const location = useLocation()
  const currentCountryCode = getCountryCodeFromPath(location.pathname) || countryCode || "us"
  const addToCartMutation = useAddToCart({
    fields: DEFAULT_CART_DROPDOWN_FIELDS,
  })
  const { openCart } = useCartDrawer()

  const formatPrice = (amount?: number, currencyCode?: string) => {
    if (!amount || !currencyCode) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount)
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const firstVariant = product.variants?.[0]
    if (!firstVariant?.id) return

    addToCartMutation.mutateAsync(
      {
        variant_id: firstVariant.id,
        quantity: 1,
        country_code: currentCountryCode,
      },
      {
        onSuccess: () => {
          openCart()
        },
      }
    )
  }

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to="/$countryCode/products/$handle"
        params={{ countryCode: currentCountryCode, handle: product.handle || "" }}
        className="block relative"
      >
        <div className="aspect-[3/4] bg-sand-50 mb-4 overflow-hidden relative">
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

          {showQuickBuy && isHovered && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
              <button
                onClick={handleQuickAdd}
                disabled={addToCartMutation.isPending}
                className="w-full bg-white text-neutral-900 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                {addToCartMutation.isPending ? "Adding..." : "Quick Add"}
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="text-sm font-medium text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors">
            {product.title}
          </h3>
          {product.variants?.[0]?.calculated_price && (
            <p className="text-sm text-neutral-600">
              {formatPrice(
                product.variants[0].calculated_price.calculated_amount,
                product.variants[0].calculated_price.currency_code
              )}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}
