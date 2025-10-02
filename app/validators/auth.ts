import vine from "@vinejs/vine";

export const authLoginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().minLength(8),
    accountSlug: vine.string().trim().minLength(3).maxLength(255),
  }),
);

export const authRegisterValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(1).maxLength(255),
    lastName: vine.string().minLength(1).maxLength(255),
    email: vine.string().trim().email(),
    password: vine.string().minLength(8),
    accountSlug: vine.string().trim().minLength(3).maxLength(255),
    accountName: vine.string().trim().minLength(3).maxLength(255),
  }),
);
