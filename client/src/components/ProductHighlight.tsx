import { Shirt, Droplets, Sun, Heart } from 'lucide-react'

const features = [
  {
    icon: Shirt,
    title: 'Oversized Fit',
    description: 'Relaxed silhouette designed for effortless comfort'
  },
  {
    icon: Droplets,
    title: 'Premium Cotton',
    description: '100% combed cotton that feels soft on your skin'
  },
  {
    icon: Sun,
    title: 'Long-lasting Print',
    description: 'Fade-resistant prints that stay vibrant wash after wash'
  },
  {
    icon: Heart,
    title: 'Everyday Comfort',
    description: 'Made for living, not just wearing'
  }
]

const ProductHighlight = () => {
  return (
    <section className="section bg-cream-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Product Image */}
          <div className="aspect-[4/5] bg-cream-200 rounded-sm overflow-hidden">
            <img 
              src="/images/WhatsApp Image 2025-12-19 at 10.06.49 AM.jpeg"
              alt="lemonO Essential Oversized Tee"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-10">
            <div>
              <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-3">
                Featured
              </p>
              <h2 className="text-3xl md:text-heading font-medium text-charcoal-700 mb-4">
                Essential Oversized Tee
              </h2>
              <p className="text-charcoal-500 leading-relaxed">
                Our signature piece. Crafted from premium cotton with an oversized fit 
                that drapes perfectly. No logos, no noise—just quiet confidence.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-cream-200 rounded-full flex items-center justify-center">
                    <feature.icon size={18} className="text-charcoal-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-charcoal-700 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-charcoal-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="flex items-center space-x-6">
              <span className="text-2xl font-medium text-charcoal-700">
                ₹1,299
              </span>
              <a href="/product/1" className="btn-primary">
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductHighlight
