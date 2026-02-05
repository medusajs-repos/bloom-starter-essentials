import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$countryCode/account")({
  component: AccountLayout,
})

function AccountLayout() {
  return <Outlet />
}
