export interface Product {
  id: string
  name: string
  description: string
  price: number
  color: string
  sizes: string[]
  images: string[]
  category: string
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  createdAt: string
  shippingAddress: Address
}

export interface Address {
  name: string
  email: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}
