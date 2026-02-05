import { useState, ReactNode } from "react"
import { CartDrawerContext } from "@/lib/hooks/use-cart-drawer"

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartDrawerContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartDrawerContext.Provider>
  )
}
