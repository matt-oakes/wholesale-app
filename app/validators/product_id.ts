import vine from "@vinejs/vine";
import { accountIdSchema } from "./account_id.js";

export const productIdSchema = vine.object({
  ...accountIdSchema.getProperties(),
  productId: vine.string(),
});

export const productIdParamsValidator = vine.compile(
  productIdSchema.clone().allowUnknownProperties(),
);
