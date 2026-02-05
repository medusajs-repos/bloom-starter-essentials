const Payments = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Payment Information
            </h1>
            <p className="text-lg text-neutral-600">
              Secure and convenient payment options for your purchase
            </p>
          </div>

          <div className="space-y-8">
            {/* Accepted Payment Methods */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Accepted Payment Methods
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We accept the following secure payment methods to make your shopping experience as convenient as possible:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Credit Cards:</strong> Visa, Mastercard, American Express, and Discover
                  </li>
                  <li>
                    <strong>Digital Wallets:</strong> PayPal, Apple Pay, and Google Pay
                  </li>
                  <li>
                    <strong>Buy Now, Pay Later:</strong> Klarna for flexible payment options
                  </li>
                </ul>
              </div>

              <div className="mt-8 flex items-center gap-4 flex-wrap">
                <img
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/visa-01KGM4VCEN4S70B20CHKYRKYHD.svg"
                  alt="Visa"
                  className="h-8"
                />
                <img
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/mastercard-01KGM4VC6Q7D8S2A8GGBZZ9WH2.svg"
                  alt="Mastercard"
                  className="h-8"
                />
                <img
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/paypal-01KGM4VBX940SCWM1DAE1SPAQH.svg"
                  alt="PayPal"
                  className="h-8"
                />
                <img
                  src="https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/klarna-01KGM4VBN2SGCV6FSX1MBC5GQJ.svg"
                  alt="Klarna"
                  className="h-8"
                />
              </div>
            </div>

            {/* Security */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Secure Transactions
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Your payment security is our top priority. All transactions on our website are encrypted and processed through industry-leading secure payment gateways.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL encryption protects your payment information</li>
                  <li>PCI DSS compliant payment processing</li>
                  <li>We never store your full credit card details</li>
                  <li>3D Secure authentication for added protection</li>
                </ul>
              </div>
            </div>

            {/* Pricing & Currency */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Pricing & Currency
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  All prices are displayed in your local currency based on your region. We currently support:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>USD - United States Dollar</li>
                  <li>EUR - Euro</li>
                  <li>GBP - British Pound</li>
                  <li>DKK - Danish Krone</li>
                </ul>
                <p className="mt-4">
                  The final amount charged will be in the currency you selected at checkout. Currency conversion rates are updated daily and determined by your payment provider.
                </p>
              </div>
            </div>

            {/* Payment Processing */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                When You'll Be Charged
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Your payment method will be authorized at the time you place your order. The charge will be processed when your order is prepared for shipment, typically within 24 hours.
                </p>
                <p>
                  If any items in your order are unavailable, we'll adjust your payment accordingly before processing the charge.
                </p>
              </div>
            </div>

            {/* Payment Issues */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Payment Issues
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  If your payment is declined, please check the following:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Verify your card details are entered correctly</li>
                  <li>Ensure your billing address matches your card statement</li>
                  <li>Check that your card has sufficient funds</li>
                  <li>Contact your bank to ensure international transactions are enabled</li>
                </ul>
                <p className="mt-4">
                  If you continue to experience issues, please try a different payment method or contact our customer service team at hello@essentials.com for assistance.
                </p>
              </div>
            </div>

            {/* Refunds */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Refunds
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Refunds are processed to your original payment method within 5-10 business days after we receive your return. The time it takes for the refund to appear in your account depends on your payment provider.
                </p>
                <p>
                  For more information about our return policy, please visit our Returns page.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-neutral-900 text-neutral-50 p-8 text-center">
              <h2 className="text-xl font-display font-semibold mb-4">
                Payment Questions?
              </h2>
              <p className="text-neutral-300 mb-6">
                Our customer service team is here to help with any payment-related inquiries
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

export default Payments
