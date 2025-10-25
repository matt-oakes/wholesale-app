import vine from "@vinejs/vine";

export const customerIdOptionalSchema = vine.object({
  customerId: vine.string().optional(),
});

export const customerIdOptionalValidator = vine.compile(
  customerIdOptionalSchema.clone().allowUnknownProperties(),
);
