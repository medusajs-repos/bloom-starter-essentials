import { Link } from "@tanstack/react-router"
import { ArrowRight } from "@medusajs/icons"

interface LifestyleEditorialProps {
  title: string
  description: string
  ctaText?: string
  ctaHref?: string
  imageUrl?: string
  imagePlaceholder?: string
  reversed?: boolean
}

export const LifestyleEditorial = ({
  title,
  description,
  ctaText,
  ctaHref,
  imageUrl,
  imagePlaceholder = "Lifestyle Image",
  reversed = false,
}: LifestyleEditorialProps) => {
  return (
    <section className="py-24 bg-sand-50 pt-[-14px] pb-[-14px]">
      <div className="content-container">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
            reversed ? "lg:flex-row-reverse" : ""
          }`}
        >
          <div className={`${reversed ? "lg:order-2" : ""}`}>
            <div className="aspect-[4/5] bg-olive-100 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-neutral-300 text-sm">{imagePlaceholder}</span>
                </div>
              )}
            </div>
          </div>

          <div className={`${reversed ? "lg:order-1" : ""}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
              {title}
            </h2>
            <p className="text-neutral-600 text-lg mb-8 leading-relaxed">
              {description}
            </p>
            {ctaText && ctaHref && (
              <Link
                to={ctaHref}
                className="inline-flex items-center gap-2 text-neutral-900 hover:text-neutral-600 transition-colors uppercase text-xs font-semibold tracking-wider"
              >
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
