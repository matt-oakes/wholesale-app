import vine from "@vinejs/vine";

export const accountIdSchema = vine.object({
  accountId: vine.string(),
});

export const accountIdParamsValidator = vine.compile(
  accountIdSchema.clone().allowUnknownProperties(),
);
