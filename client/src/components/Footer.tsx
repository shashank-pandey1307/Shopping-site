import { Link } from 'react-router-dom'
import { Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-cream-100 border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-semibold text-charcoal-700 tracking-tight mb-4">
              lemonO
            </h3>
            <p className="text-sm text-charcoal-400 leading-relaxed">
              Unbothered, by design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tees" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  Tees
                </Link>
              </li>
              <li>
                <Link to="/shop?category=new" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal-600 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-charcoal-400 hover:text-charcoal-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-cream-200 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-xs text-charcoal-400">
            © 2025 lemonO. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a 
              href="" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative text-charcoal-400 hover:text-charcoal-600 transition-all duration-200 hover:scale-125 group"
            >
              <Instagram size={18} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal-700 text-cream-50 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Instagram
              </span>
            </a>
            <a 
              href="" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative text-charcoal-400 hover:text-charcoal-600 transition-all duration-200 hover:scale-125 group"
            >
              <Twitter size={18} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal-700 text-cream-50 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Twitter
              </span>
            </a>
          </div>

          {/* Contact Email */}
          <a 
            href="mailto:hello@lemono.in" 
            className="text-xs text-charcoal-400 hover:text-charcoal-600 transition-colors"
          >
            hello@lemono.in
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
