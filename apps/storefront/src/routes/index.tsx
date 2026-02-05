import { getStoredCountryCode } from "@/lib/data/country-code";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const { countryCode } = await getStoredCountryCode();

    throw redirect({
      to: "/$countryCode",
      params: { countryCode },
    });
  },
});
