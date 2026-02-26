import ProductCard from './ProductCard'
import { Product } from '../types'

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'No Big Deal Tee',
    description: 'Premium cotton oversized tee for everyday comfort',
    price: 1299,
    color: 'black',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.06.49 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '2',
    name: 'Calm Fit Drop Shoulder',
    description: 'Relaxed drop shoulder with minimalist design',
    price: 1499,
    color: 'sage green',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '3',
    name: 'Unbothered Classic',
    description: 'Classic oversized fit in neutral tones',
    price: 1199,
    color: 'charcoal',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '4',
    name: 'Minimal Motion Tee',
    description: 'Soft cotton with subtle texture detail',
    price: 1399,
    color: 'cream',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.06.55 AM.jpeg'],
    category: 'tees',
    inStock: true
  }
]

const FeaturedCollection = () => {
  return (
    <section className="section bg-cream-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-heading font-medium text-charcoal-700 mb-4">
            Featured Collection
          </h2>
          <p className="text-charcoal-400 max-w-md mx-auto">
            Calm fits for loud minds. Each piece designed for everyday comfort.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="/shop" className="btn-secondary">
            View All Products
          </a>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
