import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()
  const { isLoggedIn } = useAuth()

  const shippingCost = totalPrice >= 999 ? 0 : 99
  const finalTotal = totalPrice + shippingCost

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-cream-50">
        <div className="section">
          <div className="max-w-2xl mx-auto text-center">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-8"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            <div className="w-20 h-20 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={32} className="text-charcoal-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-charcoal-700 mb-4">
              Your cart is empty
            </h1>
            <p className="text-charcoal-400 mb-8">
              Looks like you haven't added anything yet.
            </p>
            <Link to="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-cream-50">
      <div className="section">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-6"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl md:text-3xl font-medium text-charcoal-700">
              Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
            <button 
              onClick={clearCart}
              className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div 
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-4 md:gap-6 p-4 bg-cream-100 rounded-sm"
                >
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <div className="w-24 h-28 md:w-32 md:h-40 bg-cream-200 rounded-sm overflow-hidden">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-sm md:text-base font-medium text-charcoal-700 hover:underline">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-charcoal-400 mt-1 capitalize">
                        {item.product.color} • Size {item.size}
                      </p>
                      <p className="text-sm font-medium text-charcoal-600 mt-2">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 border border-cream-300 flex items-center justify-center text-charcoal-500 hover:border-charcoal-400 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium text-charcoal-700 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 border border-cream-300 flex items-center justify-center text-charcoal-500 hover:border-charcoal-400 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="p-2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-cream-100 p-6 rounded-sm sticky top-28">
                <h2 className="text-lg font-medium text-charcoal-700 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-charcoal-500">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-500">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-charcoal-400">
                      Free shipping on orders above ₹999
                    </p>
                  )}
                  <div className="border-t border-cream-300 pt-4 flex justify-between font-medium text-charcoal-700">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login', { state: { from: '/checkout', message: 'Please login to proceed with checkout' } })
                    } else {
                      navigate('/checkout')
                    }
                  }}
                  className="w-full btn-primary mt-6"
                >
                  Proceed to Checkout
                </button>

                <Link 
                  to="/shop" 
                  className="block text-center text-sm text-charcoal-500 hover:text-charcoal-700 mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
