import { Leaf, Maximize, Paintbrush, Calendar } from 'lucide-react'

const trustPoints = [
  {
    icon: Leaf,
    title: 'Premium Fabric',
    description: '100% combed cotton that\'s soft, breathable, and kind to your skin.'
  },
  {
    icon: Maximize,
    title: 'Comfortable Oversized Fit',
    description: 'Relaxed silhouette that drapes naturally without looking baggy.'
  },
  {
    icon: Paintbrush,
    title: 'Fade-Resistant Prints',
    description: 'Advanced printing techniques ensure colors stay vibrant, wash after wash.'
  },
  {
    icon: Calendar,
    title: 'Made for Everyday',
    description: 'Designed for real life—whether you\'re chilling or out in the city.'
  }
]

const WhyLemonO = () => {
  return (
    <section className="section bg-cream-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-heading font-medium text-charcoal-700 mb-4">
            Why lemonO
          </h2>
          <p className="text-charcoal-400 max-w-lg mx-auto">
            We focus on what matters—quality, comfort, and a vibe that speaks for itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {trustPoints.map((point, index) => (
            <div 
              key={index} 
              className="flex items-start space-x-5 p-6 bg-cream-100 rounded-sm"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-cream-200 rounded-full flex items-center justify-center">
                <point.icon size={20} className="text-charcoal-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-charcoal-700 mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-charcoal-400 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyLemonO
