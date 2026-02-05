import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { countries } from "@/lib/constants/countries"
import { AddressFormData } from "@/lib/types/global"
import { HttpTypes } from "@medusajs/types"
import { clsx } from "clsx"
import { useCallback, useEffect, useMemo, useState } from "react"

interface AddressFormProps {
  addressFormData: AddressFormData
  setAddressFormData: React.Dispatch<React.SetStateAction<AddressFormData>>
  shouldHandleSubmit?: boolean
  setIsFormValid?: (isValid: boolean) => void
  onSubmit?:
    | ((address: HttpTypes.StoreCreateCustomerAddress) => void)
    | ((address: HttpTypes.StoreAddAddress) => void)
  onCancel?: () => void
  countries?: HttpTypes.StoreRegion["countries"]
  isLoading?: boolean
  className?: string
}

const AddressForm = ({
  addressFormData,
  setAddressFormData,
  shouldHandleSubmit = false,
  setIsFormValid,
  onSubmit,
  onCancel,
  isLoading,
  countries: customCountries,
  className,
}: AddressFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  )

  const countriesInput = useMemo(() => {
    if (!customCountries) {
      return countries
    }

    return customCountries.map((country) => ({
      code: country.iso_2 || "",
      name: country.display_name || "",
    }))
  }, [customCountries])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!addressFormData.first_name?.trim())
      newErrors.first_name = "First name is required"
    if (!addressFormData.last_name?.trim())
      newErrors.last_name = "Last name is required"
    if (!addressFormData.address_1?.trim())
      newErrors.address_1 = "Address is required"
    if (!addressFormData.city?.trim()) newErrors.city = "City is required"
    if (!addressFormData.postal_code?.trim())
      newErrors.postal_code = "Postal code is required"
    if (!addressFormData.country_code?.trim())
      newErrors.country_code = "Country is required"
    const countryCodeExists = countriesInput.some(
      (country) => country.code === addressFormData.country_code
    )
    if (!countryCodeExists) newErrors.country_code = "Country is invalid"

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    setIsFormValid?.(isValid)
    return isValid
  }, [addressFormData, countriesInput, setIsFormValid])

  const handleChange = (field: string, value: string) => {
    setAddressFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
  }

  useEffect(() => {
    validateForm()
  }, [validateForm])

  const handleSubmit = () => {
    if (!validateForm() || !shouldHandleSubmit) return

    if (onSubmit) {
      onSubmit(addressFormData as HttpTypes.StoreCreateCustomerAddress & HttpTypes.StoreAddAddress)
    }
  }

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Name fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="first_name" className="block text-sm font-medium">
            First Name
          </label>
          <Input
            name="first_name"
            id="first_name"
            type="text"
            autoComplete="given-name"
            value={addressFormData.first_name || ""}
            onChange={(e) => handleChange("first_name", e.target.value)}
            placeholder="First name"
          />
          {errors.first_name && touchedFields.first_name && (
            <div className="text-rose-900 text-sm mt-1">
              {errors.first_name}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="last_name" className="block text-sm font-medium">
            Last Name
          </label>
          <Input
            name="last_name"
            id="last_name"
            type="text"
            autoComplete="family-name"
            value={addressFormData.last_name || ""}
            onChange={(e) => handleChange("last_name", e.target.value)}
            placeholder="Last name"
          />
          {errors.last_name && touchedFields.last_name && (
            <div className="text-rose-900 text-sm mt-1">
              {errors.last_name}
            </div>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="flex flex-col gap-2">
        <label htmlFor="company" className="block text-sm font-medium">
          Company
        </label>
        <Input
          name="company"
          id="company"
          type="text"
          autoComplete="organization"
          value={addressFormData.company || ""}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Company name"
        />
      </div>

      {/* Address fields */}
      <div className="flex flex-col gap-2">
        <label htmlFor="address_1" className="block text-sm font-medium">
          Address Line 1
        </label>
        <Input
          name="address_1"
          id="address_1"
          type="text"
          autoComplete="street-address"
          value={addressFormData.address_1 || ""}
          onChange={(e) => handleChange("address_1", e.target.value)}
          placeholder="Address line 1"
        />
        {errors.address_1 && touchedFields.address_1 && (
          <div className="text-rose-900 text-sm mt-1">{errors.address_1}</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address_2" className="block text-sm font-medium">
          Address Line 2
        </label>
        <Input
          name="address_2"
          id="address_2"
          type="text"
          value={addressFormData.address_2 || ""}
          onChange={(e) => handleChange("address_2", e.target.value)}
          placeholder="Address line 2"
        />
      </div>

      {/* City, Province, Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="block text-sm font-medium">
            City
          </label>
          <Input
            name="city"
            id="city"
            type="text"
            autoComplete="address-level2"
            value={addressFormData.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="City"
          />
          {errors.city && touchedFields.city && (
            <div className="text-rose-900 text-sm mt-1">{errors.city}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="province" className="block text-sm font-medium">
            State / Province
          </label>
          <Input
            name="province"
            id="province"
            type="text"
            autoComplete="address-level1"
            value={addressFormData.province || ""}
            onChange={(e) => handleChange("province", e.target.value)}
            placeholder="State / Province"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="postal_code" className="block text-sm font-medium">
            Postal Code
          </label>
          <Input
            name="postal_code"
            id="postal_code"
            type="text"
            autoComplete="postal-code"
            value={addressFormData.postal_code || ""}
            onChange={(e) => handleChange("postal_code", e.target.value)}
            placeholder="Postal code"
          />
          {errors.postal_code && touchedFields.postal_code && (
            <div className="text-rose-900 text-sm mt-1">
              {errors.postal_code}
            </div>
          )}
        </div>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="country_code"
          className="block text-sm font-medium text-zinc-900 mb-2"
        >
          Country
        </label>
        <Select
          name="country_code"
          value={addressFormData.country_code || ""}
          onValueChange={(value) => handleChange("country_code", value)}
        >
          <SelectTrigger className="!border-zinc-200 !rounded-none !text-base !font-medium !px-4 !py-2 !h-auto !shadow-none !ring-0 focus:!ring-0">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countriesInput.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country_code && touchedFields.country_code && (
          <div className="text-rose-900 text-sm mt-1">
            {errors.country_code}
          </div>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <Input
          name="phone"
          id="phone"
          type="tel"
          autoComplete="tel"
          value={addressFormData.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Phone number"
        />
      </div>

      {/* Action buttons */}
      {shouldHandleSubmit && (
        <div className="flex items-center justify-end gap-x-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} variant="primary">
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default AddressForm
