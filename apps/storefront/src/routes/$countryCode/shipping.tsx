import { createFileRoute } from "@tanstack/react-router"
import Shipping from "@/pages/shipping"

export const Route = createFileRoute("/$countryCode/shipping")({
  component: Shipping,
})
