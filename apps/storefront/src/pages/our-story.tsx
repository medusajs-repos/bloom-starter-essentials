import { LifestyleEditorial } from "@/components/sections/lifestyle-editorial"

const OurStory = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-sand-100">
        <div className="absolute inset-0">
          <img
            src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/generated-01KGHSDPQM7Z6D9PGFG9E15S5P-01KGHSDPQMZFXQV23Z6NVYBARS.jpeg"
            alt="Our Story"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
        <div className="relative z-10 content-container text-center">
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
            Movement-focused design for a life in motion
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-24 bg-white">
        <div className="content-container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
              Where It All Began
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl mx-auto mb-6">
              Founded in 2018 in Copenhagen, Essentials emerged from a simple observation: the world needed athleisure that transcended the gym without sacrificing performance. Our founder, after years of moving between yoga studios, coffee shops, and client meetings, realized that existing options demanded choosing between function and refinement.
            </p>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl mx-auto">
              Drawing from the Nordic philosophy of functional beauty, we set out to create garments that honor both movement and stillness. Each piece became an exercise in restraint, where every seam, every stitch serves a purpose. We believe the best design whispers rather than shouts.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <LifestyleEditorial
        title="Our Design Philosophy"
        description="We design for the fluid modern life. Our garments move seamlessly from morning meditation to afternoon meetings, from evening walks to weekend adventures. Inspired by Scandinavian minimalism, we embrace a form-follows-function approach with quiet confidence. We work exclusively with Nordic textile mills to source the finest performance fabrics, blending technical innovation with natural fibers. Each piece undergoes rigorous testing in real-world conditions, ensuring it performs flawlessly wherever your day takes you."
        imageUrl="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/generated-01KGHSDRC8S3W0SDN3NM9DBDEY-01KGHSDRC8N7MA0ANZ24ASXJHT.jpeg"
      />

      {/* Core Values */}
      <section className="py-24 bg-neutral-50">
        <div className="content-container max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
              What We Stand For
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-display font-semibold text-neutral-900 mb-4 uppercase tracking-wide">
                Timeless Quality
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Meticulously crafted from premium European fabrics, designed to become more personal with time, not disposable.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-display font-semibold text-neutral-900 mb-4 uppercase tracking-wide">
                Conscious Craft
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Responsibly produced in small batches using certified organic and recycled materials, minimizing waste at every step.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-display font-semibold text-neutral-900 mb-4 uppercase tracking-wide">
                Fluid Living
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Garments that move between yoga studio, coffee shop, and evening walk without compromise or costume change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Commitment */}
      <section className="py-24 bg-neutral-900 text-neutral-50">
        <div className="content-container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6 tracking-tight">
              Our Commitment to the Planet
            </h2>
            <p className="text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              We design for people who value intention over excess, who seek quality that endures, and who understand that true luxury lies in simplicity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Radical Transparency
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Full visibility into our supply chain, from fiber to finished garment. We share the true cost and environmental impact of everything we create.
              </p>
            </div>
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Slow Fashion
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Two thoughtful collections per year, not twelve. Each piece is designed to last seasons, not weeks.
              </p>
            </div>
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Mindful Production
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Small-batch manufacturing in certified ethical factories, ensuring fair wages and safe working conditions.
              </p>
            </div>
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Circular Design
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Take-back program for worn pieces, which we repair, refresh, or responsibly recycle into new materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-16 bg-sand-50 border-y border-neutral-200">
        <div className="content-container">
          <p className="text-xs uppercase tracking-widest text-neutral-500 text-center mb-12">
            As Featured In
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center">
            <div className="text-center">
              <p className="text-lg font-display font-semibold text-neutral-700 tracking-tight">Kinfolk</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-semibold text-neutral-700 tracking-tight">Monocle</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-semibold text-neutral-700 tracking-tight">Cereal</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-display font-semibold text-neutral-700 tracking-tight">The Gentlewoman</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OurStory
