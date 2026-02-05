import { sdk } from "@/lib/utils/sdk"
import { HttpTypes } from "@medusajs/types"

export const listCategories = async (options?: {
  fields?: string;
  queryParams?: HttpTypes.StoreProductCategoryListParams;
}): Promise<HttpTypes.StoreProductCategory[]> => {
  const { product_categories } = await sdk.store.category.list({
    fields: options?.fields,
    ...options?.queryParams,
  })

  return product_categories
}

export const retrieveCategory = async ({
  handle,
  fields,
}: {
  handle: string;
  fields?: string;
}): Promise<HttpTypes.StoreProductCategory | null> => {
  const product_categories = await listCategories({
    queryParams: {
      handle,
      fields: fields || "*category_children"
    },
  })

  if (!product_categories.length) {
    throw new Error(`Category with handle ${handle} not found`)
  }

  return product_categories[0]
}