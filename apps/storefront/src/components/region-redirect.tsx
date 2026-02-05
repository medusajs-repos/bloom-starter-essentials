import { useCreateCart } from "@/lib/hooks/use-cart";
import { useRegions } from "@/lib/hooks/use-regions";
import { getStoredCart } from "@/lib/utils/cart";
import {
  buildPathWithCountryCode,
  getCountryCodeFromPath,
  getDefaultCountryCode,
  getStoredCountryCode,
  setStoredCountryCode,
} from "@/lib/utils/region";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { lazy, useEffect, useState } from "react";

const NotFound = lazy(() => import("./not-found"));

interface RegionRedirectProps {
  children?: React.ReactNode;
  isChecking404?: boolean;
}

const RegionRedirect = ({
  children,
  isChecking404 = false,
}: RegionRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: regions = [], isLoading: isLoadingRegions } = useRegions({
    fields: "id, currency_code, *countries",
  });
  const createCartMutation = useCreateCart();
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    if (isLoadingRegions) return;

    const handleRegionRedirect = async () => {
      try {
        const currentPath = location.pathname;
        const urlCountryCode = getCountryCodeFromPath(currentPath);
        let countryCode: string | undefined = urlCountryCode;

        if (countryCode) {
          const isValidCountryCode = regions.some((r) =>
            r.countries?.some((c) => c.iso_2 === countryCode)
          );

          if (isValidCountryCode) {
            setStoredCountryCode(countryCode!);
            const cartId = getStoredCart();

            if (!cartId) {
              const region = regions.find((r) =>
                r.countries?.some((c) => c.iso_2 === countryCode)
              );

              if (region) {
                createCartMutation.mutate({ region_id: region.id });
              }
            }

            return;
          }
        }

        countryCode = getStoredCountryCode() || getDefaultCountryCode(regions);

        if (countryCode) {
          setStoredCountryCode(countryCode);
          const newPath = buildPathWithCountryCode(currentPath, countryCode);

          navigate({ to: newPath as any, replace: true });

          const cartId = getStoredCart();

          if (!cartId) {
            const region = regions.find((r) =>
              r.countries?.some((c) => c.iso_2 === countryCode)
            );

            if (region) {
              createCartMutation.mutate({ region_id: region.id });
            }
          }
        } else {
          setIs404(true);
        }
      } catch (error) {
        console.error("Region redirect error:", error);
        // Continue rendering even if region detection fails
      }
    };

    handleRegionRedirect();
  }, [
    location.pathname,
    location.search,
    navigate,
    regions,
    isLoadingRegions,
    createCartMutation,
  ]);

  return (
    <>
      {children}
      {is404 && isChecking404 && <NotFound />}
    </>
  );
};

export default RegionRedirect;
