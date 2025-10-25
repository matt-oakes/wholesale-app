import vine from "@vinejs/vine";
import { accountIdSchema } from "./account_id.js";

export const categoryIdSchema = vine.object({
  ...accountIdSchema.getProperties(),
  categoryId: vine.string(),
});

export const categoryIdParamsValidator = vine.compile(categoryIdSchema.clone());
