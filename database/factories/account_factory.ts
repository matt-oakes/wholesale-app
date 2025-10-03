import Account from "#models/account";
import stringHelpers from "@adonisjs/core/helpers/string";
import factory from "@adonisjs/lucid/factories";
import { CategoryFactory } from "./category_factory.js";
import { ProductFactory } from "./product_factory.js";
import { UserFactory } from "./user_factory.js";

export const AccountFactory = factory
  .define(Account, async ({ faker }) => {
    const name = faker.company.name();
    return {
      name,
      slug: stringHelpers.camelCase(name).toLowerCase(),
    };
  })
  .relation("categories", () => CategoryFactory)
  .relation("products", () => ProductFactory)
  .relation("users", () => UserFactory)
  .build();
