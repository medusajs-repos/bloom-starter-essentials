import { createContext, useContext } from "react"

export type CartDrawerContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined)

export function useCartDrawer(): CartDrawerContextType {
  const context = useContext(CartDrawerContext)
  if (!context) {
    throw new Error("useCartDrawer must be used within CartProvider")
  }
  return context
}
