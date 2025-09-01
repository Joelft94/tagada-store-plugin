import { useTagadaContext, useProducts } from '@tagadapay/plugin-sdk/react'
import { useConfigProducts } from '../hooks/useConfigProducts'

/**
 * Debug component to display SDK connection info directly on page
 */
export function DebugInfo() {
  const tagadaContext = useTagadaContext()
  const { products: directSDKProducts, isLoading: directLoading, error: directError } = useProducts({
    enabled: tagadaContext.isSessionInitialized,
    includeVariants: true,
    includePrices: true,
  })
  const { products: configProducts } = useConfigProducts()

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-black text-white p-4 rounded-lg text-xs font-mono z-50 max-h-96 overflow-auto">
      <div className="mb-2 font-bold text-yellow-300">🔍 SDK DEBUG INFO</div>
      
      <div className="mb-2">
        <div className="text-blue-300">Store Connection:</div>
        <div>Store ID: {tagadaContext.store?.id || 'null'}</div>
        <div>Initialized: {tagadaContext.isInitialized ? '✅' : '❌'}</div>
        <div>Session Ready: {tagadaContext.isSessionInitialized ? '✅' : '❌'}</div>
      </div>

      <div className="mb-2">
        <div className="text-green-300">Direct SDK Products:</div>
        <div>Loading: {directLoading ? '⏳' : '✅'}</div>
        <div>Error: {directError ? '❌ ' + directError.message : '✅'}</div>
        <div>Count: {directSDKProducts?.length || 0}</div>
        {directSDKProducts && directSDKProducts.length > 0 && (
          <div className="text-xs space-y-2">
            <div className="text-yellow-300">🔍 DETAILED PRODUCT STRUCTURE:</div>
            {directSDKProducts.slice(0, 1).map((product, i) => (
              <div key={product.id} className="p-2 bg-gray-800 rounded max-h-96 overflow-y-auto">
                <div className="text-white font-bold">🔍 COMPLETE PRODUCT DATA DUMP:</div>
                <div className="text-xs mt-2 text-green-200">
                  <div className="mb-2 font-bold text-yellow-300">📦 FULL PRODUCT OBJECT:</div>
                  <pre className="whitespace-pre-wrap text-xs bg-gray-900 p-2 rounded">
                    {JSON.stringify(product, null, 2)}
                  </pre>
                </div>
                <div className="mt-2 text-blue-300">
                  <div className="font-bold">🖼️ IMAGE ANALYSIS:</div>
                  <div>Product Image: {product.image || 'null'}</div>
                  <div>Product ImageUrl: {product.imageUrl || 'null'}</div>
                  <div>First Variant Image: {product.variants?.[0]?.imageUrl || 'null'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-purple-300">Config Filtered Products:</div>
        <div>Count: {configProducts?.length || 0}</div>
      </div>

      <div>
        <div className="text-orange-300">Environment:</div>
        <div>Mode: {tagadaContext.environment?.environment || 'unknown'}</div>
        <div>Debug: {tagadaContext.debugMode ? '✅' : '❌'}</div>
      </div>
    </div>
  )
}