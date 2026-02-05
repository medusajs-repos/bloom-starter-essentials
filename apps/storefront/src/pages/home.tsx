import { useLocation, useLoaderData, Link } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useProducts } from "@/lib/hooks/use-products"
import { useCollections } from "@/lib/hooks/use-collections"
import { ProductGrid } from "@/components/sections/product-grid"
import { LifestyleEditorial } from "@/components/sections/lifestyle-editorial"
import { CollectionShowcase } from "@/components/sections/collection-showcase"
import { Newsletter } from "@/components/sections/newsletter"
import { VideoTestimonials } from "@/components/sections/video-testimonials"
import { ArrowRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

/**
 * Home Page - Premium Athleisure Storefront
 *
 * Features:
 * - Hero banner with CTA
 * - Featured collections
 * - Bestseller products with Quick Buy
 * - Lifestyle editorial section
 * - Promo campaign banner
 * - Newsletter signup
 */
const Home = () => {
  const location = useLocation()
  const { region } = useLoaderData({ from: "/$countryCode/" })
  const countryCode = getCountryCodeFromPath(location.pathname) || "us"

  // Fetch featured products (showing first 8 products as bestsellers)
  const { data: productsData } = useProducts({
    region_id: region?.id,
    query_params: { 
      limit: 8,
      fields: "id,title,handle,thumbnail,*images,*variants,*variants.calculated_price",
    },
  })

  // Fetch collections for showcase
  const { data: collections } = useCollections({
    fields: "id,title,handle",
  })

  const collectionsWithImages = collections
    ? [
        {
          id: collections[0]?.id || "",
          title: collections[0]?.title || "",
          handle: collections[0]?.handle || "",
          imageUrl: "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/NanoBanana-2026-02-04-01KGMCGE8HA4MP3JQAJ1PAEGGX.png",
        },
        {
          id: collections[1]?.id || "",
          title: collections[1]?.title || "",
          handle: collections[1]?.handle || "",
          imageUrl: "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/NanoBanana-2026-02-04-1--01KGMCJ09NGECFMM8QVAY13MY3.png",
        },
        {
          id: collections.find((c: HttpTypes.StoreCollection) => c.handle === "outer-layers")?.id || collections[2]?.id || "",
          title: collections.find((c: HttpTypes.StoreCollection) => c.handle === "outer-layers")?.title || collections[2]?.title || "",
          handle: "outer-layers",
          imageUrl: "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/Gro-nano_banana_pro_20260204_133831_1--01KGMCNPB3SC30ZKSH1ZPWX149.jpeg",
        },
      ]
    : []

  return (
    <div className="min-h-screen">
      {/* Sticky background video */}
      <div className="sticky top-0 w-full h-[100vh] overflow-hidden -z-10">
        <video
          src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/Bring_a_bit_202602041404_u6uf6-01KGMC3H3BPBGYA1KXAMFFT0AM.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
      </div>

      {/* Hero content that scrolls */}
      <div className="relative -mt-[100vh] pt-48 h-[100vh] flex items-center justify-center">
        <div className="content-container text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
            Movement, simplified.
          </h1>
          <p className="md:text-xl mb-8 max-w-2xl mx-auto text-white">
            Scandinavian-inspired athleisure designed for everyday balance.
          </p>
          <Link
            to="/$countryCode/collections/$handle"
            params={{ countryCode, handle: "core-essentials" }}
            className="inline-flex items-center gap-2 bg-neutral-900 text-neutral-50 px-8 py-4 hover:bg-neutral-800 transition-colors uppercase text-xs font-semibold tracking-wider"
          >
            Shop Core Essentials
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Content wrapper with background that slides over video */}
      <div className="relative z-20 bg-white">
        {/* Featured Products Grid */}
        {productsData && productsData.pages?.[0]?.products && (
          <ProductGrid
            title="Elevated essentials for everyday."
            description="Functional athleisure made of premium materials to improve your life in small but mighty ways."
            products={productsData.pages[0].products as { id: string; title: string; handle: string; thumbnail?: string; variants?: Array<{ id: string; calculated_price?: { calculated_amount: number; currency_code: string } }> }[]}
            countryCode={countryCode}
            showQuickBuy={true}
          />
        )}



      {/* Lifestyle Editorial */}
      <LifestyleEditorial
        title="Built for the in-between"
        description="Essentials is built for the in-between moments — the walk to the studio, the coffee after training, the quiet hours at home."
        ctaText="Our Story"
        ctaHref={`/${countryCode}/about`}
        imageUrl="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/nano_banana_pro_20260204_141238_1-01KGMCQQ1KXNTY3K55VA3T84KE.png"
      />

      {/* Collection Showcase */}
      {collectionsWithImages.length > 0 && (
        <CollectionShowcase collections={collectionsWithImages} countryCode={countryCode} />
      )}

        {/* Video & Testimonials */}
        <VideoTestimonials />

        {/* Newsletter Signup */}
        <Newsletter />
      </div>
    </div>
  )
}

export default Home
