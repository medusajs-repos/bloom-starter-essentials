/**
 * URL query key used for global product-option value filtering.
 *
 * Introduced with Medusa 2.16 global product options: a product list
 * may be filtered by one or more option value IDs (e.g. "Size: M").
 */
export const OPTION_VALUE_QUERY_KEY = "optionValueIds"

type ParseInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>
  | string
  | string[]
  | undefined
  | null

/**
 * Parses option value IDs from a variety of inputs:
 * - URLSearchParams (browser / Request URL)
 * - server search params object (Record<string, string | string[]>)
 * - a comma-separated string (fallback)
 * - an array of strings
 *
 * Always returns a deduped array.
 */
export const parseOptionValueIds = (input: ParseInput): string[] => {
  if (!input) {
    return []
  }

  let raw: string[] = []

  if (input instanceof URLSearchParams) {
    raw = input.getAll(OPTION_VALUE_QUERY_KEY)
    // fallback: comma-separated single value
    if (raw.length === 1 && raw[0].includes(",")) {
      raw = raw[0].split(",")
    }
  } else if (Array.isArray(input)) {
    raw = input
  } else if (typeof input === "string") {
    raw = input.split(",")
  } else if (typeof input === "object") {
    const value = input[OPTION_VALUE_QUERY_KEY]
    if (Array.isArray(value)) {
      raw = value
    } else if (typeof value === "string") {
      raw = value.includes(",") ? value.split(",") : [value]
    }
  }

  const deduped = Array.from(
    new Set(raw.map((v) => v.trim()).filter((v) => v.length > 0))
  )

  return deduped
}
