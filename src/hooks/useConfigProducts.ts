import { useMemo } from "react";
import { useConfigContext } from "../contexts/ConfigProvider";
import { useProducts, useTagadaContext } from "@tagadapay/plugin-sdk/react";

/**
 * Hook that uses SDK useProducts directly + config filtering
 * No more wrapper - using the real SDK hook as team suggested!
 */
export const useConfigProducts = () => {
  const { config } = useConfigContext();
  const tagadaContext = useTagadaContext();

  // Debug current store connection
  console.log("🏪 Tagada Context Store Info:", {
    store: tagadaContext.store,
    storeId: tagadaContext.store?.id,
    session: tagadaContext.session,
    isInitialized: tagadaContext.isInitialized,
    isSessionInitialized: tagadaContext.isSessionInitialized,
    auth: tagadaContext.auth,
    environment: tagadaContext.environment,
  });

  // Use the SDK useProducts hook directly as team said!
  // Only enable when session is ready AND has a valid token to avoid authentication errors
  const canFetchProducts = !!(
    tagadaContext.isSessionInitialized &&
    tagadaContext.session?.sessionId &&
    !tagadaContext.auth?.isLoading
  );

  console.log("🔐 Auth Check for Products:", {
    isSessionInitialized: tagadaContext.isSessionInitialized,
    hasSessionId: !!tagadaContext.session?.sessionId,
    authLoading: tagadaContext.auth?.isLoading,
    canFetchProducts,
  });

  const {
    products: sdkProducts,
    isLoading,
    error,
    refetch,
  } = useProducts({
    enabled: canFetchProducts,
    includeVariants: true,
    includePrices: true,
  });

  console.log("🔍 useConfigProducts - Using SDK useProducts directly!");
  console.log("🔍 Session initialized:", tagadaContext.isSessionInitialized);
  console.log("🔍 Config productIds:", config?.productIds);
  console.log("🔍 SDK products:", sdkProducts);
  console.log("🔍 SDK products count:", sdkProducts?.length);
  console.log("🔍 SDK loading:", isLoading);
  console.log("🔍 SDK error:", error);

  // Filter SDK products by config productIds
  const filteredProducts = useMemo(() => {
    if (!config?.productIds || config.productIds.length === 0) {
      console.log("📋 No config productIds - returning all SDK products");
      return sdkProducts || [];
    }

    if (!sdkProducts || sdkProducts.length === 0) {
      console.log(
        "📋 No SDK products - store is empty, need to add products to Tagada store"
      );
      console.log(
        "📋 Current config expects these product IDs:",
        config.productIds
      );
      console.log("📋 But your Tagada store has 0 products");
      return [];
    }

    const filtered = sdkProducts.filter((product) =>
      config.productIds.includes(product.id)
    );

    console.log("📋 Filtered products by config:", filtered);
    console.log(
      `📋 Found ${filtered.length} out of ${config.productIds.length} configured products`
    );
    console.log(
      "✅ CONFIG FILTERING RESTORED: Using real product IDs from store"
    );

    return filtered;
  }, [sdkProducts, config?.productIds]);

  // Get featured products - SDK products don't have featured field, so return empty for now
  const featuredProducts = useMemo(() => {
    return []; // TODO: Need to determine how to mark products as featured
  }, [filteredProducts]);

  return {
    products: filteredProducts,
    featuredProducts,
    configProductIds: config?.productIds || [],
    loading: isLoading || !canFetchProducts, // Show loading until authentication ready
    error,
    refetch,
  };
};

/**
 * Get products by category from config-driven products
 */
export const useConfigProductsByCategory = (categoryId: string) => {
  const { products: configProducts, loading, error } = useConfigProducts();

  const categoryProducts = useMemo(() => {
    // SDK products don't have category field, so return all for now
    console.log(
      `⚠️ Category filtering not available - SDK products don't have category field`
    );
    console.log(`⚠️ Requested category: ${categoryId}, returning all products`);
    return configProducts; // TODO: Need to determine how to categorize SDK products
  }, [configProducts, categoryId]);

  return {
    products: categoryProducts,
    loading,
    error,
  };
};
