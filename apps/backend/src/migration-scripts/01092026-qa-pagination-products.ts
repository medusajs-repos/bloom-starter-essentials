import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  PriceListStatus,
} from "@medusajs/framework/utils"
import {
  createPriceListsWorkflow,
  createProductTagsWorkflow,
  createProductsWorkflow,
  linkProductsToSalesChannelWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * QA fixture: 50 products, enough to exercise the search-backed product grid —
 * pagination past a single page, every facet with more than one bucket, and
 * every sort option with a non-trivial ordering.
 *
 * OPT-IN. This is a template repository, so the fixture only runs when
 * `SEED_QA_PRODUCTS=true`. Without it the script is a no-op, and a clone of the
 * template stays at the 12 real products from the initial seed.
 *
 * Every product it creates is handled `qa-*`, so cleaning up is one filter:
 *   delete from product where handle like 'qa-%';
 */

/** Products created, at 12 per page in the storefront: 5 pages. */
const PRODUCT_COUNT = 50

/** Handle prefix for everything this fixture owns. */
const HANDLE_PREFIX = "qa-"

/**
 * Every third product gets a sale price. `on_sale` and `discount_percentage` on
 * the search index are derived from `original_amount > calculated_amount`, which
 * only happens when a price list applies — plain variant prices would leave the
 * on-sale facet with a single bucket.
 */
const SALE_EVERY_NTH = 3
const SALE_DISCOUNT = 0.75

const CURRENCIES = ["usd", "eur", "gbp", "dkk"] as const

/**
 * Rough conversions from the USD amount. Only their relative order matters
 * here — the fixture exists to fill facets, not to be commercially accurate.
 */
const CURRENCY_MULTIPLIER: Record<(typeof CURRENCIES)[number], number> = {
  usd: 1,
  eur: 1,
  gbp: 0.85,
  dkk: 7.44,
}

/**
 * Deterministic PRNG (mulberry32) with a fixed seed. "Random" here means
 * "varied", not "different every run": a re-run has to produce the same 50
 * handles for the skip-what-exists check below to hold, and reproducible data
 * is what makes a facet count worth reporting in a bug.
 */
function createRandom(seed: number) {
  let state = seed

  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The leaf categories the initial seed creates. */
const CATEGORY_HANDLES = [
  "sweatshirts",
  "long-sleeves",
  "t-shirts",
  "bras",
  "jackets",
  "hoodies",
  "joggers",
  "leggings",
  "shorts",
]

/** The collections the initial seed creates. */
const COLLECTION_HANDLES = [
  "core-essentials",
  "studio-training",
  "outer-layers",
]

/** Feeds the index's `labels` facet, which no real product currently fills. */
const TAG_VALUES = [
  "new-arrival",
  "bestseller",
  "organic-cotton",
  "limited-edition",
  "everyday",
]

/** Garment nouns per category, so a generated title reads plausibly. */
const GARMENT_BY_CATEGORY: Record<string, string[]> = {
  sweatshirts: ["Sweatshirt", "Crewneck", "Pullover"],
  "long-sleeves": ["Long Sleeve Top", "Henley", "Base Layer"],
  "t-shirts": ["Tee", "Pocket Tee", "Boxy Tee"],
  bras: ["Sports Bra", "Support Bra", "Longline Bra"],
  jackets: ["Jacket", "Shell Jacket", "Coach Jacket"],
  hoodies: ["Hoodie", "Zip Hoodie", "Overhead Hoodie"],
  joggers: ["Jogger", "Track Pant", "Lounge Pant"],
  leggings: ["Legging", "Training Tight", "Contour Tight"],
  shorts: ["Short", "Training Short", "Lined Short"],
}

const MATERIALS = [
  "Cotton",
  "Merino",
  "Fleece",
  "Ribbed",
  "Brushed",
  "Linen",
  "Tech",
]

const QUALIFIERS = [
  "Everyday",
  "Studio",
  "Relaxed",
  "Tailored",
  "Lightweight",
  "Heavyweight",
  "Essential",
]

/** Reused from the initial seed so the generated cards are not all blank. */
const IMAGE_URLS = [
  "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-10--01KGSC538TNRBY8DF075E9628Z.jpeg",
  "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-10-2-01KGSC52W409H3Q50JC02JV0BR.jpeg",
  "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-11--01KGSC5418JV4T8KKCQ06CRQP4.jpeg",
  "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-11-2-01KGSC53MK9CFA4YD05M2J3VWS.jpeg",
  "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-3-01KGSARG88PY6CNQ15DYNC713F.jpeg",
  "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-4-01KGSARGR6P7GGYFNC9ZPGSVC6.jpeg",
]

/** Colors and sizes the initial seed registers as global product options. */
const COLORS = ["Sand", "Charcoal", "Olive", "White", "Black", "Grey"]
const SIZES = ["S", "M", "L", "XL"]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

export default async function migration_01092026_qa_pagination_products({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  if (process.env.SEED_QA_PRODUCTS !== "true") {
    return
  }

  const salesChannelModuleService = container.resolve(
    ModuleRegistrationName.SALES_CHANNEL
  )

  const [defaultSalesChannel] =
    await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    })

  if (!defaultSalesChannel) {
    logger.warn(
      "[qa-products] No default sales channel. Run the initial seed first; skipping."
    )
    return
  }

  // The fixture pins products to the categories, collections and global options
  // the initial seed creates. Without it there is nothing to attach them to.
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  })
  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
  })
  const { data: globalOptions } = await query.graph({
    entity: "product_option",
    fields: ["id", "title", "values.id", "values.value"],
    filters: { is_exclusive: false } as never,
  })

  const categoryIdByHandle = new Map<string, string>(
    categories.map((category: { handle: string; id: string }) => [
      category.handle,
      category.id,
    ])
  )
  const collectionIdByHandle = new Map<string, string>(
    collections.map((collection: { handle: string; id: string }) => [
      collection.handle,
      collection.id,
    ])
  )

  const optionByTitle = new Map(
    globalOptions.map(
      (option: {
        title: string
        id: string
        values?: { id: string; value: string }[]
      }) => [option.title, option]
    )
  )
  const colorOption = optionByTitle.get("Color")
  const sizeOption = optionByTitle.get("Size")

  if (!colorOption || !sizeOption) {
    logger.warn(
      "[qa-products] Global Color/Size options are missing. Run the initial seed first; skipping."
    )
    return
  }

  const valueId = (
    option: { values?: { id: string; value: string }[] },
    value: string
  ) => option.values?.find((entry) => entry.value === value)?.id

  const availableCategoryHandles = CATEGORY_HANDLES.filter((handle) =>
    categoryIdByHandle.has(handle)
  )
  const availableCollectionHandles = COLLECTION_HANDLES.filter((handle) =>
    collectionIdByHandle.has(handle)
  )

  if (!availableCategoryHandles.length) {
    logger.warn(
      "[qa-products] None of the expected categories exist. Run the initial seed first; skipping."
    )
    return
  }

  // Tags are created up front: a product takes `tag_ids`, not tag values.
  const { data: existingTags } = await query.graph({
    entity: "product_tag",
    fields: ["id", "value"],
  })
  const tagIdByValue = new Map<string, string>(
    existingTags.map((tag: { value: string; id: string }) => [tag.value, tag.id])
  )
  const missingTagValues = TAG_VALUES.filter(
    (value) => !tagIdByValue.has(value)
  )

  if (missingTagValues.length) {
    const { result: createdTags } = await createProductTagsWorkflow(
      container
    ).run({
      input: { product_tags: missingTagValues.map((value) => ({ value })) },
    })

    createdTags.forEach((tag: { id: string; value: string }) => {
      tagIdByValue.set(tag.value, tag.id)
    })
  }

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(
    existingProducts.map((product: { handle: string }) => product.handle)
  )

  const random = createRandom(20260901)
  const pick = <T,>(items: T[]) => items[Math.floor(random() * items.length)]

  type BuiltProduct = {
    payload: Record<string, unknown>
    /** USD list price, used to derive the sale price after creation. */
    basePrice: number
    onSale: boolean
  }

  const built: BuiltProduct[] = []
  const usedHandles = new Set<string>()

  for (let index = 0; index < PRODUCT_COUNT; index++) {
    // Round-robin rather than random, so every category and collection is
    // guaranteed a share instead of most-of-the-time getting one.
    const categoryHandle =
      availableCategoryHandles[index % availableCategoryHandles.length]
    const collectionHandle = availableCollectionHandles.length
      ? availableCollectionHandles[index % availableCollectionHandles.length]
      : undefined

    const garment = pick(GARMENT_BY_CATEGORY[categoryHandle] ?? ["Piece"])
    const title = `${pick(QUALIFIERS)} ${pick(MATERIALS)} ${garment}`
    // The number keeps titles unique where the word pool repeats a combination.
    const number = String(index + 1).padStart(2, "0")
    const handle = `${HANDLE_PREFIX}${slugify(title)}-${number}`

    if (existingHandles.has(handle) || usedHandles.has(handle)) {
      continue
    }

    usedHandles.add(handle)

    // 25–195, in steps of 5. Wide enough for the price-range facet to have a
    // real spread and for price sorting to be visibly ordered.
    const basePrice = 25 + Math.floor(random() * 35) * 5

    // 2–3 colors x 4 sizes: enough option values for that facet to be worth
    // opening, without 50 products x 24 variants.
    const colorCount = 2 + Math.floor(random() * 2)
    const colors: string[] = []
    while (colors.length < colorCount) {
      const color = pick(COLORS)
      if (!colors.includes(color)) {
        colors.push(color)
      }
    }

    const tagCount = 1 + Math.floor(random() * 2)
    const tags: string[] = []
    while (tags.length < tagCount) {
      const tag = pick(TAG_VALUES)
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }

    const thumbnail = IMAGE_URLS[index % IMAGE_URLS.length]
    const onSale = index % SALE_EVERY_NTH === 0

    built.push({
      basePrice,
      onSale,
      payload: {
        title,
        handle,
        subtitle: title,
        description: `${title} — QA fixture product ${number}, generated to fill the product grid's facets and pages.`,
        status: "published" as const,
        is_giftcard: false,
        discountable: true,
        thumbnail,
        images: [{ url: thumbnail }],
        category_ids: [categoryIdByHandle.get(categoryHandle)!],
        collection_id: collectionHandle
          ? collectionIdByHandle.get(collectionHandle)
          : undefined,
        tag_ids: tags
          .map((tag) => tagIdByValue.get(tag))
          .filter((id): id is string => Boolean(id)),
        options: [
          {
            id: colorOption.id,
            value_ids: colors
              .map((color) => valueId(colorOption, color))
              .filter((id): id is string => Boolean(id)),
          },
          {
            id: sizeOption.id,
            value_ids: SIZES.map((size) => valueId(sizeOption, size)).filter(
              (id): id is string => Boolean(id)
            ),
          },
        ],
        variants: colors.flatMap((color) =>
          SIZES.map((size) => ({
            title: `${size} / ${color}`,
            sku: `QA-${number}-${color.toUpperCase().slice(0, 4)}-${size}`,
            manage_inventory: false,
            options: { Color: color, Size: size },
            prices: CURRENCIES.map((currency) => ({
              currency_code: currency,
              amount: Math.round(basePrice * CURRENCY_MULTIPLIER[currency]),
            })),
          }))
        ),
      },
    })
  }

  if (!built.length) {
    logger.info("[qa-products] Fixture products already exist, skipping.")
    return
  }

  logger.info(`[qa-products] Creating ${built.length} products...`)

  const { result: createdProducts } = await createProductsWorkflow(
    container
  ).run({
    input: { products: built.map((entry) => entry.payload) as never },
  })

  await linkProductsToSalesChannelWorkflow(container).run({
    input: {
      id: defaultSalesChannel.id,
      add: createdProducts.map((product: { id: string }) => product.id),
    },
  })

  // One price list covering every discounted variant. `on_sale` on the index is
  // false for the rest, which is a real facet bucket rather than a gap.
  const salePrices: {
    amount: number
    currency_code: string
    variant_id: string
  }[] = []

  createdProducts.forEach(
    (product: { id: string; variants?: { id: string }[] }, index: number) => {
      const source = built[index]

      if (!source?.onSale) {
        return
      }

      for (const variant of product.variants ?? []) {
        for (const currency of CURRENCIES) {
          salePrices.push({
            variant_id: variant.id,
            currency_code: currency,
            amount: Math.round(
              source.basePrice * CURRENCY_MULTIPLIER[currency] * SALE_DISCOUNT
            ),
          })
        }
      }
    }
  )

  if (salePrices.length) {
    await createPriceListsWorkflow(container).run({
      input: {
        price_lists_data: [
          {
            title: "QA fixture sale",
            description:
              "Discounts the QA fixture's on-sale products, so the on-sale facet and the discount badge have data.",
            status: PriceListStatus.ACTIVE,
            prices: salePrices,
          },
        ],
      },
    })
  }

  const onSaleCount = built.filter((entry) => entry.onSale).length

  logger.info(
    `[qa-products] Created ${createdProducts.length} products (${onSaleCount} on sale) across ${availableCategoryHandles.length} categories.`
  )
  logger.info(
    "[qa-products] Run `npx medusa db:migrate:search` if the index schema changed, then restart so the documents sync."
  )
}
