export const formatOrderId = (orderId: string): string => {
  return `#${orderId.padStart(6, "0")}`
}
