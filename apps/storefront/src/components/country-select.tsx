import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateCart, useUpdateCart } from "@/lib/hooks/use-cart"
import { getStoredCart } from "@/lib/utils/cart"
import {
  buildPathWithCountryCode,
  getCountryCodeFromPath,
  setStoredCountryCode,
} from "@/lib/utils/region"
import { HttpTypes } from "@medusajs/types"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { useMemo } from "react"
import { clsx } from "clsx"

type CountryOption = {
  country_code: string;
  region_id: string;
  label: string;
  currency_code: string;
};

type CountrySelectProps = {
  regions: HttpTypes.StoreRegion[];
  className?: string;
};

const CountrySelect = ({ regions, className }: CountrySelectProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathCountryCode = getCountryCodeFromPath(location.pathname)
  const currentPath =
    location.pathname.replace(`/${pathCountryCode}`, "") || "/"

  const updateCartMutation = useUpdateCart()
  const createCartMutation = useCreateCart()

  const countries = useMemo(() => {
    const countryMap = new Map<string, CountryOption>()

    regions?.forEach((region) => {
      region.countries?.forEach((country) => {
        if (country.iso_2 && !countryMap.has(country.iso_2)) {
          countryMap.set(country.iso_2, {
            country_code: country.iso_2,
            region_id: region.id,
            label: country.display_name ?? "",
            currency_code: region.currency_code?.toUpperCase() ?? "",
          })
        }
      })
    })

    return Array.from(countryMap.values()).sort((a, b) =>
      (a?.label ?? "").localeCompare(b?.label ?? "")
    )
  }, [regions])

  const currentCountry = useMemo(() => {
    return countries?.find((o) => o?.country_code === pathCountryCode)
  }, [countries, pathCountryCode])

  const handleChange = async (countryCode: string) => {
    const option = countries?.find((o) => o?.country_code === countryCode)
    if (!option) return

    setStoredCountryCode(option.country_code)

    const newPath = buildPathWithCountryCode(currentPath, option.country_code)
    navigate({ to: newPath })

    if (currentCountry?.region_id !== option.region_id) {
      const cartId = getStoredCart()

      if (cartId) {
        await updateCartMutation.mutateAsync({
          region_id: option.region_id,
        })
      } else {
        await createCartMutation.mutateAsync({
          region_id: option.region_id,
        })
      }
    }
  }

  return (
    <Select value={pathCountryCode || ""} onValueChange={handleChange}>
      <SelectTrigger 
        variant="minimal" 
        className={clsx(
          "text-sm text-white w-full justify-start font-normal",
          className
        )}
      >
        <SelectValue placeholder="Select country">
          {currentCountry
            ? `${currentCountry.label} (${currentCountry.currency_code})`
            : "Select country"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries?.map((country) => (
          <SelectItem key={country.country_code} value={country.country_code}>
            {country.label} ({country.currency_code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default CountrySelect
