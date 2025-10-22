import Category from "#models/category";
import factory from "@adonisjs/lucid/factories";
import { AccountFactory } from "./account_factory.js";
import { ProductFactory } from "./product_factory.js";

export const CategoryFactory = factory
  .define(Category, async ({ faker }) => {
    return {
      name: faker.commerce.department(),
      order: faker.number.int({ min: 0, max: 100, multipleOf: 5 }),
    };
  })
  .relation("account", () => AccountFactory)
  .relation("products", () => ProductFactory)
  .build();
