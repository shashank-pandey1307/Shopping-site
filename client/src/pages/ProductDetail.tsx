import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Minus, Plus, Truck, RotateCcw, Shield, Check, ArrowLeft, Heart } from 'lucide-react'
import { Product } from '../types'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const allProducts: Product[] = [
  {
    id: '1',
    name: 'No Big Deal Tee',
    description: 'Our signature oversized tee crafted from 100% premium combed cotton. Features a relaxed drop shoulder design that drapes naturally without looking baggy. Perfect for everyday wear—whether you\'re chilling at home or out in the city.',
    price: 1299,
    color: 'black',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.06.49 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.06.52 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '2',
    name: 'Calm Fit Drop Shoulder',
    description: 'Relaxed drop shoulder with minimalist design. Made from breathable premium cotton that keeps you cool and comfortable all day. The perfect blend of style and comfort for the modern minimalist.',
    price: 1499,
    color: 'sage green',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '3',
    name: 'Unbothered Classic',
    description: 'Classic oversized fit in neutral tones. This timeless piece features our signature relaxed silhouette with reinforced stitching for durability. Wear it your way—tucked, untucked, or layered.',
    price: 1199,
    color: 'charcoal',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '4',
    name: 'Minimal Motion Tee',
    description: 'Soft cotton with subtle texture detail. Designed for those who appreciate understated elegance. The lightweight fabric moves with you while maintaining its shape throughout the day.',
    price: 1399,
    color: 'cream',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.06.55 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.06.57 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '5',
    name: 'Earth Tone Essential',
    description: 'Warm earth tones for a grounded look. Inspired by nature, this tee brings organic vibes to your wardrobe. Perfect for pairing with denim or layering under your favorite jacket.',
    price: 1349,
    color: 'sand',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.06.57 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.07.00 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '6',
    name: 'Low-Key Comfort Tee',
    description: 'Ultimate comfort for low-key days. When you want to look put-together without trying too hard, this is your go-to. Soft, breathable, and effortlessly stylish.',
    price: 1249,
    color: 'stone grey',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '7',
    name: 'Chill Mode Oversized',
    description: 'Perfect for those laid-back vibes. Extra roomy fit that doesn\'t compromise on style. Made from our softest cotton blend for maximum comfort during your chill sessions.',
    price: 1399,
    color: 'off-white',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.02 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.07.05 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '8',
    name: 'Street Essential',
    description: 'Streetwear essential with premium finish. Bold yet understated, this tee is designed for those who set trends rather than follow them. Premium construction meets street-ready style.',
    price: 1549,
    color: 'navy',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.05 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.07.07 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '9',
    name: 'Zen Fit Classic',
    description: 'Find your zen in ultimate comfort. A meditative approach to everyday wear. Clean lines, peaceful tones, and a fit that lets you breathe and move freely.',
    price: 1299,
    color: 'olive',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    id: '10',
    name: 'Muted Tone Tee',
    description: 'Subtle tones for understated style. For those who speak softly but make a statement. This muted palette works with everything in your wardrobe.',
    price: 1199,
    color: 'dusty pink',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.09 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.07.12 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '11',
    name: 'Urban Drift Tee',
    description: 'Drift through the city in style. Designed for urban explorers who value comfort without sacrificing aesthetics. From coffee runs to late-night hangouts.',
    price: 1449,
    color: 'slate',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.12 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.07.14 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '12',
    name: 'Soft Touch Essential',
    description: 'Extra soft fabric for all-day comfort. Our softest tee yet, made from specially treated cotton that gets even softer with every wash. Your new everyday essential.',
    price: 1349,
    color: 'beige',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.14 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.07.17 AM.jpeg'],
    category: 'tees',
    inStock: true
  },
  {
    id: '13',
    name: 'Weekend Warrior Tee',
    description: 'Your go-to for weekend adventures. Built for whatever the weekend brings—brunch, beach, or just being. Durable, comfortable, and always ready.',
    price: 1299,
    color: 'forest green',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/WhatsApp Image 2025-12-19 at 10.07.17 AM.jpeg', '/images/WhatsApp Image 2025-12-19 at 10.06.49 AM.jpeg'],
    category: 'tees',
    inStock: true
  }
]

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isLoggedIn, isFavorite, addToFavorites, removeFromFavorites } = useAuth()
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  const product = allProducts.find(p => p.id === id) || allProducts[0]
  
  const favorited = isFavorite(product.id)

  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/product/${id}`, message: 'Please login to save favorites' } })
      return
    }

    if (favorited) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    addToCart(product, selectedSize, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="pt-20">
      <div className="section">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-6"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-cream-100 rounded-sm overflow-hidden">
                <img 
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 bg-cream-100 rounded-sm overflow-hidden border-2 transition-colors
                        ${selectedImage === index ? 'border-charcoal-600' : 'border-transparent'}`}
                    >
                      <img 
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mb-2">
                  lemonO
                </p>
                <h1 className="text-2xl md:text-3xl font-medium text-charcoal-700 mb-3">
                  {product.name}
                </h1>
                <p className="text-sm text-charcoal-400 capitalize mb-4">
                  {product.color}
                </p>
                <p className="text-2xl font-medium text-charcoal-700">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>

              <p className="text-charcoal-500 leading-relaxed">
                {product.description}
              </p>

              <div>
                <p className="text-sm font-medium text-charcoal-600 mb-3">
                  Size
                </p>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-sm font-medium transition-colors
                        ${selectedSize === size 
                          ? 'border-charcoal-600 bg-charcoal-600 text-cream-50' 
                          : 'border-cream-300 text-charcoal-600 hover:border-charcoal-400'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal-600 mb-3">
                  Quantity
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-cream-300 flex items-center justify-center text-charcoal-500 hover:border-charcoal-400 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-medium text-charcoal-700 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-cream-300 flex items-center justify-center text-charcoal-500 hover:border-charcoal-400 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 text-center transition-all duration-300 ${
                    addedToCart 
                      ? 'bg-green-600 text-white px-8 py-3' 
                      : 'btn-primary'
                  }`}
                  disabled={addedToCart}
                >
                  {addedToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={18} />
                      Added to Cart!
                    </span>
                  ) : (
                    `Add to Cart — ₹${(product.price * quantity).toLocaleString()}`
                  )}
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className={`w-12 h-12 flex items-center justify-center border transition-all duration-200 ${
                    favorited
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-charcoal-300 text-charcoal-500 hover:border-red-400 hover:text-red-500'
                  }`}
                  title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="pt-6 border-t border-cream-200 space-y-4">
                <div className="flex items-center space-x-3 text-charcoal-500">
                  <Truck size={18} />
                  <span className="text-sm">Free shipping on orders above ₹999</span>
                </div>
                <div className="flex items-center space-x-3 text-charcoal-500">
                  <RotateCcw size={18} />
                  <span className="text-sm">Easy 7-day returns</span>
                </div>
                <div className="flex items-center space-x-3 text-charcoal-500">
                  <Shield size={18} />
                  <span className="text-sm">100% secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
