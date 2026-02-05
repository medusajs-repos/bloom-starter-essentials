import { HttpTypes } from "@medusajs/types"

// ============ STORED COUNTRY CODE ============

export const COUNTRY_CODE_KEY = "medusa_country_code";

export function getStoredCountryCode(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split("; ");
  const countryCodeCookie = cookies.find((row) =>
    row.startsWith(`${COUNTRY_CODE_KEY}=`)
  );

  return countryCodeCookie?.split("=")[1] || undefined;
}

export function setStoredCountryCode(countryCode: string): void {
  if (typeof document === "undefined") return;

  const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
  document.cookie = `${COUNTRY_CODE_KEY}=${countryCode}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// ============ COUNTRY CODE FROM PATH ============

export function getCountryCodeFromPath(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean)
  const potentialCountryCode = segments[0]?.toLowerCase()

  if (potentialCountryCode && potentialCountryCode.length === 2) {
    return potentialCountryCode
  }

  return undefined
}

// ============ DEFAULT COUNTRY CODE ============

export default function getDefaultCountryCode(regions: HttpTypes.StoreRegion[]): string | undefined {
  let defaultCountryCode = undefined
  regions.some((r) => {
    defaultCountryCode = r.countries?.[0]?.iso_2
    return defaultCountryCode !== undefined
  })
  return defaultCountryCode
}

// Also export as named export for flexibility
export { getDefaultCountryCode }

// ============ BUILD PATH WITH COUNTRY CODE ============

export function buildPathWithCountryCode(currentPath: string, countryCode: string): string {
  const pathWithoutCountry = currentPath.replace(`/${countryCode}`, "") || "/"
  const searchParams = Object.keys(location.search || {}).length > 0
    ? `?${new URLSearchParams(location.search as any).toString()}`
    : ""
  return `/${countryCode}${pathWithoutCountry === "/" ? "" : pathWithoutCountry}${searchParams}`
}
