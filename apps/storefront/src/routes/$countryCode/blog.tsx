import { createFileRoute } from "@tanstack/react-router"
import Blog from "@/pages/blog"

export const Route = createFileRoute("/$countryCode/blog")({
  component: Blog,
})
