import { useInstantSearch } from "react-instantsearch"

export const useSearchSettled = () => {
  const { status, results } = useInstantSearch()

  const isSearching = status !== "idle" && status !== "error"
  const hasNoResultsYet = Boolean(
    (results as unknown as { __isArtificial?: boolean } | undefined)
      ?.__isArtificial
  )

  return {
    isSearching,
    hasNoResultsYet,
    isSettled: !isSearching && !hasNoResultsYet,
    resultsQuery: (results?.query ?? "").trim(),
  }
}

export default useSearchSettled
