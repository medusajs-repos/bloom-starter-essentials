import { Link } from "@tanstack/react-router"
import { ArrowRight } from "@medusajs/icons"

interface Collection {
  id: string
  title: string
  handle: string
  imageUrl: string
}

interface CollectionShowcaseProps {
  collections: Collection[]
}

export function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  if (!collections || collections.length === 0) {
    return null
  }

  const [firstCollection, ...restCollections] = collections

  return (
    <section className="pt-24 pb-32 md:pb-48 bg-white">
      <div className="content-container">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12 md:mb-16 tracking-wide">
          Shop Collections
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[800px]">
          {/* Large Left Collection - Full Height */}
          <Link
            to="/collections/$handle"
            params={{ handle: firstCollection.handle }}
            className="group relative overflow-hidden bg-neutral-100 aspect-[3/4] lg:aspect-auto lg:h-full"
          >
            <img
              src={firstCollection.imageUrl}
              alt={firstCollection.title}
              className="w-full h-full object-cover object-left transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/30 to-transparent">
              <div className="flex items-center gap-2 text-white">
                <span className="text-xl font-light tracking-wide">
                  {firstCollection.title}
                </span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Right Side - Stacked Collections */}
          <div className="flex flex-col gap-6 h-full">
            {restCollections.slice(0, 2).map((collection) => (
              <Link
                key={collection.id}
                to="/collections/$handle"
                params={{ handle: collection.handle }}
                className="group relative overflow-hidden bg-neutral-100 flex-1"
              >
                <img
                  src={collection.imageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/30 to-transparent">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-xl font-light tracking-wide">
                      {collection.title}
                    </span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
