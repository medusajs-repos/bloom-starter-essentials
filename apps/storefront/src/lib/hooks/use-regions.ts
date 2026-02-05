import { useQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/utils/query-keys"
import { sdk } from "@/lib/utils/sdk"

export const useRegions = ({ fields }: { fields?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.regions.list(),
    queryFn: async () => {
      const { regions } = await sdk.store.region.list({ fields })
      return regions
    },
  })
}

export const useRegion = ({
  country_code,
  fields,
}: {
  country_code: string;
  fields?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.regions.detail(country_code),
    queryFn: async () => {
      const { regions } = await sdk.store.region.list({ fields })
      return regions.find(region =>
        region.countries?.some(country => country.iso_2 === country_code.toLowerCase())
      ) || null
    },
  })
}
