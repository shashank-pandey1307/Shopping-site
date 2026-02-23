import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Truck, RotateCcw, Search, CheckCircle, Clock, MapPin, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface TrackingResult {
  orderId: string
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered'
  estimatedDelivery: string
  lastUpdate: string
  location: string
  timeline: {
    status: string
    date: string
    completed: boolean
  }[]
}

const ShippingReturns = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'track' | 'return' | 'info'>('track')
  const [trackingId, setTrackingId] = useState('')
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [returnOrderId, setReturnOrderId] = useState('')
  const [returnReason, setReturnReason] = useState('')
  const [returnSubmitted, setReturnSubmitted] = useState(false)

  // Mock tracking search
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId.trim()) return

    setIsSearching(true)
    
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        orderId: trackingId,
        status: 'in-transit',
        estimatedDelivery: 'December 22, 2025',
        lastUpdate: 'December 19, 2025 - 2:30 PM',
        location: 'Mumbai Distribution Center',
        timeline: [
          { status: 'Order Placed', date: 'Dec 17, 2025', completed: true },
          { status: 'Order Confirmed', date: 'Dec 17, 2025', completed: true },
          { status: 'Shipped', date: 'Dec 18, 2025', completed: true },
          { status: 'In Transit', date: 'Dec 19, 2025', completed: true },
          { status: 'Out for Delivery', date: 'Dec 22, 2025', completed: false },
          { status: 'Delivered', date: '-', completed: false }
        ]
      })
      setIsSearching(false)
    }, 1500)
  }

  // Mock return request
  const handleReturnRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!returnOrderId.trim() || !returnReason.trim()) return

    // Simulate API call
    setTimeout(() => {
      setReturnSubmitted(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-4 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-charcoal-400 hover:text-charcoal-600 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-medium text-charcoal-700 mb-3">
            Shipping & Returns
          </h1>
          <p className="text-charcoal-400">
            Track your order or request a return/replacement
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-cream-200">
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'track'
                ? 'border-charcoal-600 text-charcoal-700'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            }`}
          >
            <Truck size={18} />
            Track Order
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'return'
                ? 'border-charcoal-600 text-charcoal-700'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            }`}
          >
            <RotateCcw size={18} />
            Return / Replace
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'info'
                ? 'border-charcoal-600 text-charcoal-700'
                : 'border-transparent text-charcoal-400 hover:text-charcoal-600'
            }`}
          >
            <Package size={18} />
            Shipping Info
          </button>
        </div>

        {/* Track Order Tab */}
        {activeTab === 'track' && (
          <div className="space-y-8">
            {/* Search Form */}
            <div className="bg-cream-100 p-6 rounded-sm">
              <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                Track Your Order
              </h2>
              <form onSubmit={handleTrackOrder} className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" size={18} />
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Order ID or Tracking Number"
                    className="w-full pl-10 pr-4 py-3 bg-cream-50 border border-cream-200 text-charcoal-600 placeholder:text-charcoal-300 focus:outline-none focus:border-charcoal-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </button>
              </form>
              {user && (
                <p className="mt-3 text-sm text-charcoal-400">
                  Or view all your orders in{' '}
                  <Link to="/orders" className="text-charcoal-600 underline hover:text-charcoal-700">
                    Order History
                  </Link>
                </p>
              )}
            </div>

            {/* Tracking Result */}
            {trackingResult && (
              <div className="bg-cream-100 p-6 rounded-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-charcoal-700">
                      Order #{trackingResult.orderId}
                    </h3>
                    <p className="text-sm text-charcoal-400 mt-1">
                      Estimated Delivery: {trackingResult.estimatedDelivery}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-sage-100 text-sage-600 text-sm font-medium rounded-full capitalize">
                    {trackingResult.status.replace('-', ' ')}
                  </span>
                </div>

                {/* Current Location */}
                <div className="flex items-center gap-3 p-4 bg-cream-50 rounded-sm mb-6">
                  <MapPin className="text-charcoal-500" size={20} />
                  <div>
                    <p className="text-sm font-medium text-charcoal-600">
                      {trackingResult.location}
                    </p>
                    <p className="text-xs text-charcoal-400">
                      Last updated: {trackingResult.lastUpdate}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-0">
                  {trackingResult.timeline.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-sage-500 text-cream-50' 
                            : 'bg-cream-200 text-charcoal-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle size={16} />
                          ) : (
                            <Clock size={16} />
                          )}
                        </div>
                        {index < trackingResult.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            step.completed ? 'bg-sage-500' : 'bg-cream-200'
                          }`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`font-medium ${
                          step.completed ? 'text-charcoal-700' : 'text-charcoal-400'
                        }`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-charcoal-400">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Return / Replace Tab */}
        {activeTab === 'return' && (
          <div className="space-y-8">
            {returnSubmitted ? (
              <div className="bg-cream-100 p-8 rounded-sm text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-sage-600" size={32} />
                </div>
                <h2 className="text-xl font-medium text-charcoal-700 mb-2">
                  Return Request Submitted
                </h2>
                <p className="text-charcoal-400 mb-6">
                  We've received your return request for Order #{returnOrderId}. 
                  Our team will review it and get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => {
                    setReturnSubmitted(false)
                    setReturnOrderId('')
                    setReturnReason('')
                  }}
                  className="btn-secondary"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <>
                {/* Return Policy Summary */}
                <div className="bg-cream-100 p-6 rounded-sm">
                  <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                    Return & Replacement Policy
                  </h2>
                  <ul className="space-y-2 text-sm text-charcoal-500">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-sage-500 mt-0.5 flex-shrink-0" />
                      <span>7-day easy returns from delivery date</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-sage-500 mt-0.5 flex-shrink-0" />
                      <span>Free replacement for damaged or defective items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-sage-500 mt-0.5 flex-shrink-0" />
                      <span>Items must be unused with original tags attached</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-sage-500 mt-0.5 flex-shrink-0" />
                      <span>Refund processed within 5-7 business days</span>
                    </li>
                  </ul>
                </div>

                {/* Return Request Form */}
                <div className="bg-cream-100 p-6 rounded-sm">
                  <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                    Request Return / Replacement
                  </h2>
                  <form onSubmit={handleReturnRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Order ID *
                      </label>
                      <input
                        type="text"
                        value={returnOrderId}
                        onChange={(e) => setReturnOrderId(e.target.value)}
                        placeholder="Enter your Order ID"
                        className="w-full px-4 py-3 bg-cream-50 border border-cream-200 text-charcoal-600 placeholder:text-charcoal-300 focus:outline-none focus:border-charcoal-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Request Type *
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-cream-50 border border-cream-200 text-charcoal-600 focus:outline-none focus:border-charcoal-400"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="return">Return & Refund</option>
                        <option value="replace">Replacement</option>
                        <option value="exchange">Exchange for different size</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Reason for Return *
                      </label>
                      <textarea
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        placeholder="Please describe the reason for your return or replacement request..."
                        rows={4}
                        className="w-full px-4 py-3 bg-cream-50 border border-cream-200 text-charcoal-600 placeholder:text-charcoal-300 focus:outline-none focus:border-charcoal-400 resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal-600 mb-2">
                        Upload Images (Optional)
                      </label>
                      <div className="border-2 border-dashed border-cream-300 rounded-sm p-6 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          id="return-images"
                        />
                        <label 
                          htmlFor="return-images"
                          className="cursor-pointer text-charcoal-400 hover:text-charcoal-600"
                        >
                          <Package className="mx-auto mb-2" size={24} />
                          <span className="text-sm">Click to upload images of the product</span>
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="btn-primary w-full">
                      Submit Return Request
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}

        {/* Shipping Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-cream-100 p-6 rounded-sm">
              <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                Delivery Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cream-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-charcoal-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal-600">Standard Delivery</h3>
                    <p className="text-sm text-charcoal-400">5-7 business days • ₹49 (Free over ₹999)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cream-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-charcoal-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal-600">Express Delivery</h3>
                    <p className="text-sm text-charcoal-400">2-3 business days • ₹149</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Partners */}
            <div className="bg-cream-100 p-6 rounded-sm">
              <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                Our Shipping Partners
              </h2>
              <p className="text-sm text-charcoal-500 mb-4">
                We work with trusted delivery partners to ensure your order reaches you safely.
              </p>
              <div className="flex flex-wrap gap-4">
                {['Delhivery', 'BlueDart', 'DTDC', 'Ecom Express'].map((partner) => (
                  <span 
                    key={partner}
                    className="px-4 py-2 bg-cream-50 text-charcoal-500 text-sm rounded-sm"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-cream-100 p-6 rounded-sm">
              <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-charcoal-600 mb-1">
                    How do I track my order?
                  </h3>
                  <p className="text-sm text-charcoal-400">
                    Enter your Order ID or tracking number in the "Track Order" tab above. You'll also receive tracking updates via email and SMS.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal-600 mb-1">
                    What if my order is delayed?
                  </h3>
                  <p className="text-sm text-charcoal-400">
                    Delays can occasionally occur due to weather or high demand. If your order is significantly delayed, please contact our support team.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal-600 mb-1">
                    Can I change my delivery address?
                  </h3>
                  <p className="text-sm text-charcoal-400">
                    Address changes can be made before the order is shipped. Please contact us immediately if you need to update your address.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal-600 mb-1">
                    Do you ship internationally?
                  </h3>
                  <p className="text-sm text-charcoal-400">
                    Currently, we only ship within India. International shipping will be available soon!
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-charcoal-600 p-6 rounded-sm text-center">
              <h2 className="text-lg font-medium text-cream-50 mb-2">
                Need Help?
              </h2>
              <p className="text-cream-200 text-sm mb-4">
                Our support team is here to help with any shipping questions.
              </p>
              <Link to="/contact" className="inline-block px-6 py-2 bg-cream-50 text-charcoal-600 text-sm font-medium hover:bg-cream-100 transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShippingReturns
