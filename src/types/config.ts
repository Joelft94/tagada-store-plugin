// Configuration schema for Tagada skincare plugin
import { z } from 'zod'

// Brand configuration
const BrandConfigSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color').optional(),
    background: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color').optional(),
    text: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color').optional()
  }),
  fonts: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional()
  }).optional()
})

// SEO configuration
const SeoConfigSchema = z.object({
  title: z.string().min(1, 'Page title is required'),
  description: z.string().min(1, 'Page description is required'),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().url().optional(),
  canonical: z.string().url().optional()
})

// Product configuration for featured/hero sections
const FeaturedProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  priceId: z.string().min(1, 'Price ID is required'),
  featured: z.boolean().optional(),
  hero: z.boolean().optional(),
  badge: z.string().optional() // "New", "Best Seller", "Sale", etc.
})

// Content sections configuration
const ContentSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  type: z.enum(['hero', 'features', 'products', 'testimonials', 'cta', 'text']),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  cta: z.object({
    text: z.string(),
    url: z.string(),
    primary: z.boolean().optional()
  }).optional(),
  products: z.array(FeaturedProductSchema).optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    text: z.string(),
    rating: z.number().min(1).max(5).optional(),
    image: z.string().url().optional()
  })).optional(),
  visible: z.boolean().default(true),
  order: z.number().optional()
})

// Navigation configuration
const NavigationSchema = z.object({
  logo: z.object({
    text: z.string().optional(),
    image: z.string().url().optional()
  }),
  links: z.array(z.object({
    label: z.string().min(1, 'Link label is required'),
    url: z.string().min(1, 'Link URL is required'),
    external: z.boolean().optional()
  })),
  cta: z.object({
    text: z.string(),
    url: z.string()
  }).optional()
})

// Footer configuration
const FooterSchema = z.object({
  company: z.object({
    name: z.string(),
    description: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional()
  }),
  links: z.array(z.object({
    title: z.string(),
    links: z.array(z.object({
      label: z.string(),
      url: z.string()
    }))
  })).optional(),
  social: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    icon: z.string().optional()
  })).optional(),
  copyright: z.string().optional()
})

// Store configuration for Tagada integration
const StoreConfigSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  accountId: z.string().min(1, 'Account ID is required'),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  currency: z.string().default('USD'),
  locale: z.string().default('en-US'),
  promotions: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    active: z.boolean().default(true)
  })).optional()
})

// Main configuration schema
export const ConfigSchema = z.object({
  version: z.string().default('1.0.0'),
  name: z.string().min(1, 'Configuration name is required'),
  description: z.string().optional(),
  
  // Core configurations
  brand: BrandConfigSchema,
  store: StoreConfigSchema,
  seo: SeoConfigSchema,
  
  // Layout configurations
  navigation: NavigationSchema,
  footer: FooterSchema,
  
  // Content configuration
  sections: z.array(ContentSectionSchema),
  
  // Product configuration
  products: z.object({
    featured: z.array(FeaturedProductSchema).optional(),
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      image: z.string().url().optional()
    })).optional(),
    filters: z.object({
      price: z.boolean().default(true),
      category: z.boolean().default(true),
      rating: z.boolean().default(false),
      availability: z.boolean().default(true)
    }).optional()
  }).optional(),
  
  // Feature flags
  features: z.object({
    cart: z.boolean().default(true),
    checkout: z.boolean().default(true),
    wishlist: z.boolean().default(false),
    reviews: z.boolean().default(false),
    search: z.boolean().default(true),
    filters: z.boolean().default(true),
    recommendations: z.boolean().default(false)
  }).optional(),
  
  // Analytics and tracking
  analytics: z.object({
    googleAnalytics: z.string().optional(),
    facebookPixel: z.string().optional(),
    hotjar: z.string().optional(),
    customScripts: z.array(z.string()).optional()
  }).optional()
})

// Export types
export type Config = z.infer<typeof ConfigSchema>
export type BrandConfig = z.infer<typeof BrandConfigSchema>
export type SeoConfig = z.infer<typeof SeoConfigSchema>
export type StoreConfig = z.infer<typeof StoreConfigSchema>
export type ContentSection = z.infer<typeof ContentSectionSchema>
export type FeaturedProduct = z.infer<typeof FeaturedProductSchema>
export type NavigationConfig = z.infer<typeof NavigationSchema>
export type FooterConfig = z.infer<typeof FooterSchema>

// Configuration validation helper
export const validateConfig = (config: unknown): Config => {
  try {
    return ConfigSchema.parse(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Configuration validation failed: ${error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`)
    }
    throw error
  }
}

// Default configuration template
export const DEFAULT_CONFIG: Config = {
  version: '1.0.0',
  name: 'Default Skincare Store',
  description: 'A beautiful skincare store powered by Tagada',
  
  brand: {
    name: 'Glow Essentials',
    colors: {
      primary: '#14B8A6',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#111827'
    }
  },
  
  store: {
    storeId: 'store_demo_skincare',
    accountId: 'acc_47a93cc912de',
    environment: 'development',
    currency: 'USD',
    locale: 'en-US'
  },
  
  seo: {
    title: 'Glow Essentials - Premium Skincare Products',
    description: 'Discover premium skincare products that will transform your routine. Natural ingredients, proven results.'
  },
  
  navigation: {
    logo: {
      text: 'Glow Essentials'
    },
    links: [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'About', url: '/about' },
      { label: 'Contact', url: '/contact' }
    ]
  },
  
  footer: {
    company: {
      name: 'Glow Essentials',
      description: 'Premium skincare products for radiant, healthy skin.',
      email: 'hello@glow-essentials.com'
    }
  },
  
  sections: [
    {
      id: 'hero',
      type: 'hero',
      title: 'Transform Your Skin',
      subtitle: 'Premium Skincare Products',
      description: 'Discover our curated collection of natural skincare products designed to give you the glowing skin you deserve.',
      order: 1,
      visible: true
    },
    {
      id: 'featured-products',
      type: 'products',
      title: 'Featured Products',
      subtitle: 'Our bestsellers',
      order: 2,
      visible: true
    }
  ]
}