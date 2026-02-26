import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../types'

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, size: string, quantity: number) => void
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (product: Product, size: string, quantity: number) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.size === size
      )

      if (existingIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingIndex].quantity += quantity
        return newItems
      }

      return [...prevItems, { product, size, quantity }]
    })
  }

  const removeFromCart = (productId: string, size: string) => {
    setItems(prevItems => 
      prevItems.filter(item => !(item.product.id === productId && item.size === size))
    )
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
