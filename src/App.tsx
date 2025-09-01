import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from './contexts/ConfigProvider'
import { CartProvider } from './contexts/CartProvider'
import { Navigation } from './components/Layout/Navigation'
import { Footer } from './components/Layout/Footer'
import { CartDrawer } from './components/Cart/CartDrawer'
import { DevConfigSwitcher } from './components/DevConfigSwitcher'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'

function App() {
  console.log('🚀 App component rendering with full SDK integration')
  
  try {
    return (
      <ConfigProvider defaultConfig="default">
        <Router>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:productId" element={<ProductDetail />} />
                </Routes>
              </main>
              
              <Footer />
              <CartDrawer />
              <DevConfigSwitcher />
            </div>
          </CartProvider>
        </Router>
      </ConfigProvider>
    )
  } catch (error) {
    console.error('❌ Error in App:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600">{error?.toString()}</p>
        </div>
      </div>
    )
  }
}

export default App
