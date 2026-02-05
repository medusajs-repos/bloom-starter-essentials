import { useQuery } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"

export const useCustomerOrders = () => {
  return useQuery({
    queryKey: ["customer", "orders"],
    queryFn: async () => {
      const { orders } = await sdk.store.order.list()
      return orders
    },
    retry: false,
  })
}
