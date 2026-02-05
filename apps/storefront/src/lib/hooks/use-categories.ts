import { useQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/utils/query-keys"
import { sdk } from "@/lib/utils/sdk"

export const useCategories = ({
  fields,
  queryParams,
  enabled = true,
}: {
  fields?: string;
  queryParams?: HttpTypes.StoreProductCategoryListParams;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.categories.list(fields, queryParams),
    queryFn: async () => {
      const { product_categories } = await sdk.store.category.list({
        fields,
        ...queryParams,
      })
      return product_categories
    },
    enabled,
  })
}
