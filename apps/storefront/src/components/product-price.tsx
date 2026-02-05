import { Loading } from "@/components/ui/loading"
import { Price, PriceProps } from "@/components/ui/price"
import { getProductPrice } from "@/lib/utils/price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  className,
  priceProps,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  className?: string
  priceProps?: Partial<PriceProps>
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variant_id: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <Loading rows={1} />
  }

  return (
    <Price
      price={selectedPrice.calculated_price}
      currencyCode={selectedPrice.currency_code}
      type={variant ? "default" : "range"}
      className={className}
      originalPrice={selectedPrice.price_type === "sale" ? {
        price: selectedPrice.original_price,
        percentage: selectedPrice.percentage_diff,
      } : undefined}
      {...priceProps}
    />
  )
}