import vine from "@vinejs/vine";
import { accountIdSchema } from "./account_id.js";

export const customerIdOptionalSchema = vine.object({
  customerId: vine.string().optional(),
});
export const customerIdOptionalValidator = vine.compile(
  customerIdOptionalSchema.clone().allowUnknownProperties(),
);

export const customerIdParamsSchema = vine.object({
  ...accountIdSchema.getProperties(),
  customerId: vine.string(),
});
export const customerIdParamsValidator = vine.compile(
  customerIdParamsSchema.clone(),
);
