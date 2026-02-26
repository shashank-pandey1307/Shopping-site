import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    name: 'Essential Oversized Tee',
    description: 'Our signature oversized tee crafted from 100% premium combed cotton. Features a relaxed drop shoulder design that drapes naturally without looking baggy. Perfect for everyday wear.',
    price: 1299,
    color: 'off-white',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    name: 'Calm Fit Drop Shoulder',
    description: 'Relaxed drop shoulder with minimalist design. Made from soft cotton that feels like a cloud against your skin.',
    price: 1499,
    color: 'sage green',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    name: 'Unbothered Classic',
    description: 'Classic oversized fit in neutral tones. For days when you don\'t want to explain yourself.',
    price: 1199,
    color: 'charcoal',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    name: 'Minimal Motion Tee',
    description: 'Soft cotton with subtle texture detail. Movement meets comfort in this everyday essential.',
    price: 1399,
    color: 'cream',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    name: 'Earth Tone Essential',
    description: 'Warm earth tones for a grounded look. Premium cotton that gets softer with every wash.',
    price: 1349,
    color: 'sand',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'],
    category: 'tees',
    inStock: true
  },
  {
    name: 'Low-Key Comfort Tee',
    description: 'Ultimate comfort for low-key days. When being chill is the entire mood.',
    price: 1249,
    color: 'stone grey',
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'],
    category: 'tees',
    inStock: true
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.product.deleteMany()
  console.log('Cleared existing products')

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
    console.log(`Created product: ${product.name}`)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
