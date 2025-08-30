import { useMemo } from 'react'
import { useConfig } from './useConfig'
import { useProducts } from './useProducts'
import type { Product } from './useProducts'

/**
 * Hook that combines config-driven product selection with product data
 * This bridges the gap until we have real Tagada store integration
 */
export const useConfigProducts = () => {
  const { config } = useConfig()
  const { products: allProducts, loading, error, refetch } = useProducts()

  // Extract product IDs from config sections
  const configProductIds = useMemo(() => {
    const productIds = new Set<string>()

    // Get products from featured products section
    config?.sections?.forEach(section => {
      if (section.type === 'products' && section.products) {
        section.products.forEach(product => {
          if (product.productId) {
            productIds.add(product.productId)
          }
        })
      }
    })

    // Add fallback product IDs if config doesn't specify any
    if (productIds.size === 0) {
      // Use the mock product IDs as fallback
      return ['prod_vitamin_c_serum', 'prod_hyaluronic_moisturizer', 'prod_gentle_cleanser']
    }

    return Array.from(productIds)
  }, [config])

  // Filter products based on config
  const configProducts = useMemo(() => {
    if (!allProducts.length) return []
    
    return allProducts.filter(product => 
      configProductIds.includes(product.id)
    )
  }, [allProducts, configProductIds])

  // Get featured products specifically
  const featuredProducts = useMemo(() => {
    const featuredSection = config?.sections?.find(
      section => section.type === 'products' && section.id === 'featured-products'
    )

    if (!featuredSection?.products) return []

    return featuredSection.products.map(configProduct => {
      const product = allProducts.find(p => p.id === configProduct.productId)
      if (!product) return null

      // Return product with config metadata
      return {
        ...product,
        featured: configProduct.featured || false,
        badge: configProduct.badge,
        selectedVariantId: configProduct.variantId,
        selectedPriceId: configProduct.priceId
      }
    }).filter(Boolean) as (Product & { 
      badge?: string
      selectedVariantId?: string
      selectedPriceId?: string
    })[]
  }, [config, allProducts])

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
 * Get products by category from config
 */
export const useConfigProductsByCategory = (categoryId: string) => {
  const { config } = useConfig()
  const { products: allProducts, loading, error } = useProducts()

  const categoryProducts = useMemo(() => {
    // Get category from config
    const category = config?.products?.categories?.find(cat => cat.id === categoryId)
    if (!category) return []

    // Filter products by category
    return allProducts.filter(product => product.category === categoryId)
  }, [allProducts, categoryId, config])

  return {
    products: categoryProducts,
    loading,
    error,
    category: config?.products?.categories?.find(cat => cat.id === categoryId)
  }
}