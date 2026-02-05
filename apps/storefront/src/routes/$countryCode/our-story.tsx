import { createFileRoute } from "@tanstack/react-router"
import OurStory from "@/pages/our-story"

export const Route = createFileRoute("/$countryCode/our-story")({
  component: OurStory,
})
