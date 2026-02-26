import { Router, Request, Response } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import prisma from '../lib/prisma'

const router = Router()

router.get(
  '/',,
  [
    query('category').optional().isString(),
    query('color').optional().isString(),
    query('inStock').optional().isBoolean(),
    query('sort').optional().isIn(['price_asc', 'price_desc', 'newest']),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { category, color, inStock, sort, limit = '12', offset = '0' } = req.query

      const where: Record<string, unknown> = {}
      if (category) where.category = category
      if (color) where.color = color
      if (inStock !== undefined) where.inStock = inStock === 'true'

      let orderBy: Record<string, string> = { createdAt: 'desc' }
      if (sort === 'price_asc') orderBy = { price: 'asc' }
      else if (sort === 'price_desc') orderBy = { price: 'desc' }
      else if (sort === 'newest') orderBy = { createdAt: 'desc' }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          take: parseInt(limit as string),
          skip: parseInt(offset as string)
        }),
        prisma.product.count({ where })
      ])

      res.json({
        products,
        pagination: {
          total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      res.status(500).json({ error: 'Failed to fetch products' })
    }
  }
)

router.get(
  '/:id',
  [param('id').isString()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const product = await prisma.product.findUnique({
        where: { id: req.params.id }
      })

      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      res.json(product)
    } catch (error) {
      console.error('Error fetching product:', error)
      res.status(500).json({ error: 'Failed to fetch product' })
    }
  }
)

router.post(
  '/',
  [
    body('name').isString().trim().notEmpty(),
    body('description').isString().trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('color').isString().trim().notEmpty(),
    body('sizes').isArray(),
    body('images').isArray(),
    body('category').isString().trim().notEmpty(),
    body('inStock').optional().isBoolean()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, description, price, color, sizes, images, category, inStock = true } = req.body

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          color,
          sizes,
          images,
          category,
          inStock
        }
      })

      res.status(201).json(product)
    } catch (error) {
      console.error('Error creating product:', error)
      res.status(500).json({ error: 'Failed to create product' })
    }
  }
)

router.put(
  '/:id',
  [
    param('id').isString(),
    body('name').optional().isString().trim(),
    body('description').optional().isString().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('color').optional().isString().trim(),
    body('sizes').optional().isArray(),
    body('images').optional().isArray(),
    body('category').optional().isString().trim(),
    body('inStock').optional().isBoolean()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data: req.body
      })

      res.json(product)
    } catch (error) {
      console.error('Error updating product:', error)
      res.status(500).json({ error: 'Failed to update product' })
    }
  }
)

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router
