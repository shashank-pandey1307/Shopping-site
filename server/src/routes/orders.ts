import { Router, Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import prisma from '../lib/prisma'

const router = Router()

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LO-${timestamp}-${random}`
}

// Create new order
router.post(
  '/',
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').isString(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.size').isString(),
    body('shippingAddress.name').isString().trim().notEmpty(),
    body('shippingAddress.phone').isString().trim().notEmpty(),
    body('shippingAddress.line1').isString().trim().notEmpty(),
    body('shippingAddress.line2').optional().isString(),
    body('shippingAddress.city').isString().trim().notEmpty(),
    body('shippingAddress.state').isString().trim().notEmpty(),
    body('shippingAddress.pincode').isString().trim().notEmpty(),
    body('guestEmail').optional().isEmail(),
    body('guestPhone').optional().isString()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { items, shippingAddress, guestEmail, guestPhone } = req.body

      // Fetch products to get prices
      const productIds = items.map((item: { productId: string }) => item.productId)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      })

      // Validate all products exist and are in stock
      for (const item of items) {
        const product = products.find(p => p.id === item.productId)
        if (!product) {
          return res.status(400).json({ error: `Product ${item.productId} not found` })
        }
        if (!product.inStock) {
          return res.status(400).json({ error: `Product ${product.name} is out of stock` })
        }
      }

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
        const product = products.find(p => p.id === item.productId)!
        return sum + (product.price * item.quantity)
      }, 0)
      
      const shippingCost = subtotal >= 999 ? 0 : 99 // Free shipping above ₹999
      const total = subtotal + shippingCost

      // Create order with address
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          subtotal,
          shippingCost,
          total,
          guestEmail,
          guestPhone,
          shippingAddress: {
            create: {
              name: shippingAddress.name,
              phone: shippingAddress.phone,
              line1: shippingAddress.line1,
              line2: shippingAddress.line2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              pincode: shippingAddress.pincode
            }
          },
          items: {
            create: items.map((item: { productId: string; quantity: number; size: string }) => {
              const product = products.find(p => p.id === item.productId)!
              return {
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                price: product.price
              }
            })
          }
        },
        include: {
          items: {
            include: { product: true }
          },
          shippingAddress: true
        }
      })

      res.status(201).json(order)
    } catch (error) {
      console.error('Error creating order:', error)
      res.status(500).json({ error: 'Failed to create order' })
    }
  }
)

// Get order by order number
router.get(
  '/track/:orderNumber',
  [param('orderNumber').isString()],
  async (req: Request, res: Response) => {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber: req.params.orderNumber },
        include: {
          items: {
            include: { product: true }
          },
          shippingAddress: true
        }
      })

      if (!order) {
        return res.status(404).json({ error: 'Order not found' })
      }

      res.json(order)
    } catch (error) {
      console.error('Error fetching order:', error)
      res.status(500).json({ error: 'Failed to fetch order' })
    }
  }
)

// Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: { product: true }
        },
        shippingAddress: true
      }
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Update order status (admin)
router.patch(
  '/:id/status',
  [
    param('id').isString(),
    body('status').isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: req.body.status }
      })

      res.json(order)
    } catch (error) {
      console.error('Error updating order status:', error)
      res.status(500).json({ error: 'Failed to update order status' })
    }
  }
)

// Get all orders (admin)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = '20', offset = '0' } = req.query

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        include: {
          items: {
            include: { product: true }
          },
          shippingAddress: true
        }
      }),
      prisma.order.count({ where })
    ])

    res.json({
      orders,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

export default router
