import { routeTree } from "@/routeTree.gen"
import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { lazy } from "react"

const NotFound = lazy(() => import("@/components/not-found"))

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Optimize for SSR - shorter stale time for fresh data
        staleTime: 1000 * 60, // 1 minute
        // Enable refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Enable refetch on reconnect
        refetchOnReconnect: true,
        // Retry failed requests
        retry: 1,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: false, // SSR handles data fetching on the server
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

export function getRouter() {
  return createRouter()
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
