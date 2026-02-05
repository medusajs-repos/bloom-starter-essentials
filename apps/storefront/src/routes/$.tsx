import RegionRedirect from "@/components/region-redirect"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$")({
  component: () => <RegionRedirect isChecking404={true} />,
});
