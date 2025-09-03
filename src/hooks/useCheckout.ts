import { useCheckout as useTagadaCheckout } from "@tagadapay/plugin-sdk/react";
import { useCartContext } from "../contexts/CartProvider";
import { usePluginConfig } from "@tagadapay/plugin-sdk/react";

export function useCheckout() {
  const { items, cartToken } = useCartContext();
  const { storeId } = usePluginConfig();

  // Get the raw SDK checkout hook
  const { init, isLoading, error } = useTagadaCheckout();

  const initializeCheckout = async () => {
    console.log("🔍 Debug: Cart state at checkout time:", {
      itemsLength: items.length,
      items: items,
      cartToken: cartToken,
    });

    if (!items.length) {
      console.error("❌ Cart is empty at checkout time:", {
        items: items,
        itemsType: typeof items,
        itemsIsArray: Array.isArray(items),
      });
      throw new Error("Cart is empty");
    }

    // SPECIFICATION: "Build lineItems from the cart (variantId, priceId, quantity)"
    const lineItems = items.map((item) => ({
      variantId: item.variantId,
      priceId: item.priceId,
      quantity: item.quantity,
    }));

    console.log("� Built lineItems per specification:", lineItems);

    try {
      // SPECIFICATION: "Call useCheckout().init({ lineItems, promotionIds?, storeId?, cartToken })"
      console.log("🚀 Calling init() with specification parameters...");

      const result = await init({
        lineItems,
        cartToken,
        ...(storeId && { storeId }),
        // promotionIds is optional per spec, not included for now
      });

      console.log("✅ Init call completed. Result:", result);

      // SPECIFICATION: "On success, redirect to result.checkoutUrl"
      if (result?.checkoutUrl) {
        console.log(
          "🔗 Found checkoutUrl, redirecting per specification:",
          result.checkoutUrl
        );
        window.location.href = result.checkoutUrl;
        return result;
      } else {
        console.error(
          "❌ No checkoutUrl in result - this violates specification expectation"
        );
        console.error("Full result:", JSON.stringify(result, null, 2));
        throw new Error("No checkout URL received from Tagada");
      }
    } catch (error) {
      console.error(
        "❌ Specification compliance failed at init() call:",
        error
      );
      throw error;
    }
  };

  return {
    initializeCheckout,
    isLoading,
    error,
  };
}

// Legacy export for backward compatibility with existing code
export const useCheckout_Legacy = (options?: { checkoutToken?: string }) => {
  return useTagadaCheckout(options);
};

// Helper functions for existing code
export const cartToLineItems = (
  cartItems: Array<{
    productId: string;
    variantId: string;
    priceId: string;
    quantity: number;
  }>
): Array<{
  variantId: string;
  priceId?: string;
  quantity: number;
}> => {
  return cartItems.map((item) => ({
    variantId: item.variantId,
    priceId: item.priceId,
    quantity: item.quantity,
  }));
};

export const initializeCheckout = async (
  init: any,
  cartItems: Array<{
    productId: string;
    variantId: string;
    priceId: string;
    quantity: number;
  }>,
  options?: {
    storeId?: string;
    cartToken?: string;
  }
) => {
  const lineItems = cartToLineItems(cartItems);

  console.log("🚀 Initializing checkout with line items:", lineItems);

  return init({
    lineItems,
    ...(options?.storeId && { storeId: options.storeId }),
    ...(options?.cartToken && { cartToken: options.cartToken }),
  });
};
