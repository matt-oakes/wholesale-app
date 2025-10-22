import Customer from "#models/customer";
import factory from "@adonisjs/lucid/factories";
import { AccountFactory } from "./account_factory.js";
import { OrderFactory } from "./order_factory.js";

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    const name = faker.company.name();
    return {
      name,
      billingEmail: faker.internet.email({ firstName: name }),
    };
  })
  .relation("account", () => AccountFactory)
  .relation("orders", () => OrderFactory)
  .build();
