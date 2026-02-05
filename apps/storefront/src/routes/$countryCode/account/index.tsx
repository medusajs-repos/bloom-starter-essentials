import { createFileRoute, Link } from "@tanstack/react-router";
import { useCustomer } from "@/lib/hooks/use-customer";
import { useCustomerOrders } from "@/lib/hooks/use-customer-orders";
import { formatPrice } from "@/lib/utils/price";
import { Auth } from "@/pages/auth";

export const Route = createFileRoute("/$countryCode/account/")({
  component: AccountPage,
});

function AccountPage() {
  const { data: customer, isLoading: customerLoading } = useCustomer();
  const { countryCode } = Route.useParams();
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders();

  if (customerLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return <Auth />;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-40">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
        </div>

        <div className="mb-8 p-6 bg-neutral-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {customer.first_name}{" "}
              {customer.last_name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {customer.email}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Link
                  key={order.id}
                  to="/$countryCode/account/orders/$orderId"
                  params={{ countryCode, orderId: order.id }}
                  className="block p-6 border border-neutral-200 rounded-lg hover:border-neutral-400 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order.display_id}</p>
                      <p className="text-sm text-neutral-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatPrice({
                        amount: order.total,
                        currency_code: order.currency_code,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="capitalize">Status: {order.status}</span>
                    <span className="capitalize">
                      Payment: {order.payment_status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
