import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "@medusajs/icons"

const FAQ = () => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer free returns within 30 days of delivery for all unworn, unwashed items with original tags attached. Items must be in their original condition. Simply log into your account to initiate a return, or contact our customer service team at hello@essentials.com for assistance. Visit our Returns page for complete details.",
    },
    {
      question: "Do you offer free shipping?",
      answer:
        "Yes! We offer free standard shipping on all orders, regardless of size or destination. Your order will be carefully packaged and shipped directly to your door at no additional cost.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Delivery times vary by region: United States (3-5 business days), Europe (4-7 business days), United Kingdom (3-6 business days), Denmark (2-4 business days), and Rest of World (7-14 business days). Orders placed before 2pm CET Monday-Friday are typically dispatched the same day. Visit our Shipping page for more information.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express, Discover), digital wallets (PayPal, Apple Pay, Google Pay), and Klarna for flexible payment options. All transactions are securely encrypted and processed through industry-leading payment gateways. Visit our Payments page for complete details.",
    },
    {
      question: "What materials do you use?",
      answer:
        "We use premium, sustainable materials including certified organic cotton, recycled polyester, and responsibly-sourced elastane. All fabrics are carefully selected from Nordic textile mills for their performance, comfort, and minimal environmental impact. Specific fabric compositions are listed on each product page.",
    },
    {
      question: "How do I find my size?",
      answer:
        "Each product page includes a detailed size chart with measurements. We recommend taking your measurements and comparing them to our size guide. If you're between sizes, we suggest sizing up for a more relaxed fit or sizing down for a more fitted look. You can also contact our customer service team at hello@essentials.com for personalized sizing advice.",
    },
    {
      question: "Are your products suitable for workouts?",
      answer:
        "Absolutely! Our pieces are designed for movement and performance. They feature moisture-wicking fabrics, four-way stretch, and thoughtful construction that supports your active lifestyle while maintaining a refined aesthetic. They're perfect for yoga, pilates, running, training, or everyday wear.",
    },
    {
      question: "How do I care for my Essentials pieces?",
      answer:
        "For best results, machine wash cold on a gentle cycle with like colors. Tumble dry low or air dry. Avoid fabric softeners and bleach as they can affect the technical properties of the fabric. Detailed care instructions are included with each garment and on product tags.",
    },
    {
      question: "Can I exchange an item?",
      answer:
        "To ensure you receive your preferred item quickly, we recommend returning your original item for a refund and placing a new order. If you prefer a direct exchange, please contact our customer service team at hello@essentials.com and we'll assist you with the process.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International orders may be subject to customs duties, taxes, and fees imposed by your destination country. These charges are the responsibility of the recipient and are not included in your order total. Shipping is free for all international orders.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter fulfillment and cannot be changed. Please contact us immediately at hello@essentials.com if you need to make changes to your order.",
    },
    {
      question: "What if I receive a damaged or defective item?",
      answer:
        "Quality is at the heart of everything we create. If you receive an item that's damaged or defective, please contact us within 7 days of delivery at hello@essentials.com with photos of the issue. We'll arrange for a replacement or full refund immediately.",
    },
    {
      question: "Do you have physical stores?",
      answer:
        "We currently operate as an online-first brand, allowing us to offer the best prices and widest selection without the overhead of physical retail locations. This approach also helps us maintain our commitment to sustainability by reducing our environmental footprint.",
    },
    {
      question: "How sustainable are your products?",
      answer:
        "Sustainability is core to our design philosophy. We use certified organic and recycled materials, produce in small batches to minimize waste, work with ethical factories ensuring fair wages, and offer a take-back program for worn pieces. We release just two thoughtful collections per year, designed to last seasons rather than weeks.",
    },
    {
      question: "Do you offer gift cards?",
      answer:
        "Yes! Gift cards are available in various denominations and can be purchased through our website. They make the perfect gift for anyone who values quality, sustainable athleisure. Gift cards are delivered via email and never expire.",
    },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-neutral-600">
              Find answers to common questions about our products, shipping, and
              policies
            </p>
          </div>

          <Accordion.Root type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="bg-white border border-neutral-200 overflow-hidden"
              >
                <Accordion.Trigger className="flex items-center justify-between w-full p-6 text-left group">
                  <span className="text-base font-semibold text-neutral-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown className="w-5 h-5 text-neutral-600 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
                </Accordion.Trigger>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-open data-[state=closed]:animate-accordion-close">
                  <div className="px-6 pb-6 text-neutral-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <div className="mt-16 text-center bg-white border border-neutral-200 p-8">
            <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-neutral-600 mb-6">
              Our customer service team is here to help
            </p>
            <a
              href="mailto:hello@essentials.com"
              className="inline-block bg-neutral-900 text-white px-8 py-3 hover:bg-neutral-800 transition-colors uppercase text-sm font-semibold tracking-wider"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
