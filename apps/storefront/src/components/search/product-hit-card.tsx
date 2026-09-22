import { Thumbnail } from "@/components/ui/thumbnail"
import { indexedCurrency, priceAttribute } from "@/lib/search-client"
import { formatPrice } from "@/lib/utils/price"
import { Link } from "@tanstack/react-router"
import type { Hit as HitType } from "instantsearch.js"

/**
 * The price fields are per currency, e.g. `min_price_usd`, so they're read
 * through `priceAttribute` rather than declared one by one.
 */
export type ProductGridHit = HitType<
  {
    title: string | null
    handle: string | null
    thumbnail: string | null
  } & Record<string, unknown>
>

const amount = (value: unknown) => (typeof value === "number" ? value : null)

export const hitPricing = (hit: ProductGridHit, currencyCode: string) => {
  const min_price = amount(hit[priceAttribute("min_price", currencyCode)])
  const original_price = amount(
    hit[priceAttribute("original_price", currencyCode)]
  )
  const on_sale =
    hit[priceAttribute("on_sale", currencyCode)] === true &&
    original_price !== null &&
    min_price !== null &&
    original_price > min_price

  return {
    currency_code: indexedCurrency(currencyCode),
    min_price,
    max_price: amount(hit[priceAttribute("max_price", currencyCode)]),
    original_price,
    on_sale,
  }
}

type ProductHitCardProps = {
  hit: ProductGridHit
  countryCode: string
  currencyCode: string
}

export const ProductHitCard = ({
  hit,
  countryCode,
  currencyCode,
}: ProductHitCardProps) => {
  // Without a handle there is no product page to link to.
  if (!hit.handle) {
    return null
  }

  const title = hit.title ?? ""
  const pricing = hitPricing(hit, currencyCode)
  const format = (value: number) =>
    formatPrice({ amount: value, currency_code: pricing.currency_code })

  const max = pricing.max_price ?? pricing.min_price
  const isRange = pricing.min_price !== null && (max ?? 0) > pricing.min_price

  return (
    <Link
      to="/$countryCode/products/$handle"
      params={{ countryCode, handle: hit.handle }}
      className="group flex flex-col w-full"
      data-testid="product-hit-card"
    >
      <div className="aspect-square w-full overflow-hidden bg-[#F5F3F0] relative">
        <Thumbnail
          thumbnail={hit.thumbnail}
          alt={title}
          className="absolute inset-0 object-cover object-center w-full h-full"
        />
      </div>

      <div className="flex text-sm mt-3 justify-between items-start">
        <span className="text-neutral-800 font-normal tracking-wide">
          {title}
        </span>

        {pricing.min_price !== null && (
          <span className="ml-2 flex items-center gap-x-2 whitespace-nowrap font-normal">
            {/* A range already spans the discount, so the struck-through
                original would describe only the cheapest variant. */}
            {!isRange && pricing.on_sale && (
              <span className="text-neutral-400 line-through">
                {format(pricing.original_price as number)}
              </span>
            )}
            <span
              className={pricing.on_sale ? "text-red-600" : "text-neutral-600"}
            >
              {isRange
                ? `${format(pricing.min_price)} - ${format(max as number)}`
                : format(pricing.min_price)}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
