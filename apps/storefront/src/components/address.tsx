import { HttpTypes } from "@medusajs/types";
import { clsx } from "clsx";

type AddressProps = {
  address:
    | HttpTypes.StoreCustomerAddress
    | HttpTypes.StoreCartAddress
    | HttpTypes.StoreOrderAddress;
  className?: string;
};

const Address = ({ address, className }: AddressProps) => {
  return (
    <p className={clsx("text-sm text-secondary-text", className)}>
      {address.first_name} {address.last_name}
      <br />
      {address.address_1}
      {address.address_2 && `, ${address.address_2}`}
      <br />
      {address.city}, {address.postal_code}
      <br />
      {address.country_code?.toUpperCase()}
    </p>
  );
};

export default Address;
