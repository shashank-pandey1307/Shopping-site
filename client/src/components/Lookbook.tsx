import { useState, useEffect } from 'react'

const lookbookImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80',
    alt: 'Model in oversized tee - relaxed urban style'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    alt: 'Casual streetwear look'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    alt: 'Minimalist fashion editorial'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&q=80',
    alt: 'Everyday streetwear'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80',
    alt: 'Calm confident style'
  }
]

const Lookbook = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % lookbookImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section-sm bg-cream-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-heading font-medium text-charcoal-700 mb-4">
            Lookbook
          </h2>
          <p className="text-charcoal-400">
            Real fits. Real comfort. Real vibes.
          </p>
        </div>

        {/* Horizontal Gallery with Auto-slide */}
        <div className="relative overflow-hidden -mx-6 px-6">
          <div 
            className="flex space-x-4 md:space-x-6 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 280}px)` }}
          >
            {lookbookImages.map((image) => (
              <div 
                key={image.id} 
                className="flex-shrink-0 w-64 md:w-80 aspect-[3/4] bg-cream-200 rounded-sm overflow-hidden"
              >
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {lookbookImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-charcoal-700 w-6' 
                  : 'bg-charcoal-300 hover:bg-charcoal-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Lookbook
