import { useQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/utils/query-keys"
import { sdk } from "@/lib/utils/sdk"

export const useCollections = ({
  fields,
  queryParams,
  enabled = true,
}: {
  fields?: string;
  queryParams?: HttpTypes.StoreCollectionListParams;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: queryKeys.collections.list(fields, queryParams),
    queryFn: async () => {
      const { collections } = await sdk.store.collection.list({
        fields,
        ...queryParams,
      })
      return collections
    },
    enabled,
  })
}
