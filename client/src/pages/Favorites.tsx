import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  color: string
  images: string[]
}

const API_URL = 'http://localhost:5000/api'

const Favorites = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, isLoading: authLoading, removeFromFavorites } = useAuth()
  const [favorites, setFavorites] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login', { state: { from: '/favorites', message: 'Please login to view your favorites' } })
      return
    }

    if (user) {
      fetchFavorites()
    }
  }, [user, isLoggedIn, authLoading, navigate])

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/favorites/${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (productId: string) => {
    await removeFromFavorites(productId)
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  if (authLoading || isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-cream-50">
        <div className="section">
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-charcoal-400">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-cream-50">
      <div className="section">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-6"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <div className="flex items-center gap-3 mb-8">
            <Heart size={28} className="text-charcoal-700" />
            <h1 className="text-2xl md:text-3xl font-semibold text-charcoal-700">Favorites</h1>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto text-charcoal-300 mb-4" />
              <h2 className="text-xl font-medium text-charcoal-600 mb-2">No favorites yet</h2>
              <p className="text-charcoal-400 mb-6">Save your favorite items to find them easily later</p>
              <Link to="/shop" className="btn-primary">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="group bg-white border border-cream-200 rounded-sm overflow-hidden">
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-cream-100">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-charcoal-300">
                        No image
                      </div>
                    )}
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemove(product.id)
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Link>

                  {/* Details */}
                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-charcoal-700 hover:underline mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-charcoal-500 mb-2">{product.color}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-charcoal-700">₹{product.price.toLocaleString()}</p>
                      <Link 
                        to={`/product/${product.id}`}
                        className="text-sm text-charcoal-600 hover:text-charcoal-800 hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Favorites
