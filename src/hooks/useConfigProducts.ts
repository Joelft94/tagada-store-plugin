import { useMemo } from 'react'
import { useConfig } from './useConfig'
import { useProducts } from './useProducts'

/**
 * Hook that combines config-driven product selection with product data
 * This bridges the gap until we have real Tagada store integration
 */
export const useConfigProducts = () => {
  const { config } = useConfig()
  const { products: allProducts, loading, error, refetch } = useProducts()

  // Extract product IDs from simplified config structure
  const configProductIds = useMemo(() => {
    // Get products from config.products.productIds array
    if (config?.products?.productIds && config.products.productIds.length > 0) {
      return config.products.productIds
    }

    // Fallback to mock product IDs if config doesn't specify any
    return ['prod_vitamin_c_serum', 'prod_hyaluronic_moisturizer', 'prod_gentle_cleanser']
  }, [config])

  // Filter products based on config
  const configProducts = useMemo(() => {
    if (!allProducts.length) return []
    
    return allProducts.filter(product => 
      configProductIds.includes(product.id)
    )
  }, [allProducts, configProductIds])

  // Get featured products (first 3 products from config)
  const featuredProducts = useMemo(() => {
    if (!allProducts.length || !configProductIds.length) return []
    
    // Take first 3 products as featured
    const featuredIds = configProductIds.slice(0, 3)
    return allProducts.filter(product => featuredIds.includes(product.id))
  }, [allProducts, configProductIds])

  return {
    products: configProducts,
    featuredProducts,
    configProductIds,
    loading,
    error,
    refetch
  }
}

/**
 * Get products by category
 */
export const useConfigProductsByCategory = (categoryId: string) => {
  const { products: allProducts, loading, error } = useProducts()

  const categoryProducts = useMemo(() => {
    // Filter products by category
    return allProducts.filter(product => product.category === categoryId)
  }, [allProducts, categoryId])

  return {
    products: categoryProducts,
    loading,
    error
  }
}