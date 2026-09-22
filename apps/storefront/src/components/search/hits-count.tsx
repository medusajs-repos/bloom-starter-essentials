import { useSearchSettled } from "@/lib/hooks/use-search-settled"
import { useInstantSearch, useStats } from "react-instantsearch"

export const HitsCount = () => {
  const { nbHits } = useStats()
  const { results } = useInstantSearch()
  const { isSettled } = useSearchSettled()

  if (!isSettled) {
    return <span className="text-sm text-neutral-600">&nbsp;</span>
  }

  const isExact = results?.exhaustiveNbHits !== false

  return (
    <span className="text-sm text-neutral-600" data-testid="hits-count">
      {isExact ? "" : "about "}
      {nbHits} {nbHits === 1 ? "product" : "products"}
    </span>
  )
}
