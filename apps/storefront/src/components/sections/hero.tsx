import { Link } from "@tanstack/react-router"
import { ArrowRight } from "@medusajs/icons"

interface HeroProps {
  title: string
  subtitle?: string
  ctaText: string
  ctaHref: string
  imageUrl?: string
  imagePlaceholder?: string
}

export const Hero = ({
  title,
  subtitle,
  ctaText,
  ctaHref,
  imageUrl,
  imagePlaceholder = "Hero Image",
}: HeroProps) => {
  return (
    <section className="relative w-full h-[200vh] flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <div className="fixed top-1/2 left-0 w-full h-[200vh] z-0 -translate-y-1/2">
        {imageUrl ? (
          <video
            src={imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-neutral-300 text-sm">{imagePlaceholder}</span>
          </div>
        )}
      </div>
      
      {/* Content overlays the fixed video */}
      <div className="relative z-10 content-container text-center max-w-3xl px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto text-white">
            {subtitle}
          </p>
        )}
        <Link
          to={ctaHref}
          className="inline-flex items-center gap-2 bg-neutral-900 text-neutral-50 px-8 py-4 hover:bg-neutral-800 transition-colors uppercase text-xs font-semibold tracking-wider"
        >
          {ctaText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
