import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TagadaProvider } from '@tagadapay/plugin-sdk/react'
import './index.css'
import App from './App.tsx'

console.log('🚀 Main.tsx loaded')

// Debug API calls in development (from plugin examples)
if (import.meta.env.DEV) {
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const [url, options] = args;
    console.log("🌐 API Request:", {
      url: typeof url === "string" ? url : url.toString(),
      method: options?.method || "GET",
      timestamp: new Date().toISOString(),
    });

    return originalFetch
      .apply(this, args)
      .then((response) => {
        console.log("✅ API Response:", {
          url: typeof url === "string" ? url : url.toString(),
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          timestamp: new Date().toISOString(),
        });
        return response;
      })
      .catch((error) => {
        console.error("❌ API Error:", {
          url: typeof url === "string" ? url : url.toString(),
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        throw error;
      });
  };
}

try {
  const root = createRoot(document.getElementById('root')!)
  console.log('✅ Root created')
  
  root.render(
    <StrictMode>
      <TagadaProvider 
        environment="production" 
        localConfig="default"
        debugMode={true}
        blockUntilSessionReady={true}
      >
        <App />
      </TagadaProvider>
    </StrictMode>,
  )
  console.log('✅ App with TagadaProvider rendered')
  console.log('  - Environment: development')
  console.log('  - LocalConfig: default')
  console.log('  - DebugMode: true')
} catch (error) {
  console.error('❌ Error in main.tsx:', error)
}
