import { createContext, useContext, useState, ReactNode } from "react"

type CartContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCartDrawer = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCartDrawer must be used within CartProvider")
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

