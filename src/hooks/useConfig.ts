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
      // Attempt to load config file
      const response = await fetch(`/configs/${configName}.tgd.json`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Configuration file '${configName}.tgd.json' not found`)
        }
        throw new Error(`Failed to load configuration: ${response.statusText}`)
      }

      const rawConfig = await response.json()
      const validatedConfig = validateConfig(rawConfig)
      
      // Cache the validated config
      configCache.set(configName, validatedConfig)
      
      return validatedConfig
    } catch (error) {
      // If loading fails, fall back to DEFAULT_CONFIG but still throw for proper error handling
      console.warn(`Failed to load config '${configName}', using default configuration:`, error)
      const defaultConfig = { ...DEFAULT_CONFIG, configName }
      configCache.set(configName, defaultConfig)
      return defaultConfig
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to load configuration'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
    }
  }, [loadConfigFromFile])

  const reloadConfig = useCallback(async () => {
    if (state.configName) {
      // Clear cache to force reload
      configCache.delete(state.configName)
      await loadConfig(state.configName)
    }
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
    if (defaultConfigName && !state.config && !state.loading) {
      loadConfig(defaultConfigName).catch(error => {
        console.error('Failed to load default config:', error)
        // Fall back to DEFAULT_CONFIG
        resetToDefault()
      })
    }
  }, [defaultConfigName, state.config, state.loading, loadConfig, resetToDefault])

  return {
    ...state,
    loadConfig,
    reloadConfig,
    resetToDefault
  }
}

// Development helper for hot-swapping configs
export const switchConfigInDev = (configName: string) => {
  if (import.meta.env.DEV) {
    window.location.search = `?config=${configName}`
    window.location.reload()
  }
}

// Get config name from URL params (for development)
export const getConfigFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('config')
}

// Config validation helper for runtime checks
export const isValidConfig = (config: unknown): config is Config => {
  try {
    validateConfig(config)
    return true
  } catch {
    return false
  }
}