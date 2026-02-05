import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "@medusajs/icons"

interface AccordionItem {
  id: string
  title: string
  content: string | React.ReactNode
}

interface ProductAccordionsProps {
  items?: AccordionItem[]
}

const defaultItems: AccordionItem[] = [
  {
    id: "details",
    title: "Product Details",
    content: "High-quality athleisure essential crafted for all-day comfort and style.",
  },
  {
    id: "fit",
    title: "Fit & Size",
    content: (
      <div className="space-y-2">
        <p>True to size - we recommend taking your normal size</p>
        <p>Relaxed, comfortable fit designed for all-day wear</p>
        <p className="text-sm text-neutral-600 mt-4">
          <strong>Size Chart:</strong>
          <br />
          XS: Chest 31-33" | Waist 24-26"
          <br />
          S: Chest 34-36" | Waist 27-29"
          <br />
          M: Chest 37-39" | Waist 30-32"
          <br />
          L: Chest 40-42" | Waist 33-35"
        </p>
      </div>
    ),
  },
  {
    id: "fabric",
    title: "Fabric & Care",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Composition:</strong> 78% Recycled Polyester, 22% Elastane
        </p>
        <p>
          <strong>Care:</strong> Machine wash cold, gentle cycle. Tumble dry low. Do not bleach or iron.
        </p>
        <p className="text-sm text-neutral-600">
          Made with sustainable materials that feel good and do good.
        </p>
      </div>
    ),
  },
  {
    id: "shipping",
    title: "Shipping & Returns",
    content: (
      <div className="space-y-2">
        <p>
          <strong>Shipping:</strong> Free standard shipping on all orders. Express shipping available at checkout.
        </p>
        <p>
          <strong>Returns:</strong> 30-day returns for unworn items with tags attached. Free returns on all orders.
        </p>
      </div>
    ),
  },
]

export const ProductAccordions = ({ items = defaultItems }: ProductAccordionsProps) => {
  return (
    <Accordion.Root type="multiple" className="w-full">
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="border-b border-neutral-200"
        >
          <Accordion.Trigger className="flex items-center justify-between w-full py-5 text-left group">
            <span className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">
              {item.title}
            </span>
            <ChevronDown className="w-5 h-5 text-neutral-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-open data-[state=closed]:animate-accordion-close">
            <div className="pb-6 text-sm text-neutral-700 leading-relaxed">
              {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
