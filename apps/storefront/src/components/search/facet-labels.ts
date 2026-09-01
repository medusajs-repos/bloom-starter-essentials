import { PRODUCT_FACETS } from "@/lib/search-client"

const FACET_TITLES: Record<string, string> = {
  [PRODUCT_FACETS.category]: "Category",
  [PRODUCT_FACETS.optionValues]: "Options",
  [PRODUCT_FACETS.onSale]: "On sale",
  [PRODUCT_FACETS.minPrice]: "Price",
}

export const splitOptionValue = (raw: string) => {
  const separator = raw.indexOf(":")

  if (separator === -1) {
    return { option: "Options", value: raw }
  }

  return { option: raw.slice(0, separator), value: raw.slice(separator + 1) }
}

export const facetTitle = (attribute: string, value?: string) => {
  if (attribute === PRODUCT_FACETS.optionValues && value) {
    return splitOptionValue(value).option
  }

  return FACET_TITLES[attribute] ?? attribute
}

export const facetValueLabel = (attribute: string, label: string) => {
  if (attribute === PRODUCT_FACETS.optionValues) {
    return splitOptionValue(label).value
  }

  return label
}
