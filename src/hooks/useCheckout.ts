import { useCheckout as useTagadaCheckout } from '@tagadapay/plugin-sdk/react'

// Re-export the real Tagada checkout hook with our interface
export const useCheckout = (options?: { checkoutToken?: string }) => {
  return useTagadaCheckout(options)
}

// Helper function to convert cart items to Tagada line items
export const cartToLineItems = (cartItems: Array<{
  productId: string
  variantId: string
  priceId: string
  quantity: number
}>): Array<{
  variantId: string
  priceId?: string
  quantity: number
}> => {
  return cartItems.map(item => ({
    variantId: item.variantId, // Use the variantId directly from cart
    priceId: item.priceId,
    quantity: item.quantity
  }))
}

// Helper function to initialize checkout with cart data
export const initializeCheckout = async (
  init: any,
  cartItems: Array<{
    productId: string
    variantId: string
    priceId: string
    quantity: number
  }>,
  options?: {
    storeId?: string
    cartToken?: string
  }
) => {
  const lineItems = cartToLineItems(cartItems)
  
  console.log('🚀 Initializing checkout with line items:', lineItems)
  
  return init({
    lineItems,
    ...(options?.storeId && { storeId: options.storeId })
  })
}