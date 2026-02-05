import { createFileRoute } from "@tanstack/react-router"
import Returns from "@/pages/returns"

export const Route = createFileRoute("/$countryCode/returns")({
  component: Returns,
})
