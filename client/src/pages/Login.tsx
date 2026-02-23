import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, signup, isLoggedIn } = useAuth()
  
  // Get redirect info from location state
  const from = (location.state as { from?: string })?.from || '/'
  const message = (location.state as { message?: string })?.message
  
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate('/')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    let result
    if (isLogin) {
      result = await login(formData.email, formData.password)
    } else {
      result = await signup(formData.name, formData.email, formData.password)
    }
    
    setIsLoading(false)
    
    if (result.success) {
      navigate(from)
    } else {
      setError(result.error || 'An error occurred')
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    const result = await loginWithGoogle()
    if (result.success) {
      navigate(from)
    } else if (result.error !== 'Cancelled') {
      setError(result.error || 'An error occurred')
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-cream-50">
      <div className="section">
        <div className="max-w-md mx-auto">
          {/* Go Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-charcoal-700 transition-all duration-200 hover:scale-105 mb-6"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="text-3xl font-semibold text-charcoal-700 tracking-tight">
              lemonO
            </Link>
            <p className="mt-3 text-charcoal-400">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
            {message && (
              <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-sm">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-sm">
                {error}
              </p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-cream-100 p-8 md:p-10 rounded-sm">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 border border-cream-300 bg-white text-charcoal-600 font-medium rounded-sm hover:bg-cream-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cream-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-cream-100 text-charcoal-400">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field - only for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal-600 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-cream-300 text-charcoal-700 rounded-sm focus:outline-none focus:border-charcoal-400 transition-colors"
                    placeholder="Your name"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal-600 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-11 bg-white border border-cream-300 text-charcoal-700 rounded-sm focus:outline-none focus:border-charcoal-400 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" size={18} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal-600 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pl-11 pr-11 bg-white border border-cream-300 text-charcoal-700 rounded-sm focus:outline-none focus:border-charcoal-400 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password - only for login */}
              {isLogin && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <p className="mt-8 text-center text-sm text-charcoal-500">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-medium text-charcoal-700 hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-charcoal-400">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="underline hover:text-charcoal-600">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="underline hover:text-charcoal-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
