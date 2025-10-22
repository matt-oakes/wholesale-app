import Order from "#models/order";
import OrderLineItem from "#models/order_line_item";
import factory from "@adonisjs/lucid/factories";
import { AccountFactory } from "./account_factory.js";
import { CustomerFactory } from "./customer_factory.js";

export const OrderFactory = factory
  .define(Order, async ({ faker }) => {
    const customerName = faker.company.name();
    return {
      customerName,
      customerEmail: faker.internet.email({ firstName: customerName }),
      customerAddress: faker.location.streetAddress({ useFullAddress: true }),
    };
  })
  .relation("account", () => AccountFactory)
  .relation("customer", () => CustomerFactory)
  .relation("lineItems", () => OrderLineItem)
  .build();
