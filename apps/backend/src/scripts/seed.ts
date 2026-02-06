import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  batchVariantImagesWorkflow,
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkProductsToSalesChannelWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const europeanCountries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });

    defaultSalesChannel = salesChannelResult;
  }

  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
        },
        {
          name: "Europe",
          currency_code: "eur",
          countries: europeanCountries,
        },
        {
          name: "United Kingdom",
          currency_code: "gbp",
          countries: ["gb"],
        },
        {
          name: "Denmark",
          currency_code: "dkk",
          countries: ["dk"],
        },
      ],
    },
  });

  // create publishable keys
  const { result: publishableKey } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Development",
          type: "publishable",
        },
      ],
    },
  });

  // link publishable key to sales channel
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableKey[0].id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // update the store with default settings
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "eur" },
          { currency_code: "gbp" },
          { currency_code: "dkk" },
        ],
        default_region_id: regions[0].id,
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  await createTaxRegionsWorkflow(container).run({
    input: regions.map((region: any) => ({
      country_code: region.countries.map((c: any) => c.iso_2)[0],
    })),
  });

  // default location
  const { result: stockLocations } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Main Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "dk",
            address_1: "123 Main St",
          },
        },
      ],
    },
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocations[0].id,
      add: [defaultSalesChannel[0].id],
    },
  });

  const fulfillmentSets =
    await fulfillmentModuleService.listFulfillmentSets();

  // Create shipping profile
  const { result: shippingProfiles } = await createShippingProfilesWorkflow(
    container
  ).run({
    input: {
      data: [
        {
          name: "Default",
          type: "default",
        },
      ],
    },
  });

  // Create shipping options for each region
  await createShippingOptionsWorkflow(container).run({
    input: regions.map((region: any, index: number) => ({
      name: "Standard Shipping",
      price_type: "flat",
      service_zone_id: fulfillmentSets[0].service_zones[0].id,
      shipping_profile_id: shippingProfiles[0].id,
      provider_id: "manual_manual",
      type: {
        label: "Standard",
        description: "Standard shipping",
        code: "standard",
      },
      prices: [
        {
          currency_code: region.currency_code,
          amount: 10,
        },
      ],
      rules: [
        {
          attribute: "customer_group",
          operator: "eq",
          value: "VIP",
        },
      ],
    })),
  });

  logger.info("Finished seeding regions and locations...");

  // Seed product categories
  logger.info("Seeding product categories...");
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });

  const categoryHandles = existingCategories.map((c: any) => c.handle);
  const categoriesToCreate = [];

  if (!categoryHandles.includes("tops")) {
    categoriesToCreate.push({
      name: "Tops",
      handle: "tops",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("bottoms")) {
    categoriesToCreate.push({
      name: "Bottoms",
      handle: "bottoms",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("sweatshirts")) {
    categoriesToCreate.push({
      name: "Sweatshirts",
      handle: "sweatshirts",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("long-sleeves")) {
    categoriesToCreate.push({
      name: "Long Sleeves",
      handle: "long-sleeves",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("t-shirts")) {
    categoriesToCreate.push({
      name: "T-Shirts",
      handle: "t-shirts",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("bras")) {
    categoriesToCreate.push({
      name: "Bras",
      handle: "bras",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("jackets")) {
    categoriesToCreate.push({
      name: "Jackets",
      handle: "jackets",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("hoodies")) {
    categoriesToCreate.push({
      name: "Hoodies",
      handle: "hoodies",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("joggers")) {
    categoriesToCreate.push({
      name: "Joggers",
      handle: "joggers",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("leggings")) {
    categoriesToCreate.push({
      name: "Leggings",
      handle: "leggings",
      is_active: true,
      is_internal: false,
    });
  }
  if (!categoryHandles.includes("shorts")) {
    categoriesToCreate.push({
      name: "Shorts",
      handle: "shorts",
      is_active: true,
      is_internal: false,
    });
  }

  if (categoriesToCreate.length > 0) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: categoriesToCreate,
      },
    });
  }

  // Get category IDs
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });

  const getCategoryId = (handle: string) => {
    const category = categories.find((c: any) => c.handle === handle);
    return category ? category.id : null;
  };

  logger.info("Finished seeding product categories.");

  // Helper functions
  const getAllImages = (colorImages: Record<string, string[]>) => {
    return Object.values(colorImages).flat();
  };

  const getFirstImage = (colorImages: Record<string, string[]>) => {
    const firstColor = Object.keys(colorImages)[0];
    return colorImages[firstColor][0];
  };

  // === CREWNECK SWEATSHIRT ===
  const crewneckSweatshirtImages = {
    Sand: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck1_1-01KGSCT0CNMZ7V81SH9F15DV6W.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck1_3-01KGSCT1CSXAJXSCZWV57CJPVK.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck1_2-01KGSCT0WNN9SFNV0JWMHV9B72.jpeg",
    ],
    Charcoal: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck2_1-01KGSCWGCHNRSDVAYR110F1HHM.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck2_3-01KGSCWH7RYVJD5JG3NY5H319T.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck2_2-01KGSCWGVMKEDRSNHZK5KR9P0E.jpeg",
    ],
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck3_2-01KGSCWJ2MA3EH4S03MBY49978.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck3_1-01KGSCWHKH6ZMASJ8CVBEZWCWX.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck3_3-01KGSCWJG2X3QP3PKT4E0K86M0.jpeg",
    ],
  };

  // === RELAXED JOGGER PANT ===
  const relaxedJoggerImages = {
    Charcoal: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-2-01KGSBR3R5A1KXA1MBX09R0YJ1.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-2-01KGSBR3R5A1KXA1MBX09R0YJ1.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-2-01KGSBR0QDAFTZF1RZ3BKEHWNT.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/jogger_3-1--01KGSE8J6J6R4MX4MBXS23A2JQ.jpeg",
    ],
  };

  // === RIBBED LONG SLEEVE TOP ===
  const ribbedLongSleeveImages = {
    Sand: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/ribbed_shirt2_front-01KGSE13JNVTDS7FENZXKCFTNX.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/ribbed_shirt2_zoom-01KGSE1460SM7KTBFME9E0ZM44.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/ribbed_shirt2_back-01KGSE12WG3NA5HVMVG01QQFNC.jpeg",
    ],
    Charcoal: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/ribbed_shirt_back-01KGSE1B4F15M9FPY40WMVPDD6.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/ribbed_shirt_zoom-01KGSE1BXYDSPXGBMD9QA8M94B.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/ribbed_shirt_front-01KGSE1BH59AK1ASMZ40JYRM7P.jpeg",
    ],
  };

  // === MINIMAL TEE ===
  const minimalTeeImages = {
    White: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-3-01KGSBVR4PGHBXD1HDT15MYD9H.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-3-01KGSARG88PY6CNQ15DYNC713F.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-3-01KGSARG88PY6CNQ15DYNC713F.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-3-01KGSBR1478FXAJCGEVGCXQR3C.jpeg",
    ],
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-2-01KGSBVTFE71N6CYS8ZQWSNHQD.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-3-01KGSARG88PY6CNQ15DYNC713F.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-7-2-01KGSC1D3AQKECBVKE4K0AQ9FS.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/crewneck3_3-01KGSEVWEPJMJ9XNNAEGMQEP86.jpeg",
    ],
    Black: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-9--01KGSC52E48079HX7AR6BA3Q0Z.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-11--01KGSC5418JV4T8KKCQ06CRQP4.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-3-01KGSARG88PY6CNQ15DYNC713F.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-10--01KGSC538TNRBY8DF075E9628Z.jpeg",
    ],
  };

  // === LIGHTWEIGHT TRAINING SHORT ===
  const lightweightTrainingShortImages = {
    Black: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-4-01KGSARGR6P7GGYFNC9ZPGSVC6.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-4-01KGSBR1FWQYV3EH1C68DKN46C.jpeg",
    ],
    Grey: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/jogger2_1-01KGSECPE6WH37YHY5VCY3MT4N.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/jogger2_2-01KGSECPWC73BYC0BZP5MY5410.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/jogger2_3-01KGSECQ8P1BR4WSAVV566P6SY.jpeg",
    ],
  };

  // === RIBBED SPORTS BRA ===
  const ribbedSportsBraImages = {
    Sand: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-4-01KGSBVTVHDK8ZJWKRN0D8XY5S.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-5-01KGSARH3BS8408VG20V5NX2HM.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-8-4-01KGSC1FD2MTY826F73904FTPW.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-7-4-01KGSC1DFVJHYE5YZJ47MQWXZD.jpeg",
    ],
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-5-01KGSBR1VJXZMB9YQZ0DEYVT7V.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-5-01KGSARH3BS8408VG20V5NX2HM.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-5-01KGSBVRGRRAC9K0NSHKDRJY0Y.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-5-01KGSARH3BS8408VG20V5NX2HM.jpeg",
    ],
  };

  // === PERFORMANCE LEGGING ===
  const performanceLeggingImages = {
    Charcoal: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-6-01KGSBR27V7F3G07P6NTSC1H0M.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-6-01KGSARHJNHSYSQP485SD61SV2.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-6-01KGSBVRY578V8GYVJ8PANB25S.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-6-01KGSBR27V7F3G07P6NTSC1H0M.jpeg",
    ],
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-7-5-01KGSC1DWZQZVQV7CNYPNSRNFN.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-8-5-01KGSC1FRSG8GV7QHN8XSHA9SN.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-5-01KGSBVV8EJC8CRAFQQKDXAX75.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-6-01KGSBR27V7F3G07P6NTSC1H0M.jpeg",
    ],
  };

  // === STUDIO ZIP JACKET ===
  const studioZipJacketImages = {
    Black: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-6-01KGSBVVMJHTEN9YGKS1PVEGY1.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-6-01KGSBVVMJHTEN9YGKS1PVEGY1.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-8-6-01KGSC1G51R6D791THRRYZYZ7E.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-7-6-01KGSC1E9SD81SDHXEKX1RX5F9.jpeg",
    ],
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-7-01KGSBVSA92HNH0S83YZ3ZHJVV.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-7-01KGSBQZDY0NTTDEEEW3PGR10N.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-6-01KGSBVVMJHTEN9YGKS1PVEGY1.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-7-01KGSBR2KFFSHAY2EC2XKY00NR.jpeg",
    ],
  };

  // === MOVEMENT WINDBREAKER ===
  const movementWindbreakerImages = {
    Sand: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-8-01KGSBR2ZZAKW4P5Y9JK18MWHG.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-8-01KGSBQZYP0GF1K8X1XWSR52Q7.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-8-01KGSBVSP59A7XHDG28ZWPFM1J.jpeg",
    ],
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-7-01KGSBVW0V6AJQ8DRTWYHWV45N.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-7-7-01KGSC1ENQZ7MDWG2NTET6P4HT.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-8-7-01KGSC1GRS18BZ8TWTF63VB8DV.jpeg",
    ],
  };

  // === TRAVEL HOODIE ===
  const travelHoodieImages = {
    "Off-White": [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-3-9-01KGSBR0AAFDBNH7ZJKJVMC1N6.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-5-9-01KGSBVT29E00TB0Q4F7147S8T.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-4-9-01KGSBR3BD9WBQ0YEC44M6M9JZ.jpeg",
    ],
  };

  // === QUILTED RECOVERY VEST ===
  const quiltedRecoveryVestImages = {
    Charcoal: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-7-8-01KGSC1F0YEC3PY0DWMP4G1JRT.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-6-8-01KGSC1CPN09ERH9B7N1G4RBFW.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-8-8-01KGSC5152ASPD1NJZ94JVHKJ8.jpeg",
    ],
  };

  // === WARM-UP OVERSHIRT ===
  const warmUpOvershirtImages = {
    Olive: [
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-9-2-01KGSC51ZZC5J8095Q3TDHBYJ1.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-11-2-01KGSC53MK9CFA4YD05M2J3VWS.jpeg",
      "https://cdn.mignite.app/ws/works_01KGFKTHDC6ZD3WS7GQTX8992N/-NanoBanana-2026-02-05-10-2-01KGSC52W409H3Q50JC02JV0BR.jpeg",
    ],
  };

  // Seed products
  logger.info("Seeding products...");
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  });

  const existingHandles = existingProducts.map((p: any) => p.handle);

  const productsToCreate = [
    {
      title: "Crewneck Sweatshirt",
      handle: "crewneck-sweatshirt",
      subtitle: null,
      description:
        "A heavyweight crewneck designed for everyday comfort with a structured, premium feel.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("sweatshirts")
        ? [getCategoryId("sweatshirts")!]
        : [],
      thumbnail: getFirstImage(crewneckSweatshirtImages),
      images: getAllImages(crewneckSweatshirtImages).map((url) => ({ url })),
      options: [
        { title: "Color", values: ["Sand", "Charcoal", "Olive"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Sand",
          sku: "ESS-CREW-SAND-S",
          manage_inventory: false,
          options: { Color: "Sand", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "M / Sand",
          sku: "ESS-CREW-SAND-M",
          manage_inventory: false,
          options: { Color: "Sand", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "L / Sand",
          sku: "ESS-CREW-SAND-L",
          manage_inventory: false,
          options: { Color: "Sand", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "XL / Sand",
          sku: "ESS-CREW-SAND-XL",
          manage_inventory: false,
          options: { Color: "Sand", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "S / Charcoal",
          sku: "ESS-CREW-CHAR-S",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "M / Charcoal",
          sku: "ESS-CREW-CHAR-M",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "L / Charcoal",
          sku: "ESS-CREW-CHAR-L",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "XL / Charcoal",
          sku: "ESS-CREW-CHAR-XL",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "S / Olive",
          sku: "ESS-CREW-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "M / Olive",
          sku: "ESS-CREW-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "L / Olive",
          sku: "ESS-CREW-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "ESS-CREW-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
      ],
      variantImageMap: crewneckSweatshirtImages,
    },
    {
      title: "Relaxed Jogger Pant",
      handle: "relaxed-jogger-pant",
      subtitle: null,
      description:
        "Minimalist joggers with a tailored silhouette—ideal for travel or downtime.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("joggers")
        ? [getCategoryId("joggers")!]
        : [],
      thumbnail: getFirstImage(relaxedJoggerImages),
      images: getAllImages(relaxedJoggerImages).map((url) => ({ url })),
      options: [
        { title: "Color", values: ["Charcoal"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Charcoal",
          sku: "RLX-JOG-CHAR-S",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "M / Charcoal",
          sku: "RLX-JOG-CHAR-M",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "L / Charcoal",
          sku: "RLX-JOG-CHAR-L",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "XL / Charcoal",
          sku: "RLX-JOG-CHAR-XL",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
      ],
      variantImageMap: relaxedJoggerImages,
    },
    {
      title: "Ribbed Long Sleeve Top",
      handle: "ribbed-long-sleeve-top",
      subtitle: null,
      description:
        "A refined layering piece with subtle rib texture and stretch.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("long-sleeves")
        ? [getCategoryId("long-sleeves")!]
        : [],
      thumbnail: getFirstImage(ribbedLongSleeveImages),
      images: getAllImages(ribbedLongSleeveImages).map((url) => ({ url })),
      options: [
        { title: "Color", values: ["Sand", "Charcoal"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Sand",
          sku: "RIB-LS-SAND-S",
          manage_inventory: false,
          options: { Color: "Sand", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "M / Sand",
          sku: "RIB-LS-SAND-M",
          manage_inventory: false,
          options: { Color: "Sand", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "L / Sand",
          sku: "RIB-LS-SAND-L",
          manage_inventory: false,
          options: { Color: "Sand", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "XL / Sand",
          sku: "RIB-LS-SAND-XL",
          manage_inventory: false,
          options: { Color: "Sand", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "S / Charcoal",
          sku: "RIB-LS-CHAR-S",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "M / Charcoal",
          sku: "RIB-LS-CHAR-M",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "L / Charcoal",
          sku: "RIB-LS-CHAR-L",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
        {
          title: "XL / Charcoal",
          sku: "RIB-LS-CHAR-XL",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 58 },
            { currency_code: "eur", amount: 58 },
            { currency_code: "gbp", amount: 49 },
            { currency_code: "dkk", amount: 432 },
          ],
        },
      ],
      variantImageMap: ribbedLongSleeveImages,
    },
    {
      title: "Minimal Tee",
      handle: "minimal-tee",
      subtitle: null,
      description:
        "Ultra-soft everyday tee with a clean neckline and athletic drape.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("t-shirts")
        ? [getCategoryId("t-shirts")!]
        : [],
      thumbnail: getFirstImage(minimalTeeImages),
      images: getAllImages(minimalTeeImages).map((url) => ({ url })),
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["White", "Olive", "Black"] },
      ],
      variants: [
        {
          title: "S / White",
          sku: "MIN-TEE-WHT-S",
          manage_inventory: false,
          options: { Color: "White", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "M / White",
          sku: "MIN-TEE-WHT-M",
          manage_inventory: false,
          options: { Color: "White", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "L / White",
          sku: "MIN-TEE-WHT-L",
          manage_inventory: false,
          options: { Color: "White", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "XL / White",
          sku: "MIN-TEE-WHT-XL",
          manage_inventory: false,
          options: { Color: "White", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "S / Olive",
          sku: "MIN-TEE-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "M / Olive",
          sku: "MIN-TEE-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "L / Olive",
          sku: "MIN-TEE-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "MIN-TEE-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "S / Black",
          sku: "MIN-TEE-BLK-S",
          manage_inventory: false,
          options: { Color: "Black", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "M / Black",
          sku: "MIN-TEE-BLK-M",
          manage_inventory: false,
          options: { Color: "Black", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "L / Black",
          sku: "MIN-TEE-BLK-L",
          manage_inventory: false,
          options: { Color: "Black", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
        {
          title: "XL / Black",
          sku: "MIN-TEE-BLK-XL",
          manage_inventory: false,
          options: { Color: "Black", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 38 },
            { currency_code: "eur", amount: 38 },
            { currency_code: "gbp", amount: 32 },
            { currency_code: "dkk", amount: 283 },
          ],
        },
      ],
      variantImageMap: minimalTeeImages,
    },
    {
      title: "Lightweight Training Short",
      handle: "lightweight-training-short",
      subtitle: null,
      description:
        "Breathable short with a clean waistband and built-in liner.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("shorts") ? [getCategoryId("shorts")!] : [],
      thumbnail: getFirstImage(lightweightTrainingShortImages),
      images: getAllImages(lightweightTrainingShortImages).map((url) => ({
        url,
      })),
      options: [
        { title: "Color", values: ["Black", "Grey"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Black",
          sku: "TRN-SHT-BLK-S",
          manage_inventory: false,
          options: { Color: "Black", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "M / Black",
          sku: "TRN-SHT-BLK-M",
          manage_inventory: false,
          options: { Color: "Black", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "L / Black",
          sku: "TRN-SHT-BLK-L",
          manage_inventory: false,
          options: { Color: "Black", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "XL / Black",
          sku: "TRN-SHT-BLK-XL",
          manage_inventory: false,
          options: { Color: "Black", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "S / Grey",
          sku: "TRN-SHT-CHAR-S",
          manage_inventory: false,
          options: { Color: "Grey", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "M / Grey",
          sku: "TRN-SHT-CHAR-M",
          manage_inventory: false,
          options: { Color: "Grey", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "L / Grey",
          sku: "TRN-SHT-CHAR-L",
          manage_inventory: false,
          options: { Color: "Grey", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
        {
          title: "XL / Grey",
          sku: "TRN-SHT-CHAR-XL",
          manage_inventory: false,
          options: { Color: "Grey", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 52 },
            { currency_code: "eur", amount: 52 },
            { currency_code: "gbp", amount: 44 },
            { currency_code: "dkk", amount: 387 },
          ],
        },
      ],
      variantImageMap: lightweightTrainingShortImages,
    },
    {
      title: "Ribbed Sports Bra",
      handle: "ribbed-sports-bra",
      subtitle: null,
      description:
        "Medium-support bra with minimalist seams and soft compression.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("bras") ? [getCategoryId("bras")!] : [],
      thumbnail: getFirstImage(ribbedSportsBraImages),
      images: getAllImages(ribbedSportsBraImages).map((url) => ({ url })),
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["Sand", "Olive"] },
      ],
      variants: [
        {
          title: "S / Sand",
          sku: "RIB-BRA-SAND-S",
          manage_inventory: false,
          options: { Color: "Sand", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "M / Sand",
          sku: "RIB-BRA-SAND-M",
          manage_inventory: false,
          options: { Color: "Sand", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "L / Sand",
          sku: "RIB-BRA-SAND-L",
          manage_inventory: false,
          options: { Color: "Sand", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "XL / Sand",
          sku: "RIB-BRA-SAND-XL",
          manage_inventory: false,
          options: { Color: "Sand", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "S / Olive",
          sku: "RIB-BRA-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "M / Olive",
          sku: "RIB-BRA-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "L / Olive",
          sku: "RIB-BRA-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "RIB-BRA-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 48 },
            { currency_code: "eur", amount: 48 },
            { currency_code: "gbp", amount: 41 },
            { currency_code: "dkk", amount: 357 },
          ],
        },
      ],
      variantImageMap: ribbedSportsBraImages,
    },
    {
      title: "Performance Legging",
      handle: "performance-legging",
      subtitle: null,
      description:
        "Sculpting high-rise leggings built for studio training and daily movement.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("leggings")
        ? [getCategoryId("leggings")!]
        : [],
      thumbnail: getFirstImage(performanceLeggingImages),
      images: getAllImages(performanceLeggingImages).map((url) => ({ url })),
      options: [
        { title: "Color", values: ["Charcoal", "Olive"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Charcoal",
          sku: "PERF-LEG-CHAR-S",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "M / Charcoal",
          sku: "PERF-LEG-CHAR-M",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "L / Charcoal",
          sku: "PERF-LEG-CHAR-L",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "XL / Charcoal",
          sku: "PERF-LEG-CHAR-XL",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "S / Olive",
          sku: "PERF-LEG-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "M / Olive",
          sku: "PERF-LEG-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "L / Olive",
          sku: "PERF-LEG-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "PERF-LEG-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 88 },
            { currency_code: "eur", amount: 88 },
            { currency_code: "gbp", amount: 75 },
            { currency_code: "dkk", amount: 655 },
          ],
        },
      ],
      variantImageMap: performanceLeggingImages,
    },
    {
      title: "Studio Zip Jacket",
      handle: "studio-zip-jacket",
      subtitle: null,
      description:
        "Streamlined zip layer designed for warmups and cool-downs.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("jackets")
        ? [getCategoryId("jackets")!]
        : [],
      thumbnail: getFirstImage(studioZipJacketImages),
      images: getAllImages(studioZipJacketImages).map((url) => ({ url })),
      options: [
        { title: "Color", values: ["Black", "Olive"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Black",
          sku: "STU-ZIP-BLK-S",
          manage_inventory: false,
          options: { Color: "Black", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "M / Black",
          sku: "STU-ZIP-BLK-M",
          manage_inventory: false,
          options: { Color: "Black", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "L / Black",
          sku: "STU-ZIP-BLK-L",
          manage_inventory: false,
          options: { Color: "Black", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "XL / Black",
          sku: "STU-ZIP-BLK-XL",
          manage_inventory: false,
          options: { Color: "Black", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "S / Olive",
          sku: "STU-ZIP-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "M / Olive",
          sku: "STU-ZIP-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "L / Olive",
          sku: "STU-ZIP-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "STU-ZIP-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 128 },
            { currency_code: "eur", amount: 128 },
            { currency_code: "gbp", amount: 109 },
            { currency_code: "dkk", amount: 953 },
          ],
        },
      ],
      variantImageMap: studioZipJacketImages,
    },
    {
      title: "Movement Windbreaker",
      handle: "movement-windbreaker",
      subtitle: null,
      description:
        "Featherlight outer shell for transitional weather and urban movement.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("jackets")
        ? [getCategoryId("jackets")!]
        : [],
      thumbnail: getFirstImage(movementWindbreakerImages),
      images: getAllImages(movementWindbreakerImages).map((url) => ({ url })),
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["Sand", "Olive"] },
      ],
      variants: [
        {
          title: "S / Sand",
          sku: "MOV-WIND-SAND-S",
          manage_inventory: false,
          options: { Color: "Sand", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "M / Sand",
          sku: "MOV-WIND-SAND-M",
          manage_inventory: false,
          options: { Color: "Sand", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "L / Sand",
          sku: "MOV-WIND-SAND-L",
          manage_inventory: false,
          options: { Color: "Sand", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "XL / Sand",
          sku: "MOV-WIND-SAND-XL",
          manage_inventory: false,
          options: { Color: "Sand", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "S / Olive",
          sku: "MOV-WIND-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "M / Olive",
          sku: "MOV-WIND-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "L / Olive",
          sku: "MOV-WIND-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "MOV-WIND-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 138 },
            { currency_code: "eur", amount: 138 },
            { currency_code: "gbp", amount: 117 },
            { currency_code: "dkk", amount: 1027 },
          ],
        },
      ],
      variantImageMap: movementWindbreakerImages,
    },
    {
      title: "Travel Hoodie",
      handle: "travel-hoodie",
      subtitle: null,
      description: "Elevated hoodie with clean lines and premium weight.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("hoodies")
        ? [getCategoryId("hoodies")!]
        : [],
      thumbnail: getFirstImage(travelHoodieImages),
      images: getAllImages(travelHoodieImages).map((url) => ({ url })),
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["Off-White"] },
      ],
      variants: [
        {
          title: "S / Off-White",
          sku: "TRV-HOOD-OWHT-S",
          manage_inventory: false,
          options: { Color: "Off-White", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 108 },
            { currency_code: "eur", amount: 108 },
            { currency_code: "gbp", amount: 92 },
            { currency_code: "dkk", amount: 804 },
          ],
        },
        {
          title: "M / Off-White",
          sku: "TRV-HOOD-OWHT-M",
          manage_inventory: false,
          options: { Color: "Off-White", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 108 },
            { currency_code: "eur", amount: 108 },
            { currency_code: "gbp", amount: 92 },
            { currency_code: "dkk", amount: 804 },
          ],
        },
        {
          title: "L / Off-White",
          sku: "TRV-HOOD-OWHT-L",
          manage_inventory: false,
          options: { Color: "Off-White", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 108 },
            { currency_code: "eur", amount: 108 },
            { currency_code: "gbp", amount: 92 },
            { currency_code: "dkk", amount: 804 },
          ],
        },
        {
          title: "XL / Off-White",
          sku: "TRV-HOOD-OWHT-XL",
          manage_inventory: false,
          options: { Color: "Off-White", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 108 },
            { currency_code: "eur", amount: 108 },
            { currency_code: "gbp", amount: 92 },
            { currency_code: "dkk", amount: 804 },
          ],
        },
      ],
      variantImageMap: travelHoodieImages,
    },
    {
      title: "Quilted Recovery Vest",
      handle: "quilted-recovery-vest",
      subtitle: null,
      description:
        "Minimal insulated vest designed for layering post-training.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("jackets")
        ? [getCategoryId("jackets")!]
        : [],
      thumbnail: getFirstImage(quiltedRecoveryVestImages),
      images: getAllImages(quiltedRecoveryVestImages).map((url) => ({ url })),
      options: [
        { title: "Color", values: ["Charcoal"] },
        { title: "Size", values: ["S", "M", "L", "XL"] },
      ],
      variants: [
        {
          title: "S / Charcoal",
          sku: "QUILT-VST-CHAR-S",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 118 },
            { currency_code: "eur", amount: 118 },
            { currency_code: "gbp", amount: 100 },
            { currency_code: "dkk", amount: 878 },
          ],
        },
        {
          title: "M / Charcoal",
          sku: "QUILT-VST-CHAR-M",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 118 },
            { currency_code: "eur", amount: 118 },
            { currency_code: "gbp", amount: 100 },
            { currency_code: "dkk", amount: 878 },
          ],
        },
        {
          title: "L / Charcoal",
          sku: "QUILT-VST-CHAR-L",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 118 },
            { currency_code: "eur", amount: 118 },
            { currency_code: "gbp", amount: 100 },
            { currency_code: "dkk", amount: 878 },
          ],
        },
        {
          title: "XL / Charcoal",
          sku: "QUILT-VST-CHAR-XL",
          manage_inventory: false,
          options: { Color: "Charcoal", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 118 },
            { currency_code: "eur", amount: 118 },
            { currency_code: "gbp", amount: 100 },
            { currency_code: "dkk", amount: 878 },
          ],
        },
      ],
      variantImageMap: quiltedRecoveryVestImages,
    },
    {
      title: "Warm-Up Overshirt",
      handle: "warm-up-overshirt",
      subtitle: null,
      description:
        "A structured overshirt jacket blending utility and comfort.",
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      category_ids: getCategoryId("jackets")
        ? [getCategoryId("jackets")!]
        : [],
      thumbnail: getFirstImage(warmUpOvershirtImages),
      images: getAllImages(warmUpOvershirtImages).map((url) => ({ url })),
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["Olive"] },
      ],
      variants: [
        {
          title: "S / Olive",
          sku: "WARM-OVR-OLIV-S",
          manage_inventory: false,
          options: { Color: "Olive", Size: "S" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "M / Olive",
          sku: "WARM-OVR-OLIV-M",
          manage_inventory: false,
          options: { Color: "Olive", Size: "M" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "L / Olive",
          sku: "WARM-OVR-OLIV-L",
          manage_inventory: false,
          options: { Color: "Olive", Size: "L" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
        {
          title: "XL / Olive",
          sku: "WARM-OVR-OLIV-XL",
          manage_inventory: false,
          options: { Color: "Olive", Size: "XL" },
          prices: [
            { currency_code: "usd", amount: 98 },
            { currency_code: "eur", amount: 98 },
            { currency_code: "gbp", amount: 83 },
            { currency_code: "dkk", amount: 729 },
          ],
        },
      ],
      variantImageMap: warmUpOvershirtImages,
    },
  ];

  const newProducts = productsToCreate.filter(
    (p) => !existingHandles.includes(p.handle)
  );

  if (newProducts.length > 0) {
    // Create products (without variantImageMap in the workflow input)
    const productsForWorkflow = newProducts.map(
      ({ variantImageMap, ...product }) => product
    );

    const { result: createdProducts } = await createProductsWorkflow(
      container
    ).run({
      input: {
        products: productsForWorkflow,
      },
    });

    // Link products to sales channel
    await linkProductsToSalesChannelWorkflow(container).run({
      input: {
        id: defaultSalesChannel[0].id,
        add: createdProducts.map((p) => p.id),
      },
    });

    // Assign images to variants
    logger.info("Assigning images to variants...");
    for (let i = 0; i < createdProducts.length; i++) {
      const createdProduct = createdProducts[i];
      const productConfig = newProducts[i];
      const variantImageMap = productConfig.variantImageMap;

      // Get the created product with images to find image IDs
      const {
        data: [productWithImages],
      } = await query.graph({
        entity: "product",
        fields: ["id", "images.*", "variants.*"],
        filters: { id: createdProduct.id },
      });

      // Create a map of URL to image ID
      const urlToImageId: Record<string, string> = {};
      for (const img of productWithImages.images || []) {
        urlToImageId[img.url] = img.id;
      }

      // Assign images to each variant
      for (const variant of productWithImages.variants || []) {
        const variantTitle = variant.title;
        const colorMatch = variantTitle.match(/\/ ([A-Za-z-]+)$/);
        const color = colorMatch ? colorMatch[1] : variantTitle;

        const variantUrls = variantImageMap[color];

        if (variantUrls && variantUrls.length > 0) {
          const imageIds = variantUrls
            .map((url: string) => urlToImageId[url])
            .filter((id: string | undefined): id is string => !!id);

          if (imageIds.length > 0) {
            await batchVariantImagesWorkflow(container).run({
              input: {
                variant_id: variant.id,
                add: imageIds,
                remove: [],
              },
            });
          }
        }
      }
    }

    logger.info(
      `Created ${createdProducts.length} products with variant images.`
    );
  } else {
    logger.info("Products already exist, skipping.");
  }

  logger.info("Finished seeding products.");
}