const BrandPhilosophy = () => {
  return (
    <section className="section bg-cream-50 relative overflow-hidden">
      {/* Subtle background element */}
      <div 
        className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-earth-100 to-transparent opacity-30"
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-8">
          {/* Label */}
          <p className="text-xs font-medium text-charcoal-400 uppercase tracking-widest">
            Our Philosophy
          </p>
          
          {/* Main Copy */}
          <div className="space-y-6 brand-philosophy-text">
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-charcoal-600 leading-relaxed" id="fonts">
              lemonO is for days when you don't want to explain yourself.
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-charcoal-500 leading-relaxed" id="fonts">
              When comfort matters more than noise.
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-charcoal-400 leading-relaxed" id="fonts">
              When being low-key is the vibe.
            </p>
          </div>

          {/* Brand Signature */}
          <div className="pt-8">
            <span className="text-sm font-medium text-charcoal-500 tracking-wide">
              — lemonO
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandPhilosophy
