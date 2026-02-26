import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayInstance {
  open: () => void
  close: () => void
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

const Checkout = () => {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const { isLoggedIn } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle')
  const [paymentId, setPaymentId] = useState<string>('')
  const [error, setError] = useState<string>('')

  const shippingCost = totalPrice >= 999 ? 0 : 99
  const finalTotal = totalPrice + shippingCost

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { 
        state: { from: '/checkout', message: 'Please login to proceed with checkout' } 
      })
    }
    if (items.length === 0 && paymentStatus !== 'success') {
      navigate('/cart')
    }
  }, [isLoggedIn, items.length, navigate, paymentStatus])

  const handlePayment = async () => {
    setIsLoading(true)
    setError('')

    try {
      const orderResponse = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'lemonO',
        description: 'Fashion Store Purchase',
        order_id: orderData.order.id,
        handler: async function (response: RazorpayResponse) {
          await verifyPayment(response)
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#4A4A4A'
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
            setError('Payment was cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
      setIsLoading(false)
    }
  }

  const verifyPayment = async (response: RazorpayResponse) => {
    try {
      const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.success) {
        setPaymentStatus('success')
        setPaymentId(response.razorpay_payment_id)
        clearCart()
      } else {
        throw new Error(verifyData.error || 'Payment verification failed')
      }

    } catch (err) {
      console.error('Verification error:', err)
      setPaymentStatus('failed')
      setError(err instanceof Error ? err.message : 'Payment verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (paymentStatus === 'success') {
    return (
      <div className="pt-20 min-h-screen bg-cream-50">
        <div className="section">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-charcoal-700 mb-4">
              Payment Successful!
            </h1>
            <p className="text-charcoal-500 mb-2">
              Thank you for your purchase.
            </p>
            <p className="text-sm text-charcoal-400 mb-8">
              Payment ID: {paymentId}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="btn-primary"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="btn-secondary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="pt-20 min-h-screen bg-cream-50">
        <div className="section">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-medium text-charcoal-700 mb-4">
              Payment Failed
            </h1>
            <p className="text-charcoal-500 mb-8">
              {error || 'Something went wrong. Please try again.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setPaymentStatus('idle')
                  setError('')
                }}
                className="btn-primary"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="btn-secondary"
              >
                Back to Cart
              </button>
            </div>
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

          <h1 className="text-2xl md:text-3xl font-medium text-charcoal-700 mb-10">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-cream-100 p-6 rounded-sm">
                <h2 className="text-lg font-medium text-charcoal-700 mb-4">
                  Order Items ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-4 pb-4 border-b border-cream-200 last:border-0 last:pb-0"
                    >
                      <div className="w-16 h-20 bg-cream-200 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-charcoal-700">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-charcoal-400 mt-1">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-charcoal-600 mt-1">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-sm">
                <Shield size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Secure Payment
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Your payment information is encrypted and secure. We use Razorpay's trusted payment gateway.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-cream-100 p-6 rounded-sm sticky top-28">
                <h2 className="text-lg font-medium text-charcoal-700 mb-6">
                  Payment Summary
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
                  <div className="border-t border-cream-300 pt-4 flex justify-between font-medium text-charcoal-700">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 rounded-sm">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full btn-primary mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay Now ₹{finalTotal.toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-xs text-charcoal-400 text-center mt-4">
                  By clicking Pay Now, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
