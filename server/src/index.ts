import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import contactRoutes from './routes/contact'
import authRoutes from './routes/auth'
import paymentRoutes from './routes/payment'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'lemonO API is running' })
})

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/payment', paymentRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🍋 lemonO server running on port ${PORT}`)
})
