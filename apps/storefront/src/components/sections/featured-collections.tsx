import { Link } from "@tanstack/react-router"

interface Collection {
  name: string
  handle: string
  imageUrl?: string
}

interface FeaturedCollectionsProps {
  collections: Collection[]
  countryCode: string
}

export const FeaturedCollections = ({
  collections,
  countryCode,
}: FeaturedCollectionsProps) => {
  if (!collections || collections.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-neutral-50">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover our curated collections of premium athleisure essentials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.slice(0, 3).map((collection) => (
            <Link
              key={collection.handle}
              to="/$countryCode/categories/$handle"
              params={{ countryCode: countryCode || "us", handle: collection.handle }}
              className="group"
            >
              <div className="aspect-[3/4] bg-sand-100 mb-4 overflow-hidden">
                {collection.imageUrl ? (
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-neutral-300 text-sm">Collection Image</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-display font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                {collection.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
