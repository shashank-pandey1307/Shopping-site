import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import prisma from '../lib/prisma'

const router = Router()

// Submit contact message
router.post(
  '/',
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').isString().trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, message } = req.body

      const contactMessage = await prisma.contactMessage.create({
        data: { name, email, message }
      })

      res.status(201).json({
        message: 'Thank you for reaching out! We\'ll get back to you soon.',
        id: contactMessage.id
      })
    } catch (error) {
      console.error('Error saving contact message:', error)
      res.status(500).json({ error: 'Failed to submit message' })
    }
  }
)

// Subscribe to newsletter
router.post(
  '/newsletter',
  [body('email').isEmail().withMessage('Valid email is required')],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email } = req.body

      // Check if already subscribed
      const existing = await prisma.newsletterSubscription.findUnique({
        where: { email }
      })

      if (existing) {
        if (existing.active) {
          return res.json({ message: 'You\'re already subscribed!' })
        } else {
          // Reactivate subscription
          await prisma.newsletterSubscription.update({
            where: { email },
            data: { active: true }
          })
          return res.json({ message: 'Welcome back! Your subscription has been reactivated.' })
        }
      }

      await prisma.newsletterSubscription.create({
        data: { email }
      })

      res.status(201).json({ message: 'Thanks for subscribing!' })
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      res.status(500).json({ error: 'Failed to subscribe' })
    }
  }
)

// Get all contact messages (admin)
router.get('/messages', async (req: Request, res: Response) => {
  try {
    const { read, limit = '20', offset = '0' } = req.query

    const where: Record<string, unknown> = {}
    if (read !== undefined) where.read = read === 'true'

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.contactMessage.count({ where })
    ])

    res.json({
      messages,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Mark message as read (admin)
router.patch('/messages/:id/read', async (req: Request, res: Response) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true }
    })

    res.json(message)
  } catch (error) {
    console.error('Error marking message as read:', error)
    res.status(500).json({ error: 'Failed to update message' })
  }
})

export default router
