import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { queryKeys } from "@/lib/utils/query-keys"
import { sdk } from "@/lib/utils/sdk"
import { getStoredCart, removeStoredCart } from "@/lib/utils/cart"

const DEFAULT_CART_FIELDS = "+items.total, shipping_methods.name"

// ============ ADDRESSES ============

export const useSetCartAddresses = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const cartId = getStoredCart()
      if (!cartId) throw new Error("No cart found")

      const data = Object.fromEntries(formData.entries())

      const shippingAddress = {
        first_name: data["shipping_address.first_name"] as string,
        last_name: data["shipping_address.last_name"] as string,
        address_1: data["shipping_address.address_1"] as string,
        address_2: (data["shipping_address.address_2"] as string) || "",
        company: (data["shipping_address.company"] as string) || "",
        postal_code: data["shipping_address.postal_code"] as string,
        city: data["shipping_address.city"] as string,
        country_code: data["shipping_address.country_code"] as string,
        province: (data["shipping_address.province"] as string) || "",
        phone: (data["shipping_address.phone"] as string) || "",
      }

      const billingAddress = {
        first_name: data["billing_address.first_name"] as string,
        last_name: data["billing_address.last_name"] as string,
        address_1: data["billing_address.address_1"] as string,
        address_2: (data["billing_address.address_2"] as string) || "",
        company: (data["billing_address.company"] as string) || "",
        postal_code: data["billing_address.postal_code"] as string,
        city: data["billing_address.city"] as string,
        country_code: data["billing_address.country_code"] as string,
        province: (data["billing_address.province"] as string) || "",
        phone: (data["billing_address.phone"] as string) || "",
      }

      const email = data.email as string

      const { cart } = await sdk.store.cart.update(cartId, {
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        email,
      }, { fields: DEFAULT_CART_FIELDS })

      return cart
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}

// ============ SHIPPING ============

export const useShippingOptions = ({ cart_id }: { cart_id?: string } = {}) => {
  return useQuery({
    queryKey: queryKeys.shipping.options(cart_id || ""),
    queryFn: async () => {
      const cartId = cart_id || getStoredCart()
      if (!cartId) throw new Error("No cart found")
      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: cartId,
      })
      return shipping_options
    },
    enabled: !!cart_id || !!getStoredCart(),
    staleTime: 0
  })
}

export const useSetCartShippingMethod = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      shipping_option_id,
      data,
    }: {
      shipping_option_id: string;
      data?: Record<string, unknown>;
    }) => {
      const cartId = getStoredCart()
      if (!cartId) throw new Error("No cart found")
      const { cart } = await sdk.store.cart.addShippingMethod(
        cartId,
        { option_id: shipping_option_id, data }
      )
      return cart
    },
    onSuccess: async (cart) => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
      queryClient.invalidateQueries({ queryKey: queryKeys.shipping.options(cart.id) })
    },
  })
}

// ============ PAYMENT ============

export const useCartPaymentMethods = ({
  region_id,
  fields,
}: {
  region_id?: string;
  fields?: string;
} = {}) => {
  return useQuery({
    queryKey: queryKeys.payments.sessions(region_id),
    queryFn: async () => {
      const { payment_providers } = await sdk.store.payment.listPaymentProviders({
        region_id: region_id!,
        fields
      })
      return payment_providers
    },
    enabled: !!region_id,
    staleTime: 0,
  })
}

export const useInitiateCartPaymentSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      provider_id,
      data,
    }: {
      provider_id: string;
      data?: Record<string, any>;
    }) => {
      const cartId = getStoredCart()
      if (!cartId) throw new Error("No cart found")

      const { cart } = await sdk.store.cart.retrieve(cartId, {
        fields: DEFAULT_CART_FIELDS,
      })
      if (!cart) throw new Error("Cart not found")

      const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
        cart,
        { provider_id, data }
      )
      return payment_collection
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
    },
  })
}

// ============ COMPLETE ORDER ============

export const useCompleteCartOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const cartId = getStoredCart()
      if (!cartId) throw new Error("No cart found")

      const cartRes = await sdk.store.cart.complete(cartId, {})

      if (cartRes.type !== "order") {
        throw new Error("Order creation failed")
      }

      removeStoredCart()
      return cartRes.order
    },
    onSuccess: async (order) => {
      // Immediately set cart data to null to clear the UI
      queryClient.setQueriesData({
        predicate: queryKeys.cart.predicate,
      }, null)

      // Clear payment methods cache
      queryClient.removeQueries({ predicate: queryKeys.payments.predicate })

      // Clear shipping options cache
      queryClient.removeQueries({ predicate: queryKeys.shipping.predicate })

      // Invalidate cart queries to trigger a fresh fetch with no cart ID
      queryClient.invalidateQueries({ predicate: queryKeys.cart.predicate })
      await queryClient.refetchQueries({ predicate: queryKeys.cart.predicate })

      return order
    },
  })
}
