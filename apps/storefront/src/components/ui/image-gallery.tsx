import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useState, useCallback, memo } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = memo(function ImageGallery({ images }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div className="flex items-start relative">
      <div className="flex-1 sm:mx-16 relative">
        <div className="relative aspect-[29/34] w-full overflow-hidden bg-zinc-50 p-0">
          <div 
            className="flex transition-transform duration-300 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => {
              const isFirstImage = index === 0
              const isCriticalImage = index <= 1
              
              return (
                <div
                  key={image.id}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  {!!image.url && (
                    <img
                      src={image.url}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt={isFirstImage ? "Main product image" : `Product image ${index + 1}`}
                      loading={isCriticalImage ? "eager" : "lazy"}
                      fetchPriority={isFirstImage ? "high" : undefined}
                      decoding="async"
                    />
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hover:bg-transparent active:bg-transparent cursor-pointer"
                aria-label="Previous image"
                variant="transparent"
                size="fit"
              >
                <ChevronLeft />
              </Button>
              
              <Button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hover:bg-transparent active:bg-transparent cursor-pointer"
                aria-label="Next image"
                variant="transparent"
                size="fit"
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

ImageGallery.displayName = "ImageGallery"

export { ImageGallery }
export default ImageGallery