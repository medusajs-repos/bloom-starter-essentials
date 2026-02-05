import { useCustomer, useLogout } from "@/lib/hooks/use-customer"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "@tanstack/react-router"
import { User } from "@medusajs/icons"

export const AccountDropdown = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const { data: customer } = useCustomer()
  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        window.location.href = countryCode ? `/${countryCode}` : "/"
      }
    })
  }

  return (
    <NavigationMenu.Root className="hidden lg:flex relative">
      <NavigationMenu.List>
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger className="flex items-center justify-center text-neutral-700 hover:text-neutral-900 transition-colors">
            <User className="w-5 h-5" />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg rounded-md min-w-[200px] z-50 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight">
            {customer ? (
              <div className="flex flex-col py-2">
                <div className="px-6 py-3 text-xs text-neutral-500 border-b border-neutral-200">
                  {customer.email}
                </div>
                <NavigationMenu.Link asChild>
                  <Link
                    to="/$countryCode/account"
                    params={{ countryCode: countryCode || "us" }}
                    className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors"
                  >
                    My Account
                  </Link>
                </NavigationMenu.Link>
                <NavigationMenu.Link asChild>
                  <Link
                    to="/$countryCode/account/orders"
                    params={{ countryCode: countryCode || "us" }}
                    className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors"
                  >
                    My Orders
                  </Link>
                </NavigationMenu.Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col py-2">
                <NavigationMenu.Link asChild>
                  <Link
                    to="/$countryCode/account"
                    params={{ countryCode: countryCode || "us" }}
                    className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors"
                  >
                    Login
                  </Link>
                </NavigationMenu.Link>
              </div>
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
