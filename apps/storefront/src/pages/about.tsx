import { LifestyleEditorial } from "@/components/sections/lifestyle-editorial"

const About = () => {
  return (
    <div className="min-h-screen pt-32">
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

      {/* Mission Statement */}
      <section className="py-24 bg-white">
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-neutral-900 mb-6 tracking-tight">
              Designed with Purpose
            </h2>
            <p className="text-lg text-neutral-700 leading-relaxed max-w-3xl mx-auto">
              Born from the Nordic philosophy of functional beauty, we create athleisure that honors both movement and stillness. Each piece is an exercise in restraint, where every seam, every stitch serves a purpose. We believe the best design whispers rather than shouts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mt-16">
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

      {/* Brand Story */}
      <LifestyleEditorial
        title="Crafted for Movement"
        description="Founded in Copenhagen, Essentials emerged from a simple truth: movement is life, and life demands clothing that adapts. Our design philosophy draws from Scandinavian minimalism, where form follows function with quiet confidence. We work with Nordic textile mills to source the finest performance fabrics, blending technical innovation with natural fibers. Each piece undergoes rigorous testing, from morning runs along the harbor to evening meditation sessions, ensuring it performs flawlessly wherever your day takes you."
        imageUrl="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/nano_banana_pro_20260204_143825_1-01KGMGX3A0D7S471Q2533HQ322.png"
      />

      {/* Press Coverage */}
      <section className="py-16 bg-sand-50 border-y border-neutral-200">
        <div className="content-container">
          <p className="text-xs uppercase tracking-widest text-neutral-500 text-center mb-12">
            As Seen In
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

      {/* Values Section */}
      <section className="py-24 bg-neutral-900 text-neutral-50">
        <div className="content-container text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-8 tracking-tight">
            Our Principles
          </h2>
          <p className="text-lg text-neutral-300 leading-relaxed mb-12 max-w-2xl mx-auto">
            We design for people who value intention over excess, who seek quality that endures, and who understand that true luxury lies in simplicity.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Radical Honesty
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Full transparency in our supply chain, from fiber to finished garment. We share the true cost and impact of everything we create.
              </p>
            </div>
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Slow Fashion
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                We release two thoughtful collections per year, not twelve. Each piece is designed to last seasons, not weeks.
              </p>
            </div>
            <div className="bg-neutral-800 p-8">
              <h3 className="text-lg font-display font-semibold mb-4 uppercase tracking-wide">
                Mindful Movement
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                Supporting practices that balance body and mind through partnerships with yoga studios and wellness communities.
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
    </div>
  )
}

export default About
