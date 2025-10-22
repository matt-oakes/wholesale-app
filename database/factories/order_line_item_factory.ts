import OrderLineItem from "#models/order_line_item";
import factory from "@adonisjs/lucid/factories";
import { OrderFactory } from "./order_factory.js";

export const OrderLineItemFactory = factory
  .define(OrderLineItem, async ({ faker }) => {
    const priceRetail = Math.round(
      Number.parseFloat(faker.commerce.price()) * 100,
    );
    return {
      name: faker.commerce.productName(),
      priceWholesale: Math.round(priceRetail / 2.2),
      priceRetail,
      imageUrls: [faker.image.urlPicsumPhotos({ width: 1000, height: 1000 })],
      categories: [faker.commerce.department()],
    };
  })
  .relation("order", () => OrderFactory)
  .build();
