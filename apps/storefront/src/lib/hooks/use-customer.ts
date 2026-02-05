import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/lib/utils/sdk"
import { queryKeys } from "@/lib/utils/query-keys"

export function useCustomer() {
  return useQuery({
    queryKey: queryKeys.customer.current(),
    queryFn: async () => {
      try {
        const token = localStorage.getItem("medusa_auth_token")

        if (!token) {
          return null
        }

        const { customer } = await sdk.store.customer.retrieve()
        return customer
      } catch {
        return null
      }
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) => {
      const token = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      })

      // Small delay to ensure SDK has stored the token
      await new Promise(resolve => setTimeout(resolve, 100))

      const { customer } = await sdk.store.customer.retrieve(
        {},
        {
          Authorization: `Bearer ${token}`
        }
      )
      return customer
    },
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.current(), customer)
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      email,
      password,
      first_name,
      last_name,
    }: {
      email: string
      password: string
      first_name?: string
      last_name?: string
    }) => {
      let token: string
      try {
        token = await sdk.auth.register("customer", "emailpass", {
          email,
          password,
        })
      } catch (error: unknown) {
        const err = error as { statusText?: string; message?: string }
        if (
          err.statusText === "Unauthorized" &&
          err.message?.includes("already exists")
        ) {
          throw new Error(
            "An account with this email already exists. Please login instead."
          )
        }
        throw error
      }

      const { customer } = await sdk.store.customer.create(
        {
          email,
          first_name,
          last_name,
        },
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      )

      await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      })

      const cartId = localStorage.getItem("medusa_cart_id")
      if (cartId) {
        try {
          await sdk.store.cart.update(cartId, {
            email: customer.email
          })
        } catch {
          // Cart association failed silently
        }
      }

      return customer
    },
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customer.current(), customer)
      queryClient.invalidateQueries({ queryKey: ["customer", "orders"] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await sdk.auth.logout()
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.customer.current(), null)
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.orders() })
    },
  })
}
