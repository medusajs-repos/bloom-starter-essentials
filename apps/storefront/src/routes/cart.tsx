import { getStoredCountryCode } from "@/lib/data/country-code";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cart")({
  loader: async () => {
    const { countryCode } = await getStoredCountryCode();

    throw redirect({
      to: "/$countryCode/cart",
      params: { countryCode },
    });
  },
});
