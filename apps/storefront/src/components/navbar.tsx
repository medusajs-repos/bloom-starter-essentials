import { AccountDropdown } from "@/components/account-dropdown"
import { CartDropdown } from "@/components/cart"
import { PredictiveSearch } from "@/components/search/predictive-search"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useCategories } from "@/lib/hooks/use-categories"
import { useCollections } from "@/lib/hooks/use-collections"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "@tanstack/react-router"
import { EllipsisHorizontal, User } from "@medusajs/icons"
import { useState, useEffect } from "react"

export const Navbar = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const { data: topLevelCategories } = useCategories({
    fields: "id,name,handle,parent_category_id,category_children.*",
    queryParams: { parent_category_id: "null" },
  })

  const { data: collections } = useCollections({
    fields: "id,title,handle",
  })

  const topsCategory = topLevelCategories?.find((cat) => cat.handle === "tops")
  const bottomsCategory = topLevelCategories?.find((cat) => cat.handle === "bottoms")

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <>
      <div 
        className={`fixed top-0 inset-x-0 z-50 bg-neutral-50 isolate transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Announcement Bar */}
        <div className="bg-neutral-50 border-b border-neutral-200 py-2 text-center text-sm text-neutral-700">
          <p>Free shipping available on all orders</p>
        </div>
        <header className="relative h-20 mx-auto border-b border-neutral-200">
          <nav className="content-container flex items-center justify-between w-full h-full">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-x-12 h-full">
              {/* Logo */}
              <Link
                to={baseHref || "/"}
                className="text-xl font-display font-semibold hover:text-neutral-600 uppercase tracking-tight transition-colors"
              >
                Essentials
              </Link>

              {/* Desktop Navigation Links */}
              <NavigationMenu.Root className="hidden lg:flex items-center h-full relative">
                <NavigationMenu.List className="flex items-center gap-x-8 h-full">
                  {/* Tops dropdown */}
                  {topsCategory && (
                    <NavigationMenu.Item className="relative">
                      <NavigationMenu.Trigger className="text-neutral-700 hover:text-neutral-900 flex items-center gap-1 select-none transition-colors text-sm py-2 px-1 group">
                        Tops
                        <svg
                          className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="absolute left-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg rounded-md min-w-[200px] z-50 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight">
                        <div className="flex flex-col py-2">
                          <NavigationMenu.Link asChild>
                            <Link
                              to={`${baseHref}/categories/${topsCategory.handle}`}
                              className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm font-semibold transition-colors"
                            >
                              All Tops
                            </Link>
                          </NavigationMenu.Link>
                          {topsCategory.category_children?.map((subcategory) => (
                            <NavigationMenu.Link key={subcategory.id} asChild>
                              <Link
                                to={`${baseHref}/categories/${subcategory.handle}`}
                                className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </NavigationMenu.Link>
                          ))}
                        </div>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  )}

                  {/* Bottoms dropdown */}
                  {bottomsCategory && (
                    <NavigationMenu.Item className="relative">
                      <NavigationMenu.Trigger className="text-neutral-700 hover:text-neutral-900 flex items-center gap-1 select-none transition-colors text-sm py-2 px-1 group">
                        Bottoms
                        <svg
                          className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content className="absolute left-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg rounded-md min-w-[200px] z-50 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight">
                        <div className="flex flex-col py-2">
                          <NavigationMenu.Link asChild>
                            <Link
                              to={`${baseHref}/categories/${bottomsCategory.handle}`}
                              className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm font-semibold transition-colors"
                            >
                              All Bottoms
                            </Link>
                          </NavigationMenu.Link>
                          {bottomsCategory.category_children?.map((subcategory) => (
                            <NavigationMenu.Link key={subcategory.id} asChild>
                              <Link
                                to={`${baseHref}/categories/${subcategory.handle}`}
                                className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </NavigationMenu.Link>
                          ))}
                        </div>
                      </NavigationMenu.Content>
                    </NavigationMenu.Item>
                  )}

                  {/* Collections dropdown */}
                  <NavigationMenu.Item className="relative">
                    <NavigationMenu.Trigger className="text-neutral-700 hover:text-neutral-900 flex items-center gap-1 select-none transition-colors text-sm py-2 px-1 group">
                      Collections
                      <svg
                        className="w-3 h-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content className="absolute left-0 top-full mt-2 bg-white border border-neutral-200 shadow-lg rounded-md min-w-[200px] z-50 data-[motion=from-start]:animate-enterFromLeft data-[motion=from-end]:animate-enterFromRight data-[motion=to-start]:animate-exitToLeft data-[motion=to-end]:animate-exitToRight">
                      <div className="flex flex-col py-2">
                        <NavigationMenu.Link asChild>
                          <Link
                            to={`${baseHref}/store`}
                            className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm font-semibold transition-colors"
                          >
                            Shop All
                          </Link>
                        </NavigationMenu.Link>
                        {collections?.map((collection) => (
                          <NavigationMenu.Link key={collection.id} asChild>
                            <Link
                              to={`${baseHref}/collections/${collection.handle}`}
                              className="px-6 py-3 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-sm transition-colors"
                            >
                              {collection.title}
                            </Link>
                          </NavigationMenu.Link>
                        ))}
                      </div>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                  
                  <NavigationMenu.Item>
                    <NavigationMenu.Link asChild>
                      <a
                        href={`${baseHref}/about`}
                        className="text-neutral-700 hover:text-neutral-900 transition-colors text-sm py-2"
                      >
                        About
                      </a>
                    </NavigationMenu.Link>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu.Root>
            </div>

            {/* Right: Utility Icons */}
            <div className="flex items-center gap-x-6 h-full">
              {/* Search */}
              <PredictiveSearch />

              {/* Account */}
              <AccountDropdown />

              {/* Cart */}
              <CartDropdown />

              {/* Mobile Menu */}
              <Drawer>
                <DrawerTrigger className="lg:hidden text-neutral-700 hover:text-neutral-900">
                  <EllipsisHorizontal className="w-6 h-6" />
                </DrawerTrigger>
                <DrawerContent side="left">
                  <DrawerHeader>
                    <DrawerTitle className="uppercase font-display text-lg tracking-wide">Menu</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col py-4">
                    {/* Tops */}
                    {topsCategory && (
                      <>
                        <div className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide">
                          Tops
                        </div>
                        <div className="flex flex-col">
                          <DrawerClose asChild>
                            <Link
                              to={`${baseHref}/categories/${topsCategory.handle}`}
                              className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors font-semibold"
                            >
                              All Tops
                            </Link>
                          </DrawerClose>
                          {topsCategory.category_children?.map((subcategory) => (
                            <DrawerClose key={subcategory.id} asChild>
                              <Link
                                to={`${baseHref}/categories/${subcategory.handle}`}
                                className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Bottoms */}
                    {bottomsCategory && (
                      <>
                        <div className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide">
                          Bottoms
                        </div>
                        <div className="flex flex-col">
                          <DrawerClose asChild>
                            <Link
                              to={`${baseHref}/categories/${bottomsCategory.handle}`}
                              className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors font-semibold"
                            >
                              All Bottoms
                            </Link>
                          </DrawerClose>
                          {bottomsCategory.category_children?.map((subcategory) => (
                            <DrawerClose key={subcategory.id} asChild>
                              <Link
                                to={`${baseHref}/categories/${subcategory.handle}`}
                                className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors"
                              >
                                {subcategory.name}
                              </Link>
                            </DrawerClose>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Collections */}
                    <div className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide">
                      Collections
                    </div>
                    <div className="flex flex-col">
                      <DrawerClose asChild>
                        <Link
                          to={`${baseHref}/store`}
                          className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors font-semibold"
                        >
                          Shop All
                        </Link>
                      </DrawerClose>
                      {collections?.map((collection) => (
                        <DrawerClose key={collection.id} asChild>
                          <Link
                            to={`${baseHref}/collections/${collection.handle}`}
                            className="px-10 py-3 text-neutral-600 hover:bg-sand-50 transition-colors"
                          >
                            {collection.title}
                          </Link>
                        </DrawerClose>
                      ))}
                    </div>

                    {/* About */}
                    <DrawerClose asChild>
                      <a
                        href={`${baseHref}/about`}
                        className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide hover:bg-sand-50"
                      >
                        About
                      </a>
                    </DrawerClose>

                    {/* Account */}
                    <DrawerClose asChild>
                      <a
                        href={`${baseHref}/account`}
                        className="px-6 py-4 text-neutral-900 text-base font-semibold uppercase tracking-wide hover:bg-sand-50"
                      >
                        Account
                      </a>
                    </DrawerClose>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </nav>
        </header>
      </div>
    </>
  )
}
