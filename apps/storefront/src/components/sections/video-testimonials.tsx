export function VideoTestimonials() {
  return (
    <section className="content-container pt-48 md:pt-56 pb-16 md:pb-24">
      <div className="space-y-12">
        {/* Video Section */}
        <div className="relative aspect-video w-full overflow-hidden bg-sand-light">
          <video
            src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/Help_me_create_202602041336_xy3x3-01KGMAF513MCSTBRWGFYE5S2KC.mp4"
            className="h-full w-full object-cover scale-125"
            controls
            playsInline
          />
        </div>

        {/* Testimonials Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Testimonial 1 */}
          <div className="bg-neutral-100 p-6 md:p-8 flex flex-col">
            <div className="text-4xl text-neutral-400 leading-none mb-4">"</div>
            <p className="text-base md:text-lg font-light leading-relaxed text-neutral-900 mb-4 flex-grow">
              The leather is sourced from environmentally friendly tanneries in
              Italy, France, and Turkey, where Rure is based and everything is
              assembled by hand.
            </p>
            <div className="pt-4 mt-auto">
              <p className="text-sm text-neutral-900 font-medium">Nordic Magazine</p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-neutral-100 p-6 md:p-8 md:pl-[110px] md:pr-[110px] flex flex-col">
            <div className="text-4xl text-neutral-400 leading-none mb-4">"</div>
            <p className="text-base md:text-lg font-light leading-relaxed text-neutral-900 mb-4 flex-grow">
              All too often, we're forced to pick: style, or sustainability.
              Recently, more designers have been making environmental impact a
              top priority.
            </p>
            <div className="pt-4 mt-auto">
              <p className="text-sm text-neutral-900 font-medium">The Minimalist Edit</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
