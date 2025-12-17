export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#e8efff] via-[#e8efff] to-[#e8efff] px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#002B5B] leading-tight">
            Know More about Skill Vedika
          </h1>

          <p className="text-[#1e293b] text-lg leading-relaxed max-w-lg">
            Master in-demand tech skills with hands-on learning. Your gateway to
            upskilling, reskilling, and career growth in the digital world.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#475569] font-medium">
            <a href="/" className="hover:text-[#002B5B] transition-colors">
              Home
            </a>
            <span className="text-[#94a3b8]">››</span>
            <a href="#" className="text-[#002B5B] font-semibold">
              About
            </a>
          </div>

          {/* CTA Button */}
          <button className="mt-4 bg-[#002B5B] hover:bg-[#013a7b] text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-200">
            Contact us today
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center relative">
          <div className="w-[380px] h-[380px] relative">
            <img
              src="/about-us/Frame 280.png"
              alt="About Skill Vedika"
              className="object-contain w-full h-full drop-shadow-xl"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,43,91,0.05)_0%,_transparent_70%)] rounded-full" />
          </div>
        </div>
      </div>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e0e7ff]/40 pointer-events-none" />
    </section>
  )
}
