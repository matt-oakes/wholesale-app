import vine from "@vinejs/vine";
import { accountIdSchema } from "./account_id.js";

export const orderIdSchema = vine.object({
  ...accountIdSchema.getProperties(),
  orderId: vine.string(),
});

export const orderIdParamsValidator = vine.compile(orderIdSchema.clone());
