import { createContext, useContext } from "react"

export type ToastContextType = {
  message: string | null
  showToast: (message: string) => void
  hideToast: () => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
