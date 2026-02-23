import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const API_URL = 'http://localhost:5000/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  favorites: string[]
  addToFavorites: (productId: string) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lemono_user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      loadFavorites(parsedUser.id)
    }
    setIsLoading(false)
  }, [])

  // Load user's favorites
  const loadFavorites = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/favorites/${userId}`)
      if (response.ok) {
        const products = await response.json()
        setFavorites(products.map((p: { id: string }) => p.id))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      localStorage.setItem('lemono_user', JSON.stringify(data.user))
      loadFavorites(data.user.id)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // For demo, simulate Google OAuth by prompting for email
      const email = prompt('Enter your Google email:')
      if (!email) return { success: false, error: 'Cancelled' }
      
      const name = email.split('@')[0]
      
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      localStorage.setItem('lemono_user', JSON.stringify(data.user))
      loadFavorites(data.user.id)
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      localStorage.setItem('lemono_user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    setFavorites([])
    localStorage.removeItem('lemono_user')
  }

  const addToFavorites = async (productId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`${API_URL}/auth/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      })

      if (response.ok) {
        setFavorites(prev => [...prev, productId])
      }
    } catch (error) {
      console.error('Add favorite error:', error)
    }
  }

  const removeFromFavorites = async (productId: string) => {
    if (!user) return
    
    try {
      const response = await fetch(`${API_URL}/auth/favorites/${user.id}/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(id => id !== productId))
      }
    } catch (error) {
      console.error('Remove favorite error:', error)
    }
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      login,
      loginWithGoogle,
      signup,
      logout,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
