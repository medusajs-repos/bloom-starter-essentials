import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/utils/sdk"

export const listCustomerOrders = async ({
  fields,
}: {
  fields?: string;
}): Promise<HttpTypes.StoreOrder[]> => {
  const { orders } = await sdk.store.order.list({ fields })
  return orders
}

export const retrieveOrder = async ({
  order_id,
  fields,
}: {
  order_id: string;
  fields?: string;
}): Promise<HttpTypes.StoreOrder | null> => {
  const { order } = await sdk.store.order.retrieve(order_id, { fields })
  return order
}