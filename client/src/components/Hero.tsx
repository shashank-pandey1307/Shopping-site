const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-cream-100">
      {/* Background Image Placeholder - Replace with actual hero image */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-cream-100 via-cream-200 to-earth-100"
        style={{
          backgroundImage: `url('/images/WhatsApp Image 2025-12-19 at 10.06.49 AM.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-display font-semibold text-charcoal-700 mb-6 tracking-tight">
          lemonO
        </h1>
        <p className="text-lg md:text-xl text-charcoal-500 font-light tracking-wide mb-10">
          Unbothered, by design.
        </p>
        <a 
          href="/shop" 
          className="btn-secondary inline-block"
        >
          Explore Collection
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-charcoal-300 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-charcoal-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

export default Hero
