import ProductActions from "@/components/product-actions"
import { ImageGalleryEnhanced } from "@/components/ui/image-gallery-enhanced"
import { ProductAccordions } from "@/components/product/product-accordions"
import { RelatedProducts } from "@/components/product/related-products"
import { useLoaderData, useLocation } from "@tanstack/react-router"
import { useProducts } from "@/lib/hooks/use-products"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { useState, useMemo, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { Share } from "@medusajs/icons"

/**
 * Enhanced Product Page
 *
 * Features:
 * - High-res image gallery with zoom
 * - Image rollover on thumbnails
 * - Variant selection (size, color swatches)
 * - Product information accordions
 * - Related products carousel
 * - Add to cart with Quick Buy option
 */
const ProductDetails = () => {
  const { product, region } = useLoaderData({
    from: "/$countryCode/products/$handle",
  })
  
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.StoreProductVariant | undefined>(undefined)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  
  const handleVariantChange = useCallback((variant: HttpTypes.StoreProductVariant | undefined) => {
    console.log("🔄 Variant changed:", variant?.title)
    setSelectedVariant(variant)
  }, [])

  const handleOptionsChange = useCallback((options: Record<string, string | undefined>) => {
    console.log("🎛️ Options changed:", options)
    // Filter out undefined values
    const definedOptions = Object.entries(options).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    setSelectedOptions(definedOptions)
  }, [])

  const handleShare = useCallback(() => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        // Fallback: create a temporary input to copy
        const input = document.createElement('input')
        input.value = url
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
  }, [])

  // Fetch related products (showing first 4 products as related)
  const { data: relatedProductsData } = useProducts({
    fields: "id,title,handle,thumbnail,calculated_price",
    queryParams: { limit: 5 },
    region_id: region.id,
  })

  // Filter out current product from related products
  const relatedProducts =
    relatedProductsData?.pages
      .flatMap((page) => page.products)
      .filter((p) => p.id !== product.id)
      .slice(0, 4) || []

  // Reorder images based on selected color option
  // Images linked to variants with the selected color appear first
  const displayImages = useMemo(() => {
    const allImages = product.images || []
    
    // Find the color option
    const colorOption = product.options?.find(
      (opt) => opt.title.toLowerCase() === 'color'
    )
    
    if (!colorOption) {
      return allImages
    }

    const selectedColorValue = selectedOptions[colorOption.id]
    
    if (!selectedColorValue) {
      return allImages
    }

    // Find variants that match the selected color
    const matchingVariants = product.variants?.filter((variant) => {
      return variant.options?.some(
        (opt) => opt.option_id === colorOption.id && opt.value === selectedColorValue
      )
    }) || []

    // Get all image IDs from matching variants
    const variantImageIds = new Set(
      matchingVariants.flatMap((v) => v.images?.map((img) => img.id) || [])
    )

    const variantImages = allImages.filter((img) => variantImageIds.has(img.id))
    const otherImages = allImages.filter((img) => !variantImageIds.has(img.id))

    return [...variantImages, ...otherImages]
  }, [product.images, product.options, product.variants, selectedOptions])

  return (
    <>
      <div className="content-container pt-32 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Image gallery with zoom */}
          <div>
            <ImageGalleryEnhanced images={displayImages} />
          </div>

          {/* Right: Product info + variant selection */}
          <div className="flex flex-col">
            <div className="sticky top-32 self-start w-full">
              {/* Product name - bigger at the top */}
              <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
                {product.title}
              </h1>

            {/* Variant selection & Add to Cart - contains price */}
            <div className="mb-8">
              <ProductActions 
                product={product} 
                region={region}
                onVariantChange={handleVariantChange}
                onOptionsChange={handleOptionsChange}
              />
            </div>

              {/* Description below the actions */}
              {product.description && (
                <div className="mb-8 pb-8 border-b border-neutral-200">
                  <p className="text-neutral-700 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Information Accordions */}
              <ProductAccordions />

              {/* Share Product */}
              <button
                onClick={handleShare}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                <Share className="w-4 h-4" />
                {copied ? "Link copied!" : "Share Product"}
              </button>
            </div>
          </div>
        </div>

        {/* Free Shipping & Returns Info Box */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-neutral-50 p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Free Shipping</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Enjoy free standard shipping on all orders. Your items will be carefully packaged and delivered to your doorstep at no extra cost.
            </p>
          </div>
          <div className="bg-neutral-50 p-8 rounded-lg">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Hassle-Free Returns</h3>
            <p className="text-sm text-neutral-700 leading-relaxed">
              Not completely satisfied? Return your unworn items within 30 days for a full refund. Free return shipping included.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} baseHref={baseHref} />
      )}
    </>
  )
}

export default ProductDetails
