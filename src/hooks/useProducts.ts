import { useState, useEffect, useCallback } from 'react'
// import { useProducts as useTagadaProducts } from '@tagadapay/plugin-sdk'

// Product interfaces based on Tagada SDK structure
export interface Product {
  id: string
  name: string
  description: string
  category: string
  images: string[]
  variants: ProductVariant[]
  brand?: string
  tags?: string[]
  rating?: number
  reviewCount?: number
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  description?: string
  sku?: string
  prices: ProductPrice[]
  inventory?: {
    quantity: number
    available: boolean
  }
  attributes?: Record<string, string> // size, color, etc.
}

export interface ProductPrice {
  id: string
  amount: number
  currency: string
  originalAmount?: number
  type: 'one-time' | 'recurring'
  interval?: 'monthly' | 'yearly'
}

interface UseProductsOptions {
  productIds?: string[]
  categoryId?: string
  featured?: boolean
  limit?: number
  offset?: number
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  totalCount: number
  hasMore: boolean
  refetch: () => Promise<void>
}

// Mock data for skincare products
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_vitamin_c_serum',
    name: 'Vitamin C Brightening Serum',
    description: 'A powerful antioxidant serum that brightens skin and reduces dark spots with 20% Vitamin C and hyaluronic acid.',
    category: 'serums',
    images: ['/images/hero-products.jpg', '/images/product-flat-lay.jpg'],
    variants: [
      {
        id: 'var_30ml',
        name: '30ml',
        description: 'Perfect size for daily use',
        sku: 'VCS-30ML',
        prices: [
          {
            id: 'price_usd_4500',
            amount: 4500, // $45.00 in cents
            currency: 'USD',
            originalAmount: 5000,
            type: 'one-time'
          }
        ],
        inventory: {
          quantity: 50,
          available: true
        },
        attributes: {
          size: '30ml',
          concentration: '20%'
        }
      }
    ],
    brand: 'Pure Glow',
    tags: ['vitamin-c', 'brightening', 'antioxidant', 'anti-aging'],
    rating: 4.8,
    reviewCount: 324,
    featured: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'prod_hyaluronic_moisturizer',
    name: 'Hyaluronic Acid Moisturizer',
    description: 'Ultra-hydrating moisturizer with multiple types of hyaluronic acid for plump, dewy skin.',
    category: 'moisturizers',
    images: ['/images/luxury-collection.jpg', '/images/modern-skincare.jpg'],
    variants: [
      {
        id: 'var_50ml',
        name: '50ml',
        description: 'Standard size',
        sku: 'HAM-50ML',
        prices: [
          {
            id: 'price_usd_3200',
            amount: 3200,
            currency: 'USD',
            type: 'one-time'
          }
        ],
        inventory: {
          quantity: 75,
          available: true
        },
        attributes: {
          size: '50ml',
          type: 'day/night'
        }
      }
    ],
    brand: 'Pure Glow',
    tags: ['hyaluronic-acid', 'hydrating', 'moisturizer', 'plumping'],
    rating: 4.6,
    reviewCount: 189,
    featured: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'prod_gentle_cleanser',
    name: 'Gentle Foam Cleanser',
    description: 'A mild, pH-balanced cleanser that removes impurities without stripping the skin barrier.',
    category: 'cleansers',
    images: ['/images/pink-collection.jpg', '/images/hero-products.jpg'],
    variants: [
      {
        id: 'var_150ml',
        name: '150ml',
        description: 'Pump bottle',
        sku: 'GFC-150ML',
        prices: [
          {
            id: 'price_usd_2400',
            amount: 2400,
            currency: 'USD',
            type: 'one-time'
          }
        ],
        inventory: {
          quantity: 100,
          available: true
        },
        attributes: {
          size: '150ml',
          'pH-level': '5.5'
        }
      }
    ],
    brand: 'Pure Glow',
    tags: ['cleanser', 'gentle', 'sensitive-skin', 'pH-balanced'],
    rating: 4.4,
    reviewCount: 156,
    featured: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'prod_retinol_treatment',
    name: 'Retinol Renewal Treatment',
    description: 'Advanced retinol formula for anti-aging with bakuchiol for sensitive skin compatibility.',
    category: 'treatments',
    images: ['/images/modern-skincare.jpg', '/images/luxury-collection.jpg'],
    variants: [
      {
        id: 'var_30ml',
        name: '30ml',
        description: 'Airless pump bottle',
        sku: 'RRT-30ML',
        prices: [
          {
            id: 'price_usd_5500',
            amount: 5500,
            currency: 'USD',
            type: 'one-time'
          }
        ],
        inventory: {
          quantity: 30,
          available: true
        },
        attributes: {
          size: '30ml',
          concentration: '0.5%'
        }
      }
    ],
    brand: 'Pure Glow',
    tags: ['retinol', 'anti-aging', 'renewal', 'bakuchiol'],
    rating: 4.7,
    reviewCount: 89,
    featured: false,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: 'prod_niacinamide_serum',
    name: 'Niacinamide Pore Refining Serum',
    description: '10% niacinamide serum that minimizes pores and controls oil production.',
    category: 'serums',
    images: ['/images/product-flat-lay.jpg', '/images/pink-collection.jpg'],
    variants: [
      {
        id: 'var_30ml',
        name: '30ml',
        description: 'Dropper bottle',
        sku: 'NPS-30ML',
        prices: [
          {
            id: 'price_usd_2800',
            amount: 2800,
            currency: 'USD',
            type: 'one-time'
          }
        ],
        inventory: {
          quantity: 60,
          available: true
        },
        attributes: {
          size: '30ml',
          concentration: '10%'
        }
      }
    ],
    brand: 'Pure Glow',
    tags: ['niacinamide', 'pore-minimizing', 'oil-control', 'serum'],
    rating: 4.5,
    reviewCount: 203,
    featured: false,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'prod_sunscreen_spf50',
    name: 'Mineral Sunscreen SPF 50',
    description: 'Broad-spectrum mineral sunscreen with zinc oxide and titanium dioxide.',
    category: 'treatments',
    images: ['/images/hero-products.jpg', '/images/luxury-collection.jpg'],
    variants: [
      {
        id: 'var_60ml',
        name: '60ml',
        description: 'Tube packaging',
        sku: 'MSS-60ML',
        prices: [
          {
            id: 'price_usd_3500',
            amount: 3500,
            currency: 'USD',
            type: 'one-time'
          }
        ],
        inventory: {
          quantity: 40,
          available: true
        },
        attributes: {
          size: '60ml',
          spf: '50+',
          type: 'mineral'
        }
      }
    ],
    brand: 'Pure Glow',
    tags: ['sunscreen', 'mineral', 'broad-spectrum', 'spf-50'],
    rating: 4.3,
    reviewCount: 127,
    featured: false,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  }
]

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  // TODO: Integrate real Tagada SDK when import issues are resolved
  // const tagadaResult = useTagadaProducts({
  //   productIds: options.productIds,
  // })

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay for development
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredProducts = [...MOCK_PRODUCTS]

      // Filter by product IDs
      if (options.productIds && options.productIds.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          options.productIds!.includes(product.id)
        )
      }

      // Filter by category
      if (options.categoryId) {
        filteredProducts = filteredProducts.filter(product => 
          product.category === options.categoryId
        )
      }

      // Filter by featured
      if (options.featured !== undefined) {
        filteredProducts = filteredProducts.filter(product => 
          product.featured === options.featured
        )
      }

      // Apply pagination
      const offset = options.offset || 0
      const limit = options.limit || filteredProducts.length
      const paginatedProducts = filteredProducts.slice(offset, offset + limit)

      setProducts(paginatedProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [options.productIds, options.categoryId, options.featured, options.limit, options.offset])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const totalCount = MOCK_PRODUCTS.length
  const hasMore = (options.offset || 0) + products.length < totalCount

  return {
    products,
    loading,
    error,
    totalCount,
    hasMore,
    refetch: fetchProducts
  }
}

// Helper hook to get a single product by ID
export const useProduct = (productId: string) => {
  const { products, loading, error, refetch } = useProducts({ productIds: [productId] })
  
  return {
    product: products[0] || null,
    loading,
    error,
    refetch
  }
}

// Helper hook to get featured products
export const useFeaturedProducts = (limit?: number) => {
  return useProducts({ featured: true, limit })
}

// Helper hook to get products by category
export const useProductsByCategory = (categoryId: string, limit?: number) => {
  return useProducts({ categoryId, limit })
}