import { useState, useEffect, useCallback } from 'react'
import type { Config } from '../types/config'
import { validateConfig, DEFAULT_CONFIG } from '../types/config'

interface ConfigState {
  config: Config | null
  loading: boolean
  error: string | null
  configName: string | null
}

interface UseConfigReturn extends ConfigState {
  loadConfig: (configName: string) => Promise<void>
  reloadConfig: () => Promise<void>
  resetToDefault: () => void
}

// In-memory config cache for development
const configCache = new Map<string, Config>()

export const useConfig = (defaultConfigName?: string): UseConfigReturn => {
  const [state, setState] = useState<ConfigState>({
    config: null,
    loading: false,
    error: null,
    configName: null
  })

  const loadConfigFromFile = useCallback(async (configName: string): Promise<Config> => {
    // Check cache first
    if (configCache.has(configName)) {
      return configCache.get(configName)!
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // For demo purposes, return default config
      // In production, this would be: const response = await fetch(configPath)
      let configData: Config
      
      if (configName === 'skincare-demo') {
        // Demo configuration for skincare store
        configData = {
          ...DEFAULT_CONFIG,
          name: 'Skincare Demo Store',
          brand: {
            name: 'Pure Glow Skincare',
            colors: {
              primary: '#10B981',
              secondary: '#3B82F6',
              accent: '#F59E0B',
              background: '#FFFFFF',
              text: '#111827'
            }
          },
          store: {
            storeId: 'store_skincare_demo',
            accountId: 'acc_47a93cc912de',
            environment: 'development',
            currency: 'USD',
            locale: 'en-US'
          },
          seo: {
            title: 'Pure Glow Skincare - Transform Your Skin Naturally',
            description: 'Discover premium, natural skincare products that deliver real results. Shop serums, moisturizers, and treatments for radiant, healthy skin.'
          },
          sections: [
            {
              id: 'hero',
              type: 'hero',
              title: 'Radiant Skin Starts Here',
              subtitle: 'Premium Natural Skincare',
              description: 'Transform your skincare routine with our carefully curated collection of natural, effective products.',
              order: 1,
              visible: true,
              cta: {
                text: 'Shop Now',
                url: '/products',
                primary: true
              }
            },
            {
              id: 'featured-products',
              type: 'products',
              title: 'Bestselling Products',
              subtitle: 'Loved by thousands',
              description: 'Our most popular skincare essentials for every skin type.',
              order: 2,
              visible: true
            },
            {
              id: 'features',
              type: 'features',
              title: 'Why Choose Pure Glow?',
              subtitle: 'Quality you can trust',
              order: 3,
              visible: true
            }
          ]
        }
      } else {
        // For other configs, use default
        configData = DEFAULT_CONFIG
      }
      
      // Validate the configuration
      const validatedConfig = validateConfig(configData)
      
      // Cache the validated config
      configCache.set(configName, validatedConfig)
      
      return validatedConfig
    } catch (error) {
      throw new Error(`Failed to load config '${configName}': ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [])

  const loadConfig = useCallback(async (configName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const config = await loadConfigFromFile(configName)
      setState({
        config,
        loading: false,
        error: null,
        configName
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load configuration'
      }))
    }
  }, [loadConfigFromFile])

  const reloadConfig = useCallback(async () => {
    if (!state.configName) return
    
    // Clear cache for current config to force reload
    configCache.delete(state.configName)
    await loadConfig(state.configName)
  }, [state.configName, loadConfig])

  const resetToDefault = useCallback(() => {
    setState({
      config: DEFAULT_CONFIG,
      loading: false,
      error: null,
      configName: 'default'
    })
  }, [])

  // Load default config on mount
  useEffect(() => {
    if (defaultConfigName) {
      loadConfig(defaultConfigName)
    } else {
      resetToDefault()
    }
  }, [defaultConfigName, loadConfig, resetToDefault])

  return {
    ...state,
    loadConfig,
    reloadConfig,
    resetToDefault
  }
}

// Helper hook for accessing specific config sections
export const useBrandConfig = () => {
  const { config } = useConfig()
  return config?.brand || DEFAULT_CONFIG.brand
}

export const useStoreConfig = () => {
  const { config } = useConfig()
  return config?.store || DEFAULT_CONFIG.store
}

export const useSeoConfig = () => {
  const { config } = useConfig()
  return config?.seo || DEFAULT_CONFIG.seo
}

export const useNavigationConfig = () => {
  const { config } = useConfig()
  return config?.navigation || DEFAULT_CONFIG.navigation
}

export const useFooterConfig = () => {
  const { config } = useConfig()
  return config?.footer || DEFAULT_CONFIG.footer
}

export const useSectionsConfig = () => {
  const { config } = useConfig()
  return config?.sections || DEFAULT_CONFIG.sections
}