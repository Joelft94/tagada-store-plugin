import { useCartContext } from "../contexts/CartProvider";
import { useCheckout as useTagadaCheckout } from "@tagadapay/plugin-sdk/react";
import { usePluginConfig } from "@tagadapay/plugin-sdk/react";

export function CheckoutTest() {
  const { items, cartToken } = useCartContext();
  const { storeId } = usePluginConfig();
  const { init } = useTagadaCheckout(); // No checkoutToken - we're creating new session

  const testSDKResponse = async () => {
    console.log("🧪 TESTING SDK RESPONSE STRUCTURE");
    console.log("=================================");

    if (!items.length) {
      alert("Add items to cart first!");
      return;
    }

    // Build lineItems exactly per specification
    const lineItems = items.map((item) => ({
      variantId: item.variantId,
      priceId: item.priceId,
      quantity: item.quantity,
    }));

    console.log("📋 LineItems to send:", lineItems);
    console.log("🔑 CartToken:", cartToken);
    console.log("🏪 StoreId:", storeId);

    try {
      console.log("� Calling init() and inspecting response...");

      const result = await init({
        lineItems,
        cartToken,
        ...(storeId && { storeId }),
      });

      console.log("✅ SDK Response received!");
      console.log("📊 Full result object:", result);
      console.log("📊 Result type:", typeof result);
      console.log(
        "📊 Result keys:",
        result ? Object.keys(result) : "null/undefined"
      );

      // Check all possible URL properties
      console.log("🔗 Checking for URL properties:");
      console.log("  - result.checkoutUrl:", result?.checkoutUrl);
      console.log("  - result.checkoutToken:", result?.checkoutToken);
      console.log("  - result.checkoutSession:", result?.checkoutSession);

      // Pretty print the entire structure
      console.log("📋 Complete result structure:");
      console.log(JSON.stringify(result, null, 2));

      // Alert the findings
      alert(`SDK Response Analysis:
      
Result type: ${typeof result}
Keys: ${result ? Object.keys(result).join(", ") : "null/undefined"}

Check browser console for detailed structure.`);
    } catch (error) {
      console.error("❌ SDK call failed:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      alert(
        `SDK Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  if (import.meta.env.DEV) {
    return (
      <div className="fixed top-4 left-4 bg-purple-600 text-white p-4 rounded-lg z-50 max-w-sm">
        <h3 className="font-bold mb-2">SDK Response Inspector</h3>
        <p className="text-xs mb-2">
          Cart: {items.length} items
          <br />
          Token: {cartToken?.slice(0, 10)}...
          <br />
          Store: {storeId}
        </p>
        <button
          onClick={testSDKResponse}
          className="bg-white text-purple-600 px-3 py-1 rounded text-xs hover:bg-gray-100 w-full"
          disabled={items.length === 0}
        >
          Inspect SDK Response
        </button>
        {items.length === 0 && (
          <p className="text-xs mt-1 text-purple-200">
            Add items to cart first
          </p>
        )}
      </div>
    );
  }

  return null;
}
