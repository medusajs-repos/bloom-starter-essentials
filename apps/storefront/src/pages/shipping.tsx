const Shipping = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Shipping Information
            </h1>
            <p className="text-lg text-neutral-600">
              Free shipping on all orders, delivered with care
            </p>
          </div>

          <div className="space-y-8">
            {/* Free Shipping */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Free Shipping on All Orders
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We believe exceptional service should come standard. That's why we offer free shipping on every order, regardless of size or destination.
                </p>
                <p>
                  Your order will be carefully packaged in our signature sustainable packaging and shipped directly to your door at no additional cost.
                </p>
              </div>
            </div>

            {/* Delivery Times */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Delivery Timeframes
              </h2>
              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">United States</h3>
                  <p>Standard delivery: 3-5 business days</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Europe</h3>
                  <p>Standard delivery: 4-7 business days</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">United Kingdom</h3>
                  <p>Standard delivery: 3-6 business days</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Denmark</h3>
                  <p>Standard delivery: 2-4 business days</p>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">Rest of World</h3>
                  <p>Standard delivery: 7-14 business days</p>
                </div>
                <p className="text-sm text-neutral-600 mt-4">
                  Delivery times are estimates and begin from the date of dispatch. Orders placed before 2pm (CET) Monday-Friday are typically dispatched the same day.
                </p>
              </div>
            </div>

            {/* Order Processing */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Order Processing
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Orders are typically processed and shipped within 1-2 business days. You'll receive a shipping confirmation email with tracking information once your order has been dispatched.
                </p>
                <p>
                  Please note that orders placed on weekends or holidays will be processed on the next business day.
                </p>
              </div>
            </div>

            {/* Tracking */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Order Tracking
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Once your order ships, you'll receive an email with a tracking number and link to monitor your delivery. You can also track your order by logging into your account and viewing your order history.
                </p>
                <p>
                  Tracking information is typically updated within 24 hours of dispatch. If you haven't received tracking information within 48 hours of placing your order, please contact our customer service team.
                </p>
              </div>
            </div>

            {/* International Shipping */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                International Orders
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We ship to most countries worldwide. International orders may be subject to customs duties, taxes, and fees imposed by your destination country. These charges are the responsibility of the recipient and are not included in your order total.
                </p>
                <p>
                  All international shipments are clearly marked with the contents and value to facilitate customs clearance. Please check with your local customs office for estimated charges before placing your order.
                </p>
              </div>
            </div>

            {/* Packaging */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Sustainable Packaging
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Every order arrives in our thoughtfully designed, fully recyclable packaging. We use FSC-certified materials and biodegradable mailers to minimize environmental impact.
                </p>
                <p>
                  Our packaging is designed for reuse. Consider using the bags for storage, travel, or gifting before recycling.
                </p>
              </div>
            </div>

            {/* Delivery Issues */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Delivery Issues
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  If your order hasn't arrived within the estimated delivery timeframe, please:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Check your tracking information for updates</li>
                  <li>Verify the shipping address in your order confirmation</li>
                  <li>Check with neighbors or building management</li>
                  <li>Contact the carrier directly using your tracking number</li>
                </ul>
                <p className="mt-4">
                  If you're still unable to locate your package, please contact us at hello@essentials.com and we'll investigate immediately.
                </p>
              </div>
            </div>

            {/* PO Boxes & Special Addresses */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Special Shipping Requirements
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We can ship to PO Boxes, APO/FPO addresses, and residential or commercial locations. Please ensure your shipping address is complete and accurate to avoid delivery delays.
                </p>
                <p>
                  For hotel or temporary addresses, we recommend contacting the location in advance to confirm they accept packages on your behalf.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-neutral-900 text-neutral-50 p-8 text-center">
              <h2 className="text-xl font-display font-semibold mb-4">
                Shipping Questions?
              </h2>
              <p className="text-neutral-300 mb-6">
                Our team is here to help with any shipping inquiries
              </p>
              <a
                href="mailto:hello@essentials.com"
                className="inline-block bg-white text-neutral-900 px-8 py-3 hover:bg-neutral-100 transition-colors uppercase text-sm font-semibold tracking-wider"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shipping
