import { Link } from "@tanstack/react-router"
import { ArrowRight } from "@medusajs/icons"

interface PromoBannerProps {
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
  imageUrl?: string
  imagePlaceholder?: string
  overlay?: boolean
}

export const PromoBanner = ({
  title,
  description,
  ctaText,
  ctaHref,
  imageUrl,
  imagePlaceholder = "Campaign Image",
  overlay = true,
}: PromoBannerProps) => {
  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden bg-olive-200">
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {overlay && (
            <div className="absolute inset-0 bg-neutral-900/20" />
          )}
        </>
      )}
      
      {!imageUrl && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <span className="text-neutral-300 text-sm">{imagePlaceholder}</span>
        </div>
      )}

      <div className="relative z-10 content-container text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-lg md:text-xl text-neutral-700 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {ctaText && ctaHref && (
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-2 bg-neutral-900 text-neutral-50 px-8 py-4 hover:bg-neutral-800 transition-colors uppercase text-xs font-semibold tracking-wider"
          >
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </section>
  )
}
