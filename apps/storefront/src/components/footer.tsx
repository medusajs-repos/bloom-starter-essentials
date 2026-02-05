import CountrySelect from "@/components/country-select"
import { useCategories } from "@/lib/hooks/use-categories"
import { useRegions } from "@/lib/hooks/use-regions"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { Link, useLocation } from "@tanstack/react-router"

const Footer = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const { data: categories } = useCategories({
    fields: "name,handle",
    queryParams: {
      parent_category_id: "null",
      limit: 5,
    },
  })

  const { data: regions } = useRegions({
    fields: "id, currency_code, *countries",
  })

  return (
    <footer
      className="bg-neutral-900 text-neutral-50 w-full"
      data-testid="footer"
    >
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-y-6">
            <Link
              to={baseHref || "/"}
              className="text-2xl font-display font-semibold hover:text-neutral-300 transition-colors w-fit uppercase tracking-tight"
            >
              Essentials
            </Link>
            <p className="text-neutral-400 max-w-sm text-sm leading-relaxed">
              Premium athleisure designed for movement. Thoughtfully crafted essentials
              that move seamlessly from studio to street.
            </p>
            <div>
              <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wide">
                Region
              </p>
              <CountrySelect regions={regions ?? []} />
            </div>
          </div>

          {/* Shop Column */}
          {categories && categories.length > 0 && (
            <FooterColumn
              title="Shop"
              links={[
                {
                  name: "All Products",
                  url: `${baseHref}/store`,
                  isExternal: false,
                },
                ...categories.map((category) => ({
                  name: category.name,
                  url: `${baseHref}/categories/${category.handle}`,
                  isExternal: false,
                })),
              ]}
            />
          )}

          {/* About Column */}
          <FooterColumn
            title="About"
            links={[
              {
                name: "Our Story",
                url: `${baseHref}/about`,
                isExternal: false,
              },
              {
                name: "FAQ",
                url: `${baseHref}/faq`,
                isExternal: false,
              },
              {
                name: "Payments",
                url: `${baseHref}/payments`,
                isExternal: false,
              },
              {
                name: "Shipping",
                url: `${baseHref}/shipping`,
                isExternal: false,
              },
              {
                name: "Returns",
                url: `${baseHref}/returns`,
                isExternal: false,
              },
              {
                name: "Contact",
                url: `${baseHref}/contact`,
                isExternal: false,
              },
            ]}
          />

          {/* Support Column */}
          <div className="flex flex-col gap-y-6">
            <h3 className="text-neutral-50 text-xs font-semibold uppercase tracking-wider">
              Support
            </h3>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wide">
                Customer Care
              </p>
              <p className="text-sm text-neutral-300 mt-2">
                hello@essentials.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Combined */}
        <div className="border-t border-neutral-800 py-8">
          <div className="flex flex-col gap-6">
            {/* Top row: Copyright, Social icons, Payment methods */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <span className="text-xs text-neutral-500">
                © {new Date().getFullYear()} Essentials. All rights reserved.
              </span>

              {/* Social Media Icons */}
              <div className="flex items-center gap-5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-neutral-300 transition-colors"
                  aria-label="Twitter/X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>

              {/* Payment Methods */}
              <div className="flex items-center gap-3" suppressHydrationWarning>
                <img 
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/visa-01KGM4VCEN4S70B20CHKYRKYHD.svg" 
                  alt="Visa" 
                  className="h-7 w-auto object-contain"
                  suppressHydrationWarning
                />
                <img 
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/mastercard-01KGM4VC6Q7D8S2A8GGBZZ9WH2.svg" 
                  alt="Mastercard" 
                  className="h-7 w-auto object-contain"
                  suppressHydrationWarning
                />
                <img 
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/paypal-01KGM4VBX940SCWM1DAE1SPAQH.svg" 
                  alt="PayPal" 
                  className="h-7 w-auto object-contain"
                  suppressHydrationWarning
                />
                <img 
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/klarna-01KGM4VBN2SGCV6FSX1MBC5GQJ.svg" 
                  alt="Klarna" 
                  className="h-7 w-auto object-contain"
                  suppressHydrationWarning
                />
              </div>
            </div>

            {/* Bottom row: Links */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs">
              <a
                href={`${baseHref}/privacy`}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href={`${baseHref}/terms`}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterColumn = ({
  title,
  links,
}: {
  title: string
  links: {
    name: string
    url: string
    isExternal: boolean
  }[]
}) => {
  return (
    <div className="flex flex-col gap-y-6">
      <h3 className="text-neutral-50 text-xs font-semibold uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.url} className="text-sm">
            {link.isExternal ? (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                to={link.url}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Footer
