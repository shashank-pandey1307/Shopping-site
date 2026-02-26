import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface OrderItem {
  id: string
  quantity: number
  size: string
  price: number
  product: {
    id: string
    name: string
    images: string[]
    color: string
  }
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: OrderItem[]
  shippingAddress: {
    name: string
    line1: string
    city: string
    state: string
    pincode: string
  }
}

const API_URL = 'http://localhost:5000/api'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const OrderHistory = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login', { state: { from: '/orders', message: 'Please login to view your orders' } })
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, isLoggedIn, authLoading, navigate])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/orders/${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
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
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-6"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <div className="flex items-center gap-3 mb-8">
            <Package size={28} className="text-charcoal-700" />
            <h1 className="text-2xl md:text-3xl font-semibold text-charcoal-700">Order History</h1>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto text-charcoal-300 mb-4" />
              <h2 className="text-xl font-medium text-charcoal-600 mb-2">No orders yet</h2>
              <p className="text-charcoal-400 mb-6">When you place an order, it will appear here</p>
              <Link to="/shop" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-cream-200 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-cream-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-left">
                      <div>
                        <p className="text-xs text-charcoal-400">Order</p>
                        <p className="font-medium text-charcoal-700">#{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-400">Date</p>
                        <p className="text-sm text-charcoal-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal-400">Total</p>
                        <p className="font-medium text-charcoal-700">₹{order.total.toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp size={20} className="text-charcoal-400" />
                    ) : (
                      <ChevronDown size={20} className="text-charcoal-400" />
                    )}
                  </button>

                  {expandedOrder === order.id && (
                    <div className="border-t border-cream-200 p-4 md:p-6 bg-cream-50">
                      <div className="space-y-4 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 bg-cream-200 rounded-sm flex-shrink-0">
                              {item.product.images?.[0] && (
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded-sm"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium text-charcoal-700 hover:underline"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-charcoal-500">
                                {item.product.color} • Size: {item.size} • Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-charcoal-600">₹{item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-cream-200">
                        <p className="text-xs text-charcoal-400 mb-1">Shipping Address</p>
                        <p className="text-sm text-charcoal-600">
                          {order.shippingAddress.name}, {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
