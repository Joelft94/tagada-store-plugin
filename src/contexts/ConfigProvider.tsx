import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useConfig } from '../hooks/useConfig'
import type { Config } from '../types/config'
import { getLocalizedContent, getSectionContent } from '../types/config'

interface ConfigContextValue {
  config: Config | null
  loading: boolean
  error: string | null
  configName: string | null
  loadConfig: (configName: string) => Promise<void>
  reloadConfig: () => Promise<void>
  resetToDefault: () => void
  // Helper functions for localized content
  getTagline: (locale?: string) => string
  getSectionText: (sectionKey: string, locale?: string) => string
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

interface ConfigProviderProps {
  children: ReactNode
  defaultConfig?: string
  locale?: string
}

export function ConfigProvider({ 
  children, 
  defaultConfig = 'skincare-demo',
  locale = 'en' 
}: ConfigProviderProps) {
  const configState = useConfig(defaultConfig)
  
  // Apply branding colors to CSS custom properties when config loads
  useEffect(() => {
    if (configState.config?.branding) {
      const { branding } = configState.config
      const root = document.documentElement
      
      // Helper function to lighten/darken hex colors
      const adjustBrightness = (hex: string, percent: number): string => {
        const num = parseInt(hex.replace('#', ''), 16)
        const amt = Math.round(2.55 * percent)
        const R = (num >> 16) + amt
        const G = (num >> 8 & 0x00FF) + amt
        const B = (num & 0x0000FF) + amt
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
          (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
          (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
      }
      
      // Apply primary color and variants
      root.style.setProperty('--color-primary', branding.primaryColor)
      root.style.setProperty('--color-primary-light', adjustBrightness(branding.primaryColor, 20))
      root.style.setProperty('--color-primary-dark', adjustBrightness(branding.primaryColor, -20))
      
      // Apply secondary color and variants if provided
      if (branding.secondaryColor) {
        root.style.setProperty('--color-secondary', branding.secondaryColor)
        root.style.setProperty('--color-secondary-light', adjustBrightness(branding.secondaryColor, 20))
        root.style.setProperty('--color-secondary-dark', adjustBrightness(branding.secondaryColor, -20))
      }
      
      console.log('🎨 Applied dynamic colors:', {
        primary: branding.primaryColor,
        secondary: branding.secondaryColor || 'not set'
      })
    }
  }, [configState.config?.branding])

  // Apply SEO configuration when config loads
  useEffect(() => {
    if (configState.config?.seo) {
      const { seo } = configState.config
      
      // Update document title with localized content
      const title = getLocalizedContent(seo.title, locale)
      if (title) {
        document.title = title
      }
      
      // Update meta description with localized content
      const description = getLocalizedContent(seo.description, locale)
      if (description) {
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', description)
        } else {
          const meta = document.createElement('meta')
          meta.name = 'description'
          meta.content = description
          document.head.appendChild(meta)
        }
      }
      
      // Update Open Graph image
      if (seo.socialImageUrl) {
        const ogImage = document.querySelector('meta[property="og:image"]')
        if (ogImage) {
          ogImage.setAttribute('content', seo.socialImageUrl)
        } else {
          const meta = document.createElement('meta')
          meta.setAttribute('property', 'og:image')
          meta.content = seo.socialImageUrl
          document.head.appendChild(meta)
        }
      }
    }
  }, [configState.config?.seo, locale])

  // Helper functions for localized content
  const getTagline = (currentLocale?: string) => {
    if (!configState.config?.content?.tagline) return ''
    return getLocalizedContent(configState.config.content.tagline, currentLocale || locale)
  }

  const getSectionText = (sectionKey: string, currentLocale?: string) => {
    if (!configState.config?.content?.sections) return ''
    return getSectionContent(configState.config.content.sections, sectionKey, currentLocale || locale)
  }

  const contextValue: ConfigContextValue = {
    ...configState,
    getTagline,
    getSectionText
  }
  
  return (
    <ConfigContext.Provider value={contextValue}>
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
export function useBrandingContext() {
  const { config } = useConfigContext()
  return config?.branding
}

export function useProductIdsContext() {
  const { config } = useConfigContext()
  return config?.productIds
}

export function useContentContext() {
  const { config } = useConfigContext()
  return config?.content
}

export function useAssetsContext() {
  const { config } = useConfigContext()
  return config?.assets
}

export function useSeoContext() {
  const { config } = useConfigContext()
  return config?.seo
}

// Localization helpers
export function useLocalizedContent() {
  const { getTagline, getSectionText } = useConfigContext()
  return { getTagline, getSectionText }
}