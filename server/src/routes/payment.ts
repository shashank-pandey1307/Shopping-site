import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = Router()

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

router.post(
  '/create-order',
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('currency').optional().isString().default('INR'),
    body('receipt').optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const { amount, currency = 'INR', receipt } = req.body

      const amountInPaise = Math.round(amount * 100)

      const options = {
        amount: amountInPaise,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: {
          store: 'lemonO'
        }
      }

      const razorpay = getRazorpayInstance()
      const order = await razorpay.orders.create(options)

      res.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt
        },
        key_id: process.env.RAZORPAY_KEY_ID
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

router.post(
  '/verify',
  [
    body('razorpay_order_id').isString().notEmpty(),
    body('razorpay_payment_id').isString().notEmpty(),
    body('razorpay_signature').isString().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

      const isValid = verifyPaymentSignature({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature
      })

      if (isValid) {
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

function verifyPaymentSignature({
  order_id,
  payment_id,
  signature
}: {
  order_id: string
  payment_id: string
  signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET

  if (!secret) {
    console.error('RAZORPAY_KEY_SECRET is not configured')
    return false
  }

  const body = order_id + '|' + payment_id

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    )
  } catch {
    return false
  }
}

export default router
