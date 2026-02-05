import ProductPrice from "@/components/product-price"
import { Thumbnail } from "@/components/ui/thumbnail"
import { getCountryCodeFromPath } from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { Link, useLocation } from "@tanstack/react-router"
import { useState } from "react"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  selectedColor?: string
}

const ProductCard = ({ product, variant, selectedColor }: ProductCardProps) => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""
  const [isHovered, setIsHovered] = useState(false)
  
  // If a specific variant is provided, use its images
  let primaryImage = product.thumbnail || product.images?.[0]?.url
  let hoverImage = product.images?.[1]?.url

  if (variant) {
    // First priority: Use variant-linked images if available
    if (variant.images && variant.images.length > 0) {
      primaryImage = variant.images[0].url
      hoverImage = variant.images[1]?.url || variant.images[0].url
    } 
    // Second priority: Use variant thumbnail
    else if (variant.thumbnail) {
      primaryImage = variant.thumbnail
    }
    // Third priority: Match by color using image index mapping
    else {
      // Get color from variant options
      const colorOption = variant.options?.find((opt) => {
        const optionTitle = opt.option?.title?.toLowerCase() || ""
        return optionTitle === "color" || optionTitle === "colour"
      })
      
      const variantColor = colorOption?.value
      
      // Map colors to their starting image indices per product
      if (variantColor && product.images) {
        const productColorMaps: Record<string, Record<string, number>> = {
          "Crewneck Sweatshirt": {
            "Sand": 0,
            "Charcoal": 3,
            "Olive": 6,
          },
          "Ribbed Long Sleeve Top": {
            "Sand": 0,
            "Charcoal": 3,
          },
          "Minimal Tee": {
            "White": 0,
            "Olive": 3,
            "Black": 6,
          },
          "Lightweight Training Short": {
            "Black": 0,
            "Grey": 3,
          },
          "Ribbed Sports Bra": {
            "Sand": 0,
            "Olive": 3,
          },
          "Performance Legging": {
            "Charcoal": 0,
            "Olive": 3,
          },
          "Studio Zip Jacket": {
            "Black": 0,
            "Olive": 3,
          },
          "Movement Windbreaker": {
            "Sand": 0,
            "Olive": 3,
          },
        }
        
        const colorImageMap = productColorMaps[product.title] || {}
        
        const startIndex = colorImageMap[variantColor]
        if (startIndex !== undefined && product.images[startIndex]) {
          primaryImage = product.images[startIndex].url
          hoverImage = product.images[startIndex + 1]?.url || product.images[startIndex].url
        }
      }
    }
  } else if (selectedColor && product.images) {
    // Legacy: If a color is selected, try to find images with matching color metadata
    const colorImages = product.images.filter((img) => {
      const metadata = img.metadata as Record<string, string> | undefined
      const imgColor = metadata?.color?.toLowerCase()
      const selColor = selectedColor.toLowerCase()
      return imgColor === selColor || imgColor?.includes(selColor) || selColor.includes(imgColor || "")
    })
    
    if (colorImages.length > 0) {
      primaryImage = colorImages[0].url
      hoverImage = colorImages[1]?.url || colorImages[0].url
    }
  }

  return (
    <Link
      to="/$countryCode/products/$handle"
      params={{ countryCode: countryCode || "us", handle: product.handle || "" }}
      className="group flex flex-col w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square w-full overflow-hidden bg-[#F5F3F0] relative">
        <Thumbnail
          thumbnail={primaryImage}
          alt={product.title}
          className={`absolute inset-0 object-cover object-center w-full h-full transition-opacity duration-300 ${isHovered && hoverImage ? "opacity-0" : "opacity-100"}`}
        />
        {hoverImage && (
          <Thumbnail
            thumbnail={hoverImage}
            alt={`${product.title} - Detail view`}
            className={`absolute inset-0 object-cover object-center w-full h-full transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>

      <div className="flex text-sm mt-3 justify-between items-start">
        <span className="text-neutral-800 font-normal tracking-wide">{product.title}</span>
        <ProductPrice
          product={product}
          variant={product.variants?.[0]}
          className="text-neutral-600 font-normal ml-2 whitespace-nowrap"
        />
      </div>
    </Link>
  )
}

export default ProductCard
