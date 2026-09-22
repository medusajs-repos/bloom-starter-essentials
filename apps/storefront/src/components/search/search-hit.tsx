import { Thumbnail } from "@/components/ui/thumbnail"
import { Link } from "@tanstack/react-router"
import type { Hit as HitType } from "instantsearch.js"

export type ProductHit = HitType<{
  title: string | null
  handle: string | null
  thumbnail: string | null
}>

type SearchHitProps = {
  hit: ProductHit
  countryCode: string
  onNavigate: () => void
}

export const SearchHit = ({ hit, countryCode, onNavigate }: SearchHitProps) => {
  if (!hit.handle) {
    return null
  }

  return (
    <li>
      <Link
        to="/$countryCode/products/$handle"
        params={{ countryCode, handle: hit.handle }}
        onClick={onNavigate}
        className="flex items-center gap-x-4 px-6 py-3 hover:bg-neutral-50 transition-colors"
        data-testid="search-hit-link"
      >
        <Thumbnail
          thumbnail={hit.thumbnail}
          alt={hit.title ?? ""}
          className="w-14 h-16 flex-shrink-0"
        />
        <span className="text-sm font-medium text-neutral-900 line-clamp-2">
          {hit.title}
        </span>
      </Link>
    </li>
  )
}
