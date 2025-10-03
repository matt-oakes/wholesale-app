import Product from "#models/product";
import factory from "@adonisjs/lucid/factories";

export const ProductFactory = factory
  .define(Product, async ({ faker }) => {
    const priceRetail = Math.round(
      Number.parseFloat(faker.commerce.price()) * 100,
    );
    return {
      name: faker.commerce.productName(),
      priceWholesale: Math.round(priceRetail / 2.2),
      priceRetail,
      imageUrls: [faker.image.urlPicsumPhotos({ width: 1000, height: 1000 })],
    };
  })
  .build();
