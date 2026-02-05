import { Link, useLocation } from "@tanstack/react-router"
import { getCountryCodeFromPath } from "@/lib/utils/region"

const Blog = () => {
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const baseHref = countryCode ? `/${countryCode}` : ""

  // Seed blog posts
  const posts = [
    {
      id: "1",
      title: "The Rise of Everyday Athleisure",
      excerpt:
        "How refined athletic wear became the foundation of modern wardrobes, blending performance with timeless style.",
      date: "March 15, 2024",
      image: "Blog Post - Everyday Athleisure",
      slug: "rise-of-everyday-athleisure",
    },
    {
      id: "2",
      title: "Designing for Comfort Without Compromise",
      excerpt:
        "The philosophy behind creating pieces that perform technically while maintaining minimal aesthetics.",
      date: "March 10, 2024",
      image: "Blog Post - Design Philosophy",
      slug: "designing-for-comfort",
    },
    {
      id: "3",
      title: "A Minimal Wardrobe for Movement",
      excerpt:
        "Building a curated collection of versatile essentials that move seamlessly through your day.",
      date: "March 5, 2024",
      image: "Blog Post - Minimal Wardrobe",
      slug: "minimal-wardrobe-movement",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-white py-16 border-b border-neutral-200">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              The Journal
            </h1>
            <p className="text-lg text-neutral-600">
              Stories, insights, and inspiration from the world of movement and
              mindful living
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="content-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white border border-neutral-200 overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-sand-100 overflow-hidden flex items-center justify-center">
                  <span className="text-neutral-300 text-sm">{post.image}</span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
                    {post.date}
                  </p>
                  <h2 className="text-xl font-display font-semibold text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-neutral-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <button className="text-sm text-neutral-900 uppercase tracking-wider font-semibold hover:text-neutral-600 transition-colors">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-neutral-900">
        <div className="content-container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-display font-semibold text-neutral-50 mb-4 tracking-tight">
            Stay Inspired
          </h2>
          <p className="text-neutral-300 mb-8">
            Subscribe to receive new posts, updates, and exclusive content
            directly to your inbox
          </p>
          <Link to={baseHref || "/"}>
            <button className="inline-block bg-neutral-50 text-neutral-900 px-8 py-4 hover:bg-neutral-200 transition-colors uppercase text-sm font-semibold tracking-wider">
              Subscribe to Newsletter
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Blog
