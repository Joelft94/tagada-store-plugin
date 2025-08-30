import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useCartContext } from '../../contexts/CartProvider'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { itemCount, toggleCart } = useCartContext()

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-teal-100 transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-2xl font-light text-gray-800 hover:text-teal-500 transition-colors duration-300"
          >
            Olea
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
            <Link
              to="/"
              className={`hover:text-teal-500 transition-colors duration-300 relative group ${
                location.pathname === '/' ? 'text-teal-500' : ''
              }`}
            >
              HOME
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/products"
              className={`hover:text-teal-500 transition-colors duration-300 relative group ${
                location.pathname.startsWith('/products') ? 'text-teal-500' : ''
              }`}
            >
              PRODUCTS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <a href="#contact" className="hover:text-teal-500 transition-colors duration-300 relative group">
              CONTACT
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <a href="#search" className="hover:text-teal-500 transition-colors duration-300 hidden sm:block">
              SEARCH
            </a>
            <button 
              onClick={toggleCart}
              className="hover:text-teal-500 transition-colors duration-300 relative flex items-center space-x-1"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>CART ({itemCount})</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              )}
            </button>

            <button
              className="md:hidden text-gray-600 hover:text-teal-500 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-teal-100 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col space-y-4 text-sm text-gray-600">
              <Link
                to="/"
                className="hover:text-teal-500 transition-colors duration-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link
                to="/products"
                className="hover:text-teal-500 transition-colors duration-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                PRODUCTS
              </Link>
              <a href="#contact" className="hover:text-teal-500 transition-colors duration-300 py-2">
                CONTACT
              </a>
              <a href="#search" className="hover:text-teal-500 transition-colors duration-300 py-2">
                SEARCH
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}