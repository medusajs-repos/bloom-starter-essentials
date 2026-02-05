import { listRegions } from "@/lib/data/regions";
import { COUNTRY_CODE_KEY, getDefaultCountryCode } from "@/lib/utils/region";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, setResponseHeader } from "@tanstack/react-start/server";

export const getStoredCountryCode = createServerFn().handler(async () => {
  const headers = getRequestHeaders();

  let countryCode: string | undefined;

  if (headers?.cookie) {
    const cookies = headers.cookie.split("; ");
    const countryCodeCookie = cookies.find((row) =>
      row.startsWith(`${COUNTRY_CODE_KEY}=`)
    );

    countryCode = countryCodeCookie?.split("=")[1];
  }

  if (!countryCode) {
    const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds

    const regions = await listRegions();
    countryCode = getDefaultCountryCode(regions);

    setResponseHeader(
      "Set-Cookie",
      `${COUNTRY_CODE_KEY}=${countryCode}; path=/; max-age=${maxAge}; SameSite=Lax`
    );
  }

  if (!countryCode) {
    throw new Error(
      "Default region not found. Please set a default region in the admin panel."
    );
  }

  return { countryCode };
});
