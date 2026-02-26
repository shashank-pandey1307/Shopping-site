import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const router = Router()
const prisma = new PrismaClient()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: 'email'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    res.status(201).json({ user, message: 'Account created successfully' })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to create account' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if (!user.password) {
      return res.status(401).json({ error: 'Please login with Google' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

router.post('/google', async (req, res) => {
  try {
    const { name, email } = req.body

    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          provider: 'google'
        }
      })
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Google login error:', error)
    res.status(500).json({ error: 'Failed to login with Google' })
  }
})

router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

router.get('/orders/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json(orders)
  } catch (error) {
    console.error('Orders error:', error)
    res.status(500).json({ error: 'Failed to get orders' })
  }
})

router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        user: false
      }
    })

    const productIds = favorites.map(f => f.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    res.json(products)
  } catch (error) {
    console.error('Favorites error:', error)
    res.status(500).json({ error: 'Failed to get favorites' })
  }
})

router.post('/favorites', async (req, res) => {
  try {
    const { userId, productId } = req.body

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        productId
      }
    })

    res.status(201).json(favorite)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Already in favorites' })
    }
    console.error('Add favorite error:', error)
    res.status(500).json({ error: 'Failed to add to favorites' })
  }
})

router.delete('/favorites/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params

    await prisma.favorite.deleteMany({
      where: {
        userId,
        productId
      }
    })

    res.json({ message: 'Removed from favorites' })
  } catch (error) {
    console.error('Remove favorite error:', error)
    res.status(500).json({ error: 'Failed to remove from favorites' })
  }
})

export default router
