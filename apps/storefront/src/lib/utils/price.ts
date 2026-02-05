import { isEmpty } from "@/lib/utils/validation"
import { HttpTypes } from "@medusajs/types"

// ============ FORMAT PRICE ============

type FormatPriceParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const formatPrice = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: FormatPriceParams): string => {
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency_code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount)
    : amount.toString()
}

// ============ PERCENTAGE DIFF ============

export const getPricePercentageDiff = (original: number, calculated: number): string => {
  const diff = original - calculated
  const decrease = (diff / original) * 100

  return decrease.toFixed()
}

// ============ PRODUCT PRICE ============

type VariantWithCalculatedPrice = HttpTypes.StoreProductVariant & {
  calculated_price?: {
    calculated_amount: number
    original_amount: number
    currency_code: string
    calculated_price?: {
      price_list_type: string
    }
  }
}

export const getPricesForVariant = (variant: VariantWithCalculatedPrice | null | undefined): {
  calculated_price_number: number;
  calculated_price: string;
  original_price_number: number;
  original_price: string;
  currency_code: string;
  price_type: string;
  percentage_diff: string;
} | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: formatPrice({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: formatPrice({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price?.price_list_type ?? "default",
    percentage_diff: getPricePercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variant_id,
}: {
  product: HttpTypes.StoreProduct
  variant_id?: string
}): {
  product: HttpTypes.StoreProduct;
  cheapestPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
  variantPrice: {
    calculated_price_number: number;
    calculated_price: string;
    original_price_number: number;
    original_price: string;
    currency_code: string;
    price_type: string;
    percentage_diff: string;
  } | null;
} {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const variantsWithPrice = product.variants as VariantWithCalculatedPrice[]
    const cheapestVariant = variantsWithPrice
      .filter((v) => !!v.calculated_price)
      .sort((a, b) => {
        return (
          (a.calculated_price?.calculated_amount ?? 0) -
          (b.calculated_price?.calculated_amount ?? 0)
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variant_id) {
      return null
    }

    const variant = product.variants?.find(
      (v) => v.id === variant_id || v.sku === variant_id
    ) as VariantWithCalculatedPrice | undefined

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
  }
}

// ============ PRICE FILTER OPTIONS ============

/**
 * Generate price filter options based on currency code
 * Adjusts ranges to be appropriate for the currency
 */
export const getPriceFilterOptions = (currency_code: string) => {
  const currencyUpper = currency_code.toUpperCase()
  const symbol = formatPrice({ amount: 0, currency_code }).replace(/[\d.,]/g, "").trim()

  // Define ranges based on currency
  // EUR and USD have similar value ranges
  if (currencyUpper === "EUR" || currencyUpper === "USD") {
    return [
      { id: "0-50", label: `Under ${symbol}50`, min: 0, max: 50 },
      { id: "50-100", label: `${symbol}50 - ${symbol}100`, min: 50, max: 100 },
      { id: "100-150", label: `${symbol}100 - ${symbol}150`, min: 100, max: 150 },
      { id: "150-plus", label: `${symbol}150+`, min: 150, max: Infinity },
    ]
  }
  
  // GBP - slightly adjust ranges
  if (currencyUpper === "GBP") {
    return [
      { id: "0-40", label: `Under ${symbol}40`, min: 0, max: 40 },
      { id: "40-80", label: `${symbol}40 - ${symbol}80`, min: 40, max: 80 },
      { id: "80-120", label: `${symbol}80 - ${symbol}120`, min: 80, max: 120 },
      { id: "120-plus", label: `${symbol}120+`, min: 120, max: Infinity },
    ]
  }

  // DKK - Danish Krone has higher numerical values
  if (currencyUpper === "DKK") {
    return [
      { id: "0-350", label: `Under ${symbol}350`, min: 0, max: 350 },
      { id: "350-700", label: `${symbol}350 - ${symbol}700`, min: 350, max: 700 },
      { id: "700-1050", label: `${symbol}700 - ${symbol}1050`, min: 700, max: 1050 },
      { id: "1050-plus", label: `${symbol}1050+`, min: 1050, max: Infinity },
    ]
  }

  // Default fallback (same as USD/EUR)
  return [
    { id: "0-50", label: `Under ${symbol}50`, min: 0, max: 50 },
    { id: "50-100", label: `${symbol}50 - ${symbol}100`, min: 50, max: 100 },
    { id: "100-150", label: `${symbol}100 - ${symbol}150`, min: 100, max: 150 },
    { id: "150-plus", label: `${symbol}150+`, min: 150, max: Infinity },
  ]
}
