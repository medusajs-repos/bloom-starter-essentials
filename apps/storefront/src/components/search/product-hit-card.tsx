import { Thumbnail } from "@/components/ui/thumbnail"
import { formatPrice } from "@/lib/utils/price"
import { Link } from "@tanstack/react-router"
import type { Hit as HitType } from "instantsearch.js"

export type ProductGridHit = HitType<{
  title: string | null
  handle: string | null
  thumbnail: string | null
  currency_code?: string
  min_price?: number
  original_price?: number
  on_sale?: boolean
}>

type ProductHitCardProps = {
  hit: ProductGridHit
  countryCode: string
}

export const ProductHitCard = ({ hit, countryCode }: ProductHitCardProps) => {
  // Without a handle there is no product page to link to.
  if (!hit.handle) {
    return null
  }

  const title = hit.title ?? ""
  const currency = hit.currency_code || "usd"
  const hasPrice = typeof hit.min_price === "number"
  const isDiscounted =
    hit.on_sale === true &&
    typeof hit.original_price === "number" &&
    typeof hit.min_price === "number" &&
    hit.original_price > hit.min_price

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

        {hasPrice && (
          <span className="ml-2 flex items-center gap-x-2 whitespace-nowrap font-normal">
            {isDiscounted && (
              <span className="text-neutral-400 line-through">
                {formatPrice({
                  amount: hit.original_price as number,
                  currency_code: currency,
                })}
              </span>
            )}
            <span className={isDiscounted ? "text-red-600" : "text-neutral-600"}>
              {formatPrice({
                amount: hit.min_price as number,
                currency_code: currency,
              })}
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
