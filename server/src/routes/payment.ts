import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = Router()

// Helper function to get Razorpay instance (lazy initialization)
// This ensures environment variables are loaded before creating the instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file')
  }

  return new Razorpay({
    key_id,
    key_secret
  })
}

/**
 * Create a Razorpay Order
 * POST /api/payment/create-order
 * 
 * This endpoint creates an order in Razorpay and returns the order ID
 * which is then used by the frontend to initiate payment
 */
router.post(
  '/create-order',
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isString().default('INR'),
    body('receipt').optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      // Validate request
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const { amount, currency = 'INR', receipt } = req.body

      // Razorpay expects amount in paise (smallest currency unit)
      // So ₹100 = 10000 paise
      const amountInPaise = Math.round(amount * 100)

      // Create order options
      const options = {
        amount: amountInPaise,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: {
          // You can add custom notes here
          store: 'lemonO'
        }
      }

      // Get Razorpay instance and create order
      const razorpay = getRazorpayInstance()
      const order = await razorpay.orders.create(options)

      // Return order details to frontend
      res.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt
        },
        key_id: process.env.RAZORPAY_KEY_ID // Send key_id to frontend (safe to expose)
      })

    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create payment order'
      })
    }
  }
)

/**
 * Verify Payment Signature
 * POST /api/payment/verify
 * 
 * This endpoint verifies the payment signature to ensure
 * the payment was not tampered with
 */
router.post(
  '/verify',
  [
    body('razorpay_order_id').isString().notEmpty(),
    body('razorpay_payment_id').isString().notEmpty(),
    body('razorpay_signature').isString().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      // Validate request
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

      // Verify the signature
      const isValid = verifyPaymentSignature({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature
      })

      if (isValid) {
        // Payment is verified! 
        // Here you can:
        // 1. Update order status in your database
        // 2. Send confirmation email
        // 3. Clear the user's cart
        // 4. Generate invoice, etc.

        res.json({
          success: true,
          message: 'Payment verified successfully',
          payment_id: razorpay_payment_id
        })
      } else {
        res.status(400).json({
          success: false,
          error: 'Payment verification failed'
        })
      }

    } catch (error) {
      console.error('Error verifying payment:', error)
      res.status(500).json({
        success: false,
        error: 'Payment verification failed'
      })
    }
  }
)

/**
 * Verify Razorpay Payment Signature
 * 
 * This function creates an HMAC SHA256 hash using:
 * - order_id + "|" + payment_id as the message
 * - Your Razorpay key_secret as the secret key
 * 
 * Then compares it with the signature received from Razorpay
 */
function verifyPaymentSignature({
  order_id,
  payment_id,
  signature
}: {
  order_id: string
  payment_id: string
  signature: string
}): boolean {
  // Get the key_secret from environment
  const secret = process.env.RAZORPAY_KEY_SECRET

  if (!secret) {
    console.error('RAZORPAY_KEY_SECRET is not configured')
    return false
  }

  // Create the expected signature
  // Format: order_id|payment_id
  const body = order_id + '|' + payment_id

  // Generate HMAC SHA256 hash
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  // Compare signatures (use timingSafeEqual to prevent timing attacks)
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  } catch {
    // If lengths don't match, timingSafeEqual throws an error
    return false
  }
}

export default router
