import { createFileRoute } from "@tanstack/react-router"
import FAQ from "@/pages/faq"

export const Route = createFileRoute("/$countryCode/faq")({
  component: FAQ,
})
