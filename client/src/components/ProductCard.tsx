import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Product } from '../types'
import { useAuth } from '../context/AuthContext'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate()
  const { isLoggedIn, isFavorite, addToFavorites, removeFromFavorites } = useAuth()
  const favorited = isFavorite(product.id)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/product/${product.id}`, message: 'Please login to save favorites' } })
      return
    }

    if (favorited) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="product-card rounded-sm overflow-hidden">
        {/* Product Image */}
        <div className="aspect-[3/4] bg-cream-200 relative overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              favorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-charcoal-500 hover:bg-white hover:text-red-500'
            }`}
            title={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-charcoal-700">
            {product.name}
          </h3>
          <p className="text-xs text-charcoal-400 capitalize">
            {product.color}
          </p>
          <p className="text-sm font-medium text-charcoal-600">
            ₹{product.price.toLocaleString()}
          </p>
        </div>

        {/* View CTA - appears on hover */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">
            View Product →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
