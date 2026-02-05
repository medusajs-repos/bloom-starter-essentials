import { HttpTypes } from "@medusajs/types"

// ============ VARIANT OPTIONS KEYMAP ============

export default function getVariantOptionsKeymap(
  variantOptions: HttpTypes.StoreProductVariant["options"]
): Record<string, string> | undefined {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

// Also export as named export for flexibility
export { getVariantOptionsKeymap }

// ============ VARIANT IN STOCK ============

export function isVariantInStock(variant: HttpTypes.StoreProductVariant): boolean {
  return !variant.manage_inventory || variant.allow_backorder || (
    variant.manage_inventory === true &&
    (variant.inventory_quantity || 0) > 0
  )
}

// ============ SORT PRODUCTS TYPE ============

export type ProductSortOptions =
  | "price_asc"
  | "price_desc"
  | "created_at";
