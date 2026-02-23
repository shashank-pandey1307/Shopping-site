import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { Product } from '../types'

// Sample products data - will be replaced with API data
const allProducts: Product[] = [
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
  },
  {
    id: '5',
    name: 'Earth Tone Essential',
    description: 'Warm earth tones for a grounded look',
    price: 1349,
    color: 'sand',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.06.57 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '6',
    name: 'Low-Key Comfort Tee',
    description: 'Ultimate comfort for low-key days',
    price: 1249,
    color: 'stone grey',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '7',
    name: 'Chill Mode Oversized',
    description: 'Perfect for those laid-back vibes',
    price: 1399,
    color: 'off-white',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.02 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '8',
    name: 'Street Essential',
    description: 'Streetwear essential with premium finish',
    price: 1549,
    color: 'navy',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.05 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '9',
    name: 'Zen Fit Classic',
    description: 'Find your zen in ultimate comfort',
    price: 1299,
    color: 'olive',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '10',
    name: 'Muted Tone Tee',
    description: 'Subtle tones for understated style',
    price: 1199,
    color: 'dusty pink',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.09 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '11',
    name: 'Urban Drift Tee',
    description: 'Drift through the city in style',
    price: 1449,
    color: 'slate',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.12 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '12',
    name: 'Soft Touch Essential',
    description: 'Extra soft fabric for all-day comfort',
    price: 1349,
    color: 'beige',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.14 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '13',
    name: 'Weekend Warrior Tee',
    description: 'Your go-to for weekend adventures',
    price: 1299,
    color: 'forest green',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.17 AM.jpeg'],
    category: 'tees',
    inStock: true
  }
]

const colors = ['all', 'black', 'sage green', 'charcoal', 'cream', 'sand', 'stone grey', 'off-white', 'navy', 'olive', 'dusty pink', 'slate', 'beige', 'forest green']

const Shop = () => {
  const [selectedColor, setSelectedColor] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  const filteredProducts = allProducts.filter(product => 
    selectedColor === 'all' || product.color === selectedColor
  )

  const navigate = useNavigate()

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  return (
    <div className="pt-20">
      <div className="section">
        <div className="max-w-7xl mx-auto">
          {/* Go Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-6"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-heading font-medium text-charcoal-700 mb-4">
              Shop All
            </h1>
            <p className="text-charcoal-400">
              Calm fits for loud minds. Browse our collection.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-cream-200">
            {/* Color Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <span className="text-sm text-charcoal-500 flex-shrink-0">Color:</span>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors capitalize
                      ${selectedColor === color 
                        ? 'bg-charcoal-600 text-cream-50' 
                        : 'bg-cream-200 text-charcoal-500 hover:bg-cream-300'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-charcoal-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream-100 border border-cream-200 text-sm text-charcoal-600 px-3 py-2 rounded-sm focus:outline-none focus:border-charcoal-300"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-charcoal-400">No products found with the selected filter.</p>
              <button 
                onClick={() => setSelectedColor('all')}
                className="mt-4 text-sm font-medium text-charcoal-600 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop
