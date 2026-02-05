import { createFileRoute } from "@tanstack/react-router"
import Payments from "@/pages/payments"

export const Route = createFileRoute("/$countryCode/payments")({
  component: Payments,
})
