import { Query } from "@tanstack/react-query"

const createDomainKeys = (domain: string) => ({
  all: [domain] as const,
  list: (...params: unknown[]) => [domain, "list", ...params] as const,
  detail: (id: string, ...params: unknown[]) => [domain, "detail", id, ...params] as const,
  predicate: <TData = unknown, TError = Error>(
    query: Query<TData, TError, TData, readonly unknown[]>,
    excludeKeys?: string[],
  ): boolean => {
    let hasExcludedKeys = false
    if (excludeKeys) {
      hasExcludedKeys = excludeKeys.some(key => query.queryKey?.includes(key))
    }
    return !hasExcludedKeys && query.queryKey?.includes(domain)
  },
})

const createDynamicKey = (domain: string, key: string, ...params: unknown[]) =>
  [domain, key, ...params] as const

export const queryKeys = {
  cart: {
    ...createDomainKeys("cart"),
    current: (fields?: string) => [...queryKeys.cart.all, fields] as const,
  },

  customer: {
    ...createDomainKeys("customer"),
    current: () => [...queryKeys.customer.all] as const,
    orders: () => createDynamicKey("customer", "orders"),
  },

  products: {
    ...createDomainKeys("products"),
    related: (productId: string, regionId?: string) =>
      createDynamicKey("products", "related", productId, regionId),
    latest: (limit?: number, regionId?: string) =>
      createDynamicKey("products", "latest", limit, regionId),
  },

  orders: {
    ...createDomainKeys("orders"),
  },

  regions: {
    ...createDomainKeys("regions"),
  },

  categories: {
    ...createDomainKeys("categories"),
  },

  collections: {
    ...createDomainKeys("collections"),
  },

  payments: {
    ...createDomainKeys("payments"),
    forCart: (cartId: string) => createDynamicKey("payments", "forCart", cartId),
    sessions: (regionId?: string) => createDynamicKey("payments", "sessions", regionId),
    session: (sessionId: string) =>
      createDynamicKey("payments", "session", sessionId),
  },

  shipping: {
    ...createDomainKeys("shipping"),
    forCart: (cartId: string) => createDynamicKey("shipping", "forCart", cartId),
    options: (cartId: string, regionId?: string) =>
      createDynamicKey("shipping", "options", cartId, regionId),
  },
} as const

export type QueryKeys = typeof queryKeys
