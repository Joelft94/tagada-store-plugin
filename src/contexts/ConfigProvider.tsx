import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useConfig } from '../hooks/useConfig'
import type { Config } from '../types/config'

interface ConfigContextValue {
  config: Config | null
  loading: boolean
  error: string | null
  configName: string | null
  loadConfig: (configName: string) => Promise<void>
  reloadConfig: () => Promise<void>
  resetToDefault: () => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

interface ConfigProviderProps {
  children: ReactNode
  defaultConfig?: string
}

export function ConfigProvider({ children, defaultConfig = 'skincare-demo' }: ConfigProviderProps) {
  const configState = useConfig(defaultConfig)
  
  // Apply brand colors to CSS custom properties when config loads
  useEffect(() => {
    if (configState.config?.brand?.colors) {
      const { colors } = configState.config.brand
      const root = document.documentElement
      
      // Apply colors as CSS custom properties
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-secondary', colors.secondary)
      if (colors.accent) root.style.setProperty('--color-accent', colors.accent)
      if (colors.background) root.style.setProperty('--color-background', colors.background)
      if (colors.text) root.style.setProperty('--color-text', colors.text)
    }
  }, [configState.config?.brand?.colors])
  
  // Apply SEO metadata when config loads
  useEffect(() => {
    if (configState.config?.seo) {
      const { seo } = configState.config
      
      // Update document title
      document.title = seo.title
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', seo.description)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = seo.description
        document.head.appendChild(meta)
      }
      
      // Update keywords if provided
      if (seo.keywords && seo.keywords.length > 0) {
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        const keywordsContent = seo.keywords.join(', ')
        
        if (metaKeywords) {
          metaKeywords.setAttribute('content', keywordsContent)
        } else {
          const meta = document.createElement('meta')
          meta.name = 'keywords'
          meta.content = keywordsContent
          document.head.appendChild(meta)
        }
      }
      
      // Update Open Graph tags
      if (seo.ogImage) {
        const ogImage = document.querySelector('meta[property="og:image"]')
        if (ogImage) {
          ogImage.setAttribute('content', seo.ogImage)
        } else {
          const meta = document.createElement('meta')
          meta.setAttribute('property', 'og:image')
          meta.content = seo.ogImage
          document.head.appendChild(meta)
        }
      }
    }
  }, [configState.config?.seo])
  
  return (
    <ConfigContext.Provider value={configState}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfigContext(): ConfigContextValue {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider')
  }
  return context
}

// Convenience hooks for specific config sections
export function useBrandContext() {
  const { config } = useConfigContext()
  return config?.brand
}

export function useStoreContext() {
  const { config } = useConfigContext()
  return config?.store
}

export function useSeoContext() {
  const { config } = useConfigContext()
  return config?.seo
}

export function useNavigationContext() {
  const { config } = useConfigContext()
  return config?.navigation
}

export function useFooterContext() {
  const { config } = useConfigContext()
  return config?.footer
}

export function useSectionsContext() {
  const { config } = useConfigContext()
  return config?.sections || []
}

export function useFeaturesContext() {
  const { config } = useConfigContext()
  return config?.features
}