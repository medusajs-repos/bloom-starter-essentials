import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
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

  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data: pricePreferences } = await query.graph({
    entity: "price_preference",
    fields: ["id"],
  });

  if (pricePreferences.length > 0) {
    const ids = pricePreferences.map((pp) => pp.id);

    await container.resolve(Modules.PRICING).deletePricePreferences(ids);
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "usd",
            is_default: true,
          },
          {
            currency_code: "eur",
            is_tax_inclusive: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "US",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
          automatic_taxes: false,
          is_tax_inclusive: false,
        },
        {
          name: "Europe",
          currency_code: "eur",
          countries: europeanCountries,
          payment_providers: ["pp_system_default"],
          automatic_taxes: true,
          is_tax_inclusive: true,
        },
      ],
    },
  });
  const usRegion = regionResult[0];
  const europeRegion = regionResult[1];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  const taxRates: Record<string, { rate: number; code: string; name: string }> = {
    gb: { rate: 20, code: "GB20", name: "UK VAT" },
    de: { rate: 19, code: "DE19", name: "Germany VAT" },
    dk: { rate: 25, code: "DK25", name: "Denmark VAT" },
    se: { rate: 25, code: "SE25", name: "Sweden VAT" },
    fr: { rate: 20, code: "FR20", name: "France VAT" },
    es: { rate: 21, code: "ES21", name: "Spain VAT" },
    it: { rate: 22, code: "IT22", name: "Italy VAT" },
  };

  await createTaxRegionsWorkflow(container).run({
    input: europeanCountries.map((country_code) => {
      const taxConfig = taxRates[country_code];
      return {
        country_code,
        provider_id: "tp_system",
        default_tax_rate: {
          rate: taxConfig.rate,
          code: taxConfig.code,
          name: taxConfig.name,
          is_default: true,
        },
      };
    }),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Main Warehouse",
          address: {
            city: "",
            country_code: "US",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Main Warehouse Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Worldwide",
        geo_zones: ["us", ...europeanCountries].map((country_code) => ({
          country_code,
          type: "country" as const,
        })),
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Worldwide Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ships worldwide",
          code: "standard-worldwide",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");
}
