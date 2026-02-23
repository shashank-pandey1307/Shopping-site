import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingBag, User, LogOut, Heart, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { totalItems } = useCart()
  const { user, isLoggedIn, logout } = useAuth()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream-50/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-charcoal-700 tracking-tight">
            lemonO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              to="/shop" 
              className="text-sm font-medium text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-110"
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-110"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-110"
            >
              Contact
            </Link>
          </div>

          {/* Cart & Profile & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Link 
              to="/cart"
              className="relative p-2 text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-110"
              title="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal-700 text-cream-50 text-xs font-medium rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-9 h-9 bg-charcoal-700 text-cream-50 rounded-full flex items-center justify-center text-sm font-medium hover:bg-charcoal-600 transition-all duration-200 hover:scale-110"
                    title={user?.name || 'Profile'}
                  >
                    {user?.name ? getInitials(user.name) : 'U'}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-cream-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-cream-200">
                        <p className="font-medium text-charcoal-700 truncate">{user?.name}</p>
                        <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
                      </div>
                      <Link 
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-100 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Package size={16} />
                        Order History
                      </Link>
                      <Link 
                        to="/favorites"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-charcoal-600 hover:bg-cream-100 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Heart size={16} />
                        Favorites
                      </Link>
                      <button 
                        onClick={() => {
                          logout()
                          setIsProfileOpen(false)
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="p-2 text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-110"
                  title="Login"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-charcoal-500 hover:text-charcoal-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200">
          <div className="px-6 py-6 space-y-4">
            <Link 
              to="/shop" 
              className="block text-lg font-medium text-charcoal-600 hover:text-charcoal-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="block text-lg font-medium text-charcoal-600 hover:text-charcoal-700"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-lg font-medium text-charcoal-600 hover:text-charcoal-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
