import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Droplets,
  Shield,
  Clock,
  Sparkles,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react";
import { useCartContext } from "../contexts/CartProvider";

export function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { addItem, openCart } = useCartContext();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    setIsVisible(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickAdd = () => {
    addItem({
      productId: "hydrating-serum",
      variantId: "30ml",
      priceId: "price_hydrating_serum_30ml", // Will be actual Tagada priceId
      name: "Hydrating Botanical Serum",
      price: 89.99,
      originalPrice: 109.99,
      image: "/images/hero-products.jpg",
      category: "face-care",
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative hero-background min-h-screen flex items-center pt-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/40 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-primary/30 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="space-y-6">
                <p className="text-primary text-sm uppercase tracking-wider font-medium">
                  Premium Australian Skincare
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight">
                  Celebrating
                  <br />
                  <span className="text-primary relative">
                    Australian Nature
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3"
                      viewBox="0 0 300 12"
                      fill="none"
                    >
                      <path
                        d="M0 6C50 2 100 10 150 6C200 2 250 10 300 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-draw"
                      />
                    </svg>
                  </span>
                </h1>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Discover our range of premium skincare products crafted with
                native Australian botanicals for radiant, healthy skin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary group">
                  SEE HYDRATING RANGE
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <button onClick={handleQuickAdd} className="btn-secondary">
                  TRY SAMPLE
                </button>
              </div>
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Trusted by 10,000+ customers
                </p>
              </div>
            </div>

            <div
              className={`relative transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="relative group">
                <div className="aspect-square overflow-hidden rounded-3xl shadow-primary-lg">
                  <img
                    src="/images/hero-products.jpg"
                    alt="Premium skincare products with pink flowers and facial tools"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="floating-element -top-4 -right-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <div className="floating-element -bottom-4 -left-4 animation-delay-500">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Natural skincare with scientifically proven results
            </h2>
            <p className="section-subtitle">
              Harness the power of Australian botanicals with our carefully
              formulated products.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { icon: Shield, title: "NO NASTY\nCHEMICALS", delay: "0ms" },
              { icon: Leaf, title: "VEGAN\nINGREDIENTS", delay: "100ms" },
              { icon: Droplets, title: "CRUELTY\nFREE", delay: "200ms" },
              { icon: Clock, title: "FAST\nDELIVERY", delay: "300ms" },
              { icon: Sparkles, title: "CLINICALLY\nTESTED", delay: "400ms" },
              { icon: Heart, title: "MADE WITH\nLOVE", delay: "500ms" },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group"
                style={{ animationDelay: feature.delay }}
              >
                <div className="icon-container">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="feature-text">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-50 to-secondary-50 text-center">
        <Link to="/products" className="inline-flex items-center bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors duration-200 group">
          SHOP NOW
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </section>
    </div>
  );
}
