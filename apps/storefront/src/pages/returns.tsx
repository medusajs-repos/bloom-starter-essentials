const Returns = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Returns & Exchanges
            </h1>
            <p className="text-lg text-neutral-600">
              We want you to love what you purchase. If not, we make returns easy.
            </p>
          </div>

          <div className="space-y-8">
            {/* Return Policy */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Our Return Policy
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We offer free returns within 30 days of delivery for all unworn, unwashed items with original tags attached. We believe you should have ample time to try your pieces and ensure they're the perfect fit.
                </p>
                <p>
                  Items must be returned in their original condition with all tags and packaging intact. Items showing signs of wear, washing, or damage cannot be accepted for return.
                </p>
              </div>
            </div>

            {/* How to Return */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                How to Return an Item
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p className="font-semibold text-neutral-900">Step 1: Initiate Your Return</p>
                <p>
                  Log into your account and navigate to your order history. Select the order containing the item(s) you wish to return and click "Start Return." Alternatively, you can contact our customer service team at hello@essentials.com.
                </p>
                
                <p className="font-semibold text-neutral-900 mt-6">Step 2: Pack Your Items</p>
                <p>
                  Carefully pack your items in their original packaging if possible. Include your return slip or a note with your order number. Ensure all tags are attached and items are in sellable condition.
                </p>
                
                <p className="font-semibold text-neutral-900 mt-6">Step 3: Ship Your Return</p>
                <p>
                  We'll email you a prepaid return label. Simply attach it to your package and drop it off at your nearest postal location. Return shipping is free for all domestic orders.
                </p>
                
                <p className="font-semibold text-neutral-900 mt-6">Step 4: Receive Your Refund</p>
                <p>
                  Once we receive and inspect your return (typically within 2-3 business days), we'll process your refund. Refunds are issued to your original payment method within 5-10 business days.
                </p>
              </div>
            </div>

            {/* Exchanges */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Exchanges
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  To ensure you receive your preferred item quickly, we recommend returning your original item for a refund and placing a new order for the size or color you'd like.
                </p>
                <p>
                  If you prefer a direct exchange, please contact our customer service team at hello@essentials.com and we'll assist you with the process.
                </p>
              </div>
            </div>

            {/* International Returns */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                International Returns
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We accept returns from international customers within 30 days of delivery. However, customers are responsible for return shipping costs for international orders.
                </p>
                <p>
                  Please contact our customer service team before shipping your return to receive instructions and ensure proper processing. Be sure to use a tracked shipping method.
                </p>
                <p>
                  Any customs duties or taxes paid at the time of delivery cannot be refunded. Please check with your local customs office for more information.
                </p>
              </div>
            </div>

            {/* Final Sale Items */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Final Sale Items
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Items marked as "Final Sale" cannot be returned or exchanged unless they arrive damaged or defective. These items are clearly marked on the product page and at checkout.
                </p>
                <p>
                  We recommend reviewing our size guide carefully before purchasing Final Sale items.
                </p>
              </div>
            </div>

            {/* Damaged or Defective */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Damaged or Defective Items
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Quality is at the heart of everything we create. If you receive an item that's damaged or defective, please contact us within 7 days of delivery at hello@essentials.com with photos of the issue.
                </p>
                <p>
                  We'll arrange for a replacement or full refund, including any shipping charges. You won't need to return the damaged item unless we specifically request it for quality control purposes.
                </p>
              </div>
            </div>

            {/* Wrong Item */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Received the Wrong Item?
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  If you received an incorrect item, we sincerely apologize. Please contact us immediately at hello@essentials.com with your order number and a photo of the item received.
                </p>
                <p>
                  We'll send you the correct item right away at no charge and provide a prepaid return label for the incorrect item.
                </p>
              </div>
            </div>

            {/* Refund Timeline */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Refund Processing Time
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Once your return is received and inspected at our facility, we'll send you an email confirmation. Refunds are processed within 2-3 business days of receipt.
                </p>
                <p>
                  Please allow 5-10 business days for the refund to appear in your account, depending on your bank or payment provider. Original shipping charges are non-refundable unless the return is due to our error.
                </p>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-neutral-900 text-neutral-50 p-8 text-center">
              <h2 className="text-xl font-display font-semibold mb-4">
                Questions About Returns?
              </h2>
              <p className="text-neutral-300 mb-6">
                Our customer service team is here to make your return experience seamless
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

export default Returns
